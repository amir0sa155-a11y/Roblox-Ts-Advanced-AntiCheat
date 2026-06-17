import { Service, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

interface TrackingData {
	validCFrame: CFrame;
	lastSyncTime: number;
	lastTick: number;
	timeSinceLastSync: number;
	stamina: number;
	wasInAir: boolean;
	lowStaminaRunTimer: number;
	lowStaminaJumpCount: number;
	noclipViolations: number;
	overlap: OverlapParams;
}

const settings = {
	maxWalkSpeed: 20,
	maxJumpPower: 50,
	speedTolerance: 2,
	jumpTolerance: 0,
	maxAllowedPing: 0.3,
	syncCooldown: 0.5,
};

@Service()
export class AntiCheatService implements OnStart {
	private trackingData = new Map<Player, TrackingData>();

	public onStart() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((char) => {
				const hrp = char.WaitForChild("HumanoidRootPart") as BasePart;

				const overlap = new OverlapParams();
				overlap.FilterType = Enum.RaycastFilterType.Exclude;

				const filterInstances: Instance[] = [char];
				if (Workspace.CurrentCamera) {
					filterInstances.push(Workspace.CurrentCamera);
				}

				overlap.FilterDescendantsInstances = filterInstances;

				this.trackingData.set(player, {
					validCFrame: hrp.CFrame,
					lastSyncTime: 0,
					lastTick: os.clock(),
					timeSinceLastSync: 0,
					stamina: 100,
					wasInAir: false,
					lowStaminaRunTimer: 0,
					lowStaminaJumpCount: 0,
					noclipViolations: 0,
					overlap,
				});
			});
		});

		Players.PlayerRemoving.Connect((player) => {
			this.trackingData.delete(player);
		});

		RunService.Heartbeat.Connect(() => {
			const now = os.clock();

			this.trackingData.forEach((data, player) => {
				const char = player.Character;
				if (!char) return;

				const hrp = char.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
				const hum = char.FindFirstChild("Humanoid") as Humanoid | undefined;
				if (!hrp || !hum || hum.Health <= 0) return;

				const dt = now - data.lastTick;
				if (dt <= 0) return;

				data.lastTick = now;
				data.timeSinceLastSync += dt;

				if (hum.SeatPart) {
					data.validCFrame = hrp.CFrame;
					data.lastSyncTime = now;
					data.timeSinceLastSync = 0;
					data.lowStaminaRunTimer = 0;
					data.lowStaminaJumpCount = 0;
					data.stamina = math.clamp(data.stamina + (100 / 37) * dt, 0, 100);
					return;
				}

				if (now - data.lastSyncTime < settings.syncCooldown) {
					hrp.CFrame = data.validCFrame;
					hrp.AssemblyLinearVelocity = Vector3.zero;
					hrp.AssemblyAngularVelocity = Vector3.zero;
					return;
				}

				const velocity = hrp.AssemblyLinearVelocity;
				const horizontalSpeed = new Vector3(velocity.X, 0, velocity.Z).Magnitude;
				const verticalSpeed = velocity.Y;

				const isRunning = horizontalSpeed >= 18.5;
				let justJumped = false;

				if (hum.FloorMaterial === Enum.Material.Air) {
					if (!data.wasInAir && verticalSpeed > 0) {
						justJumped = true;
						data.wasInAir = true;
					}
				} else {
					data.wasInAir = false;
				}

				if (justJumped) {
					if (data.stamina <= 7) data.lowStaminaJumpCount += 1;
					data.stamina -= 100 / 11;
				}

				if (isRunning) {
					if (data.stamina <= 3) data.lowStaminaRunTimer += dt;
					data.stamina -= (100 / 23) * dt;
				} else {
					if (data.stamina > 4) data.lowStaminaRunTimer = 0;
				}

				if (data.lowStaminaJumpCount >= 2 || data.lowStaminaRunTimer >= 2) {
					player.Kick("Anticheat: Infinity Stamina Detect");
					this.trackingData.delete(player);
					return;
				}

				if (!isRunning && hum.FloorMaterial !== Enum.Material.Air) {
					data.stamina += (100 / 37) * dt;
					if (data.stamina > 7) data.lowStaminaJumpCount = 0;
				}

				data.stamina = math.clamp(data.stamina, 0, 100);

				const currentCFrame = hrp.CFrame;
				let isClipping = false;

				const parts = Workspace.GetPartBoundsInBox(currentCFrame, hrp.Size.mul(0.5), data.overlap);

				for (const part of parts) {
					if (part.CanCollide && part.Transparency < 0.9 && !part.IsA("Terrain")) {
						if (part.Size.X > 1.2 && part.Size.Y > 1.2 && part.Size.Z > 1.2) {
							isClipping = true;
							break;
						}
					}
				}

				if (isClipping) {
					data.noclipViolations += 1;

					if (data.noclipViolations >= 7) {
						player.Kick("Anticheat: NoClip Detect");
						this.trackingData.delete(player);
						return;
					}

					hrp.CFrame = data.validCFrame;
					hrp.AssemblyLinearVelocity = Vector3.zero;
					hrp.AssemblyAngularVelocity = Vector3.zero;
					return;
				} else {
					data.noclipViolations = math.max(0, data.noclipViolations - dt * 0.5);
				}

				const currentPos = hrp.Position;
				const validPos = data.validCFrame.Position;

				const distMoved = new Vector3(currentPos.X, 0, currentPos.Z).sub(
					new Vector3(validPos.X, 0, validPos.Z),
				).Magnitude;

				const ping = player.GetNetworkPing();
				const cappedPing = math.clamp(ping, 0, settings.maxAllowedPing);

				let rubberBand = false;

				if (horizontalSpeed > settings.maxWalkSpeed + settings.speedTolerance) {
					rubberBand = true;
				}

				if (
					!rubberBand &&
					verticalSpeed > settings.maxJumpPower + settings.jumpTolerance &&
					hum.FloorMaterial === Enum.Material.Air
				) {
					rubberBand = true;
				}

				const maxAllowedDist =
					(settings.maxWalkSpeed + settings.speedTolerance) * (data.timeSinceLastSync + cappedPing) + 2;

				if (!rubberBand && distMoved > maxAllowedDist) {
					rubberBand = true;
				}

				if (rubberBand) {
					hrp.CFrame = data.validCFrame;
					hrp.AssemblyLinearVelocity = Vector3.zero;
					hrp.AssemblyAngularVelocity = Vector3.zero;
				} else {
					if (hum.FloorMaterial !== Enum.Material.Air) {
						data.validCFrame = hrp.CFrame;
						data.timeSinceLastSync = 0;
					}
				}
			});
		});
	}
}
