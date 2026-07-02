import { Service, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

@Service()
export class VehicleNoclipCheck implements OnStart {
	private readonly vehiclesFolder = Workspace.WaitForChild("Vehicles") as Folder;
	private readonly overlapParams = new OverlapParams();
	private readonly noclipTimers = new Map<Player, number>();

	public onStart() {
		this.overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		Players.PlayerRemoving.Connect((player) => {
			this.noclipTimers.delete(player);
		});

		RunService.Heartbeat.Connect(() => {
			const filterList: Instance[] = [this.vehiclesFolder];
			for (const p of Players.GetPlayers()) {
				if (p.Character) filterList.push(p.Character);
			}
			this.overlapParams.FilterDescendantsInstances = filterList;

			for (const player of Players.GetPlayers()) {
				const car = this.vehiclesFolder.FindFirstChild(player.Name) as Model | undefined;
				if (!car) {
					this.noclipTimers.delete(player);
					continue;
				}

				const driveSeat = (car.FindFirstChild("DriveSeat") ?? car.FindFirstChildWhichIsA("VehicleSeat")) as
					| VehicleSeat
					| undefined;

				let body = car.FindFirstChild("Body", true);

				if (body && !body.IsA("BasePart")) {
					body = body.FindFirstChild("Body") ?? body.FindFirstChildWhichIsA("BasePart");
				}

				if (!driveSeat || !body || !body.IsA("BasePart") || !driveSeat.Occupant) {
					this.noclipTimers.delete(player);
					continue;
				}

				if (!player.Character || driveSeat.Occupant.Parent !== player.Character) {
					this.noclipTimers.delete(player);
					continue;
				}

				const checkSize = new Vector3(body.Size.X * 0.5, body.Size.Y * 0.4, body.Size.Z * 0.5);
				const checkCFrame = body.CFrame.mul(new CFrame(0, body.Size.Y * 0.2, 0));

				const parts = Workspace.GetPartBoundsInBox(checkCFrame, checkSize, this.overlapParams);

				let isNoClipping = false;

				for (const hitPart of parts) {
					if (hitPart.IsA("Terrain") || (hitPart.IsA("BasePart") && hitPart.CanCollide)) {
						isNoClipping = true;
						break;
					}
				}

				if (isNoClipping) {
					const startTime = this.noclipTimers.get(player);
					if (startTime !== undefined) {
						if (os.clock() - startTime >= 1.5) {
							player.Kick("Anticheat: Noclip Detected");
							this.noclipTimers.delete(player);
						}
					} else {
						this.noclipTimers.set(player, os.clock());
					}
				} else {
					this.noclipTimers.delete(player);
				}
			}
		});
	}
}
