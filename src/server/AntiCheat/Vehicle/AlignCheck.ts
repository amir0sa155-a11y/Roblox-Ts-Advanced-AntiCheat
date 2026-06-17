import { Service, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

@Service()
export class VehicleAlignCheck implements OnStart {
	private readonly vehiclesFolder = Workspace.WaitForChild("Vehicles") as Folder;

	private readonly lastPositionMap = new Map<number, Vector3>();
	private readonly timerMap = new Map<number, number>();
	private readonly lastVehicleTouchMap = new Map<number, number>();
	private readonly joinTimeMap = new Map<number, number>();

	public onStart() {
		Players.PlayerAdded.Connect((player) => {
			this.joinTimeMap.set(player.UserId, os.clock());
			this.timerMap.set(player.UserId, 0);
			this.lastVehicleTouchMap.set(player.UserId, 0);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.joinTimeMap.delete(player.UserId);
			this.timerMap.delete(player.UserId);
			this.lastVehicleTouchMap.delete(player.UserId);
			this.lastPositionMap.delete(player.UserId);
		});

		RunService.Heartbeat.Connect((dTime) => {
			for (const player of Players.GetPlayers()) {
				const userId = player.UserId;
				const joinTime = this.joinTimeMap.get(userId) ?? 0;

				if (os.clock() - joinTime < 1) continue;

				const myCar = this.vehiclesFolder.FindFirstChild(player.Name) as Model | undefined;

				if (!myCar) {
					this.lastPositionMap.delete(userId);
					this.timerMap.set(userId, 0);
					continue;
				}

				const driveSeat = (myCar.FindFirstChild("DriveSeat", true) ??
					myCar.FindFirstChildWhichIsA("VehicleSeat", true)) as VehicleSeat | undefined;

				const bodyFolderOrPart = myCar.FindFirstChild("Body", true);

				let bodyPart: BasePart | undefined;

				if (bodyFolderOrPart) {
					bodyPart = bodyFolderOrPart.IsA("BasePart")
						? bodyFolderOrPart
						: ((bodyFolderOrPart.FindFirstChild("Body") ??
								bodyFolderOrPart.FindFirstChildWhichIsA("BasePart")) as BasePart | undefined);
				}

				if (!driveSeat || !bodyPart) {
					this.lastPositionMap.delete(userId);
					this.timerMap.set(userId, 0);
					continue;
				}

				const occupant = driveSeat.Occupant;

				if (occupant && occupant.Parent === player.Character) {
					const bodyCFrame = bodyPart.CFrame;
					const bodyPosition = bodyPart.Position;

					const overlapParams = new OverlapParams();
					overlapParams.FilterType = Enum.RaycastFilterType.Exclude;
					overlapParams.FilterDescendantsInstances = [myCar, player.Character!];

					const partsInBox = Workspace.GetPartBoundsInBox(bodyCFrame, bodyPart.Size.mul(1.2), overlapParams);

					let isTouchingAnotherVehicle = false;
					let isTouchingTerrain = false;

					for (const part of partsInBox) {
						if (part.IsA("Terrain")) {
							isTouchingTerrain = true;
							break;
						}

						if (part.CanCollide && part.Transparency !== 1) {
							if (part.IsDescendantOf(this.vehiclesFolder) && !part.IsDescendantOf(myCar)) {
								isTouchingAnotherVehicle = true;
							}
						}
					}

					if (isTouchingAnotherVehicle) {
						this.lastVehicleTouchMap.set(userId, os.clock());
					}

					const rayParams = new RaycastParams();
					rayParams.FilterType = Enum.RaycastFilterType.Exclude;
					rayParams.FilterDescendantsInstances = [myCar, player.Character!];

					const rayResult = Workspace.Raycast(bodyPosition, new Vector3(0, -15, 0), rayParams);

					const isFloating = rayResult === undefined;

					const lookVector = driveSeat.CFrame.LookVector;

					let isStillSuspect = false;

					const lastPosition = this.lastPositionMap.get(userId);

					if (lastPosition && !isTouchingTerrain) {
						const dPosition = bodyPosition.sub(lastPosition);
						const flatDelta = new Vector3(dPosition.X, 0, dPosition.Z);

						const speed = flatDelta.Magnitude / dTime;

						if (speed > 15) {
							const moveDir = flatDelta.Unit;
							const flatLook = new Vector3(lookVector.X, 0, lookVector.Z);

							if (flatLook.Magnitude > 0.001) {
								const alignment = math.abs(flatLook.Unit.Dot(moveDir));

								if (alignment < 0.7 || (isFloating && alignment < 0.85)) {
									const lastVehicleTouch = this.lastVehicleTouchMap.get(userId) ?? 0;

									if (os.clock() - lastVehicleTouch > 0.5) {
										isStillSuspect = true;
									}
								}
							}
						}
					}

					let timer = this.timerMap.get(userId) ?? 0;

					if (isStillSuspect && !isTouchingTerrain) {
						timer += dTime;

						if (timer >= 2) {
							player.Kick("Anticheat: VehicleFly Detect");
						}
					} else {
						timer = math.max(0, timer - dTime * 1.5);
					}

					this.timerMap.set(userId, timer);
					this.lastPositionMap.set(userId, bodyPosition);
				} else {
					this.lastPositionMap.delete(userId);
					this.timerMap.set(userId, 0);
				}
			}
		});
	}
}
