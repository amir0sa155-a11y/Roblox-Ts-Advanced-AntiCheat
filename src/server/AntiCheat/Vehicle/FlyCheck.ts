import { OnStart, Service } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

// some systems in this script were created with the help of AI such as lag compensation

interface playerStats {
	yAxisHistory: Array<{ time: number; y: number }>;
	partWhitelistEnd: number;
	vehicleWhitelistEnd: number;
	WhiteListCheck: number;
	Kicked: boolean;
	airStartTime: number;
	lastYDirection: "Up" | "Down" | "None";
	bounceCount: number;
	violationTimer: number;
}

interface vehicleHistory {
	time: number;
	cframe: CFrame;
	size: Vector3;
}

interface vehicleState {
	history: vehicleHistory[];
	whitelistEnd: number;
}

@Service()
export class VehicleFlyCheck implements OnStart {
	private playerStates = new Map<Player, playerStats>();
	private vehicleStates = new Map<Model, vehicleState>();

	private overlapParams = new OverlapParams();
	private raycastParams = new RaycastParams();

	private maxPing = 0.6;
	private partWhiteListTime = 0.8;
	private vehicleWhiteListTime = 3;
	private dataBufferLimit = 1.7;

	private vehiclesFolder = Workspace.FindFirstChild("Vehicles") as Folder;

	public onStart() {
		this.overlapParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

		RunService.Heartbeat.Connect(() => {
			const now = os.clock();

			this.updateVehiclesHistory(now);

			for (const player of Players.GetPlayers()) {
				this.checkPlayerVehicle(player, now);
			}
		});

		Players.PlayerRemoving.Connect((player) => {
			this.playerStates.delete(player);
		});
	}

	private updateVehiclesHistory(now: number) {
		for (const vehicle of this.vehiclesFolder.GetChildren()) {
			if (!vehicle.IsA("Model")) continue;

			const bodyPart = vehicle.FindFirstChild("Body", true) as BasePart | undefined;
			if (!bodyPart) continue;

			if (!this.vehicleStates.has(vehicle)) {
				this.vehicleStates.set(vehicle, {
					history: [],
					whitelistEnd: 0,
				});
			}

			const state = this.vehicleStates.get(vehicle)!;

			state.history.push({
				time: now,
				cframe: bodyPart.CFrame,
				size: bodyPart.Size,
			});

			state.history = state.history.filter((record) => now - record.time <= this.dataBufferLimit);
		}
	}

