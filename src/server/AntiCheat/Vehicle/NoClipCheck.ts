import { Service, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

@Service()
export class VehicleNoclipCheck implements OnStart {
	private readonly vehiclesFolder = Workspace.WaitForChild("Vehicles") as Folder;
	private readonly overlapParams = new OverlapParams();

	public onStart() {
		this.overlapParams.FilterType = Enum.RaycastFilterType.Exclude;

		RunService.Heartbeat.Connect(() => {
			for (const player of Players.GetPlayers()) {
				const myCar = this.vehiclesFolder.FindFirstChild(player.Name) as Model | undefined;
				if (!myCar) continue;

				const driveSeat = (myCar.FindFirstChild("DriveSeat", true) ??
					myCar.FindFirstChildWhichIsA("VehicleSeat", true)) as VehicleSeat | undefined;

				let bodyPart = myCar.FindFirstChild("Body", true);

				if (bodyPart && !bodyPart.IsA("BasePart")) {
					bodyPart = bodyPart.FindFirstChild("Body") ?? bodyPart.FindFirstChildWhichIsA("BasePart");
				}

				if (!driveSeat || !bodyPart || !bodyPart.IsA("BasePart") || !driveSeat.Occupant) {
					continue;
				}

				if (!player.Character || driveSeat.Occupant.Parent !== player.Character) {
					continue;
				}

				this.overlapParams.FilterDescendantsInstances = [myCar, this.vehiclesFolder, player.Character];

				const overlappingParts = Workspace.GetPartBoundsInBox(
					bodyPart.CFrame,
					bodyPart.Size.mul(0.1),
					this.overlapParams,
				);

				let isNoclipping = false;

				for (const hitPart of overlappingParts) {
					if (hitPart.IsA("Terrain") || (hitPart.IsA("BasePart") && hitPart.CanCollide)) {
						isNoclipping = true;
						break;
					}
				}

				if (isNoclipping) {
					player.Kick("Anticheat: Noclip Detected");
				}
			}
		});
	}
}
