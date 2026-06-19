import { Service, OnStart } from "@flamework/core";
import { Players, Workspace, RunService } from "@rbxts/services";
// some systems in this script were created with the help of AI such as lag compensation
interface VehicleHistory {
	time: number;
	cframe: CFrame;
	size: Vector3;
}

interface VehicleState {
	history: VehicleHistory[];
}

@Service()
export class VehicleAngleCheck implements OnStart {
	private readonly maxDot = math.sin(math.rad(15));
	private states = new Map<Player, { lastVehicleTouch: number; lastPartTouch: number }>();
	private vehicleStates = new Map<Model, VehicleState>();

	private overlapParams = new OverlapParams();
	private raycastcastParams = new RaycastParams();

	private maxPing = 0.6;
	private dataBufferLimit = 1.7;

	private vehiclesFolder = Workspace.FindFirstChild("Vehicles") as Folder | undefined;

	public onStart() {
		this.overlapParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.raycastcastParams.FilterType = Enum.RaycastFilterType.Exclude;

		if (!this.vehiclesFolder) {
			this.vehiclesFolder = Workspace.WaitForChild("Vehicles") as Folder;
		}

		RunService.Heartbeat.Connect((dt) => {
			if (1 / dt <= 10) return;

			const now = os.clock();

			this.updateVehiclesHistory(now);

			for (const player of Players.GetPlayers()) {
				this.checkPlayer(player, now);
			}
		});

		Players.PlayerRemoving.Connect((player) => {
			this.states.delete(player);
		});
	}

	private updateVehiclesHistory(now: number) {
		if (!this.vehiclesFolder) return;

		for (const vehicle of this.vehiclesFolder.GetChildren()) {
			if (!vehicle.IsA("Model")) continue;

			const body = vehicle.FindFirstChild("Body") as BasePart;
			if (!body) continue;

			if (!this.vehicleStates.has(vehicle)) {
				this.vehicleStates.set(vehicle, {
					history: [],
				});
			}

			const state = this.vehicleStates.get(vehicle)!;

			state.history.push({
				time: now,
				cframe: body.CFrame,
				size: body.Size,
			});

			state.history = state.history.filter((record) => now - record.time <= this.dataBufferLimit);
		}
	}

	private HistoryAtTime(history: VehicleHistory[], targetTime: number) {
		if (history.size() === 0) return undefined;

		let closest = history[0];
		let minDiff = math.abs(history[0].time - targetTime);

		for (const record of history) {
			const diff = math.abs(record.time - targetTime);

			if (diff < minDiff) {
				minDiff = diff;
				closest = record;
			}
		}

		return closest;
	}

	private isColliding(cf1: CFrame, size1: Vector3, cf2: CFrame, size2: Vector3) {
		const distance = cf1.Position.sub(cf2.Position).Magnitude;

		const radius1 = size1.Magnitude / 2;
		const radius2 = size2.Magnitude / 2;

		return distance <= (radius1 + radius2) * 1.2;
	}

	private checkPlayer(player: Player, now: number) {
		if (!this.vehiclesFolder) return;

		const myCar = this.vehiclesFolder.FindFirstChild(player.Name) as Model | undefined;
		if (!myCar) return;

		const driveSeat = (myCar.FindFirstChild("DriveSeat") ?? myCar.FindFirstChildWhichIsA("VehicleSeat")) as
			| VehicleSeat
			| undefined;

		const bodyInstance = myCar.FindFirstChild("Body");
		let body: BasePart | undefined;

		if (!driveSeat || !bodyInstance) return;

		if (bodyInstance.IsA("BasePart")) {
			body = bodyInstance;
		} else {
			body = (bodyInstance.FindFirstChildWhichIsA("BasePart") ?? bodyInstance.FindFirstChild("Body")) as
				| BasePart
				| undefined;
		}

		if (!body) return;

		const occupant = driveSeat.Occupant;
		if (!occupant || occupant.Parent !== player.Character) return;

		if (!this.states.has(player)) {
			this.states.set(player, {
				lastVehicleTouch: 0,
				lastPartTouch: 0,
			});
		}

		const state = this.states.get(player)!;

		const ping = math.min(player.GetNetworkPing(), this.maxPing);

		const velocity = body.AssemblyLinearVelocity;
		const hitboxSize = body.Size.mul(1.1);

		this.overlapParams.FilterDescendantsInstances = [myCar, player.Character as Instance];
		this.raycastcastParams.FilterDescendantsInstances = [myCar, player.Character as Instance];

		let touchingVehicle = false;
		let touchingObject = false;

		const speed = velocity.Magnitude;
		const castDistance = math.clamp(speed * ping, 0.1, 100);

		if (speed > 5) {
			const direction = velocity.Unit;

			const castResult = Workspace.Blockcast(
				body.CFrame,
				hitboxSize,
				direction.mul(castDistance),
				this.raycastcastParams,
			);

			if (castResult) {
				const hitTarget = castResult.Instance;

				if (hitTarget.CanCollide) {
					if (hitTarget.IsDescendantOf(this.vehiclesFolder)) {
						touchingVehicle = true;
					} else {
						touchingObject = true;
					}
				}
			}
		}

		const parts = Workspace.GetPartBoundsInBox(body.CFrame, hitboxSize, this.overlapParams);

		for (const part of parts) {
			if (!part.CanCollide) continue;

			if (part.IsDescendantOf(this.vehiclesFolder)) {
				touchingVehicle = true;
			} else {
				touchingObject = true;
			}
		}

		if (!touchingVehicle) {
			const pastTime = now - ping;

			for (const [otherVehicle, vehicleState] of this.vehicleStates) {
				if (otherVehicle === myCar) continue;

				const History = this.HistoryAtTime(vehicleState.history, pastTime);

				if (!History) continue;

				if (this.isColliding(body.CFrame, hitboxSize, History.cframe, History.size)) {
					touchingVehicle = true;
				}
			}
		}

		const raycast = Workspace.Raycast(body.Position, new Vector3(0, -4, 0), this.raycastcastParams);

		if (raycast?.Instance?.IsA("Terrain")) {
			touchingObject = true;
		}

		if (touchingVehicle) state.lastVehicleTouch = now;
		if (touchingObject) state.lastPartTouch = now;

		if (touchingVehicle || touchingObject) return;

		const look = driveSeat.CFrame.LookVector;
		const vertical = look.Y;

		const groundDistance = body.Size.Y / 2 + 15;
		const groundCheck = Workspace.Raycast(
			body.Position,
			new Vector3(0, -groundDistance, 0),
			this.raycastcastParams,
		);

		const violating = !groundCheck;
		const goingUp = vertical > this.maxDot;
		const goingDown = vertical < -this.maxDot;

		if (goingUp || goingDown || violating) {
			if (now - state.lastPartTouch <= 0.8) return;
			if (now - state.lastVehicleTouch <= 3) return;

			player.Kick("Anticheat: VehicleFly Detect");
		}
	}
}