	private findHistoryAtTime(history: vehicleHistory[], targetTime: number) {
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

	private getPlayerState(player: Player) {
		if (!this.playerStates.has(player)) {
			this.playerStates.set(player, {
				yAxisHistory: [],
				partWhitelistEnd: 0,
				vehicleWhitelistEnd: 0,
				WhiteListCheck: 0,
				Kicked: false,
				airStartTime: 0,
				lastYDirection: "None",
				bounceCount: 0,
				violationTimer: 0,
			});
		}

		return this.playerStates.get(player)!;
	}

	private checkPlayerVehicle(player: Player, now: number) {
		const state = this.getPlayerState(player);
		if (state.Kicked) return;

		const character = player.Character;

		const myCar = this.vehiclesFolder.FindFirstChild(player.Name) as Model | undefined;

		const bodyPart = myCar?.FindFirstChild("Body", true) as BasePart | undefined;

		const driveSeat = myCar?.FindFirstChildWhichIsA("VehicleSeat", true);

		const primaryPart = myCar?.PrimaryPart;

		if (
			!myCar ||
			!character ||
			!bodyPart ||
			!driveSeat ||
			!primaryPart ||
			driveSeat.Occupant?.Parent !== character
		) {
			this.resetAirState(state);
			return;
		}

		const ping = math.min(player.GetNetworkPing(), this.maxPing);

		const velocity = bodyPart.AssemblyLinearVelocity;

		const hitboxSize = bodyPart.Size.mul(1.1);

		this.overlapParams.FilterDescendantsInstances = [myCar, character];
		this.raycastParams.FilterDescendantsInstances = [myCar, character];

		let isHittingVehicle = false;
		let isHittingPart = false;
		let willHitCar = false;
		let willHit = false;

		const speed = velocity.Magnitude;

		const castDistance = math.clamp(speed * ping, 0.1, 100);

		if (speed > 5) {
			const direction = velocity.Unit;

			const castResult = Workspace.Blockcast(
				bodyPart.CFrame,
				hitboxSize,
				direction.mul(castDistance),
				this.raycastParams,
			);

			if (castResult) {
				const hitTarget = castResult.Instance;

				if (hitTarget.CanCollide) {
					if (hitTarget.IsDescendantOf(this.vehiclesFolder)) {
						willHitCar = true;
					} else {
						willHit = true;
					}
				}
			}
		}

		const parts = Workspace.GetPartBoundsInBox(bodyPart.CFrame, hitboxSize, this.overlapParams);

		for (const part of parts) {
			if (!part.CanCollide) continue;

			if (part.IsDescendantOf(this.vehiclesFolder)) {
				isHittingVehicle = true;

				const model = part.FindFirstAncestorWhichIsA("Model");

				if (model && this.vehicleStates.has(model)) {
					this.vehicleStates.get(model)!.whitelistEnd = now + this.vehicleWhiteListTime;
				}
			} else {
				isHittingPart = true;
			}
		}

		if (!isHittingVehicle) {
			const pastTime = now - ping;

			for (const [otherVehicle, vehicleState] of this.vehicleStates) {
				if (otherVehicle === myCar) continue;

				const pastSnapshot = this.findHistoryAtTime(vehicleState.history, pastTime);

				if (!pastSnapshot) continue;

				if (this.isColliding(bodyPart.CFrame, hitboxSize, pastSnapshot.cframe, pastSnapshot.size)) {
					isHittingVehicle = true;
					vehicleState.whitelistEnd = now + this.vehicleWhiteListTime;
				}
			}
		}

		if (willHitCar || willHit) {
			state.WhiteListCheck = now + ping + 0.5;
		}

		if (isHittingPart) {
			state.partWhitelistEnd = now + this.partWhiteListTime;
		}

		if (isHittingVehicle) {
			state.vehicleWhitelistEnd = now + this.vehicleWhiteListTime;
		}

		if (now <= state.partWhitelistEnd) {
			this.resetAirState(state, primaryPart.Position.Y);
			return;
		}

		const currentY = primaryPart.Position.Y;

		state.yAxisHistory.push({
			time: now,
			y: currentY,
		});

		state.yAxisHistory = state.yAxisHistory.filter((record) => now - record.time <= 1.5);

		let currentActualVelY = velocity.Y;

		if (state.yAxisHistory.size() >= 2) {
			const prev = state.yAxisHistory[state.yAxisHistory.size() - 2];

			const dt = now - prev.time;

			if (dt > 0.001) {
				currentActualVelY = (currentY - prev.y) / dt;
			}
		}

		if (math.abs(currentActualVelY - velocity.Y) > 15) {
			if (state.violationTimer === 0) {
				state.violationTimer = now;
			}

			if (now - state.violationTimer >= 0.5) {
				state.Kicked = true;
				this.playerStates.delete(player);
				player.Kick("Anticheat: VehicleFly Detect - v1a");
				return;
			}
		} else {
			state.violationTimer = 0;
		}

		if (state.airStartTime === 0) {
			state.airStartTime = now;
		}

		const airDuration = now - state.airStartTime;

		if (state.yAxisHistory.size() >= 2) {
			const prev = state.yAxisHistory[state.yAxisHistory.size() - 2];

			const deltaY = currentY - prev.y;

			if (math.abs(deltaY) > 0.4) {
				const direction = deltaY > 0 ? "Up" : "Down";

				if (state.lastYDirection !== "None" && state.lastYDirection !== direction) {
					state.bounceCount++;
					state.lastYDirection = direction;

					if (state.bounceCount >= 2) {
						state.Kicked = true;
						this.playerStates.delete(player);
						player.Kick("Anticheat: VehicleFly Detect - b15");
						return;
					}
				} else if (state.lastYDirection === "None") {
					state.lastYDirection = direction;
				}
			}
		}

		if (now <= state.vehicleWhitelistEnd || now <= state.WhiteListCheck) return;

		if (airDuration >= 0.5) {
			const history05 = state.yAxisHistory.filter((r) => now - r.time <= 0.5);

			if (history05.size() >= 2 && this.calculateYVariance(history05) <= 0.5) {
				state.Kicked = true;
				this.playerStates.delete(player);
				player.Kick("Anticheat: VehicleFly Detect - ab1");
				return;
			}
		}

		if (airDuration >= 1) {
			const history10 = state.yAxisHistory.filter((r) => now - r.time <= 1);

			if (history10.size() >= 2 && this.calculateYVariance(history10) < 10) {
				state.Kicked = true;
				this.playerStates.delete(player);
				player.Kick("Anticheat: VehicleFly Detect - 1a1");
			}
		}
	}

	private resetAirState(state: playerStats, currentY?: number) {
		state.airStartTime = 0;
		state.lastYDirection = "None";
		state.bounceCount = 0;
		state.violationTimer = 0;
		state.yAxisHistory = currentY !== undefined ? [{ time: os.clock(), y: currentY }] : [];
	}

	private calculateYVariance(records: Array<{ time: number; y: number }>) {
		if (records.size() === 0) return 0;

		let minY = records[0].y;
		let maxY = records[0].y;

		for (const record of records) {
			if (record.y < minY) minY = record.y;
			if (record.y > maxY) maxY = record.y;
		}

		return math.abs(maxY - minY);
	}
}
