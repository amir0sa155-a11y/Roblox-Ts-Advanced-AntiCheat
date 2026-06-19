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
				const myCar = this.vehiclesFolder.FindFirstChild(player.Name) as Model | undefined;
				if (!myCar) {
					this.noclipTimers.delete(player);
					continue;
				}

				const driveSeat = (myCar.FindFirstChild("DriveSeat", true) ??
					myCar.FindFirstChildWhichIsA("VehicleSeat", true)) as VehicleSeat | undefined;

				let bodyPart = myCar.FindFirstChild("Body", true);

				if (bodyPart && !bodyPart.IsA("BasePart")) {
					bodyPart = bodyPart.FindFirstChild("Body") ?? bodyPart.FindFirstChildWhichIsA("BasePart");
				}

				if (!driveSeat || !bodyPart || !bodyPart.IsA("BasePart") || !driveSeat.Occupant) {
					this.noclipTimers.delete(player);
					continue;
				}

				if (!player.Character || driveSeat.Occupant.Parent !== player.Character) {
					this.noclipTimers.delete(player);
					continue;
				}

				const checkSize = new Vector3(bodyPart.Size.X * 0.5, bodyPart.Size.Y * 0.4, bodyPart.Size.Z * 0.5);
				const checkCFrame = bodyPart.CFrame.mul(new CFrame(0, bodyPart.Size.Y * 0.2, 0));

				const overlappingParts = Workspace.GetPartBoundsInBox(checkCFrame, checkSize, this.overlapParams);

				let isNoclipping = false;

				for (const hitPart of overlappingParts) {
					if (hitPart.IsA("Terrain") || (hitPart.IsA("BasePart") && hitPart.CanCollide)) {
						isNoclipping = true;
						break;
					}
				}

				if (isNoclipping) {
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
