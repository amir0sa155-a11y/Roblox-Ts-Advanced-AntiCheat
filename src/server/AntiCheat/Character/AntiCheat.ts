import { Service, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

interface Data {
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
	private Data = new Map<Player, Data>();

	public onStart() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				const HumanOidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart;

				const overlap = new OverlapParams();
				overlap.FilterType = Enum.RaycastFilterType.Exclude;

				const filterInstances: Instance[] = [character];
				if (Workspace.CurrentCamera) {
					filterInstances.push(Workspace.CurrentCamera);
				}

				overlap.FilterDescendantsInstances = filterInstances;

				this.Data.set(player, {
					validCFrame: HumanOidRootPart.CFrame,
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
			this.Data.delete(player);
		});

		RunService.Heartbeat.Connect(() => {
			const now = os.clock();

			this.Data.forEach((data, player) => {
				const character = player.Character;
				if (!character) return;

				const HumanOidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
				const humanoid = character.FindFirstChild("Humanoid") as Humanoid | undefined;
				if (!HumanOidRootPart || !humanoid || humanoid.Health <= 0) return;

				const delta = now - data.lastTick;
				if (delta <= 0) return;

				data.lastTick = now;
				data.timeSinceLastSync += delta;

				if (humanoid.SeatPart) {
					data.validCFrame = HumanOidRootPart.CFrame;
					data.lastSyncTime = now;
					data.timeSinceLastSync = 0;
					data.lowStaminaRunTimer = 0;
					data.lowStaminaJumpCount = 0;
					data.stamina = math.clamp(data.stamina + (100 / 37) * delta, 0, 100);
					return;
				}

				if (now - data.lastSyncTime < settings.syncCooldown) {
					HumanOidRootPart.CFrame = data.validCFrame;
					HumanOidRootPart.AssemblyLinearVelocity = Vector3.zero;
					HumanOidRootPart.AssemblyAngularVelocity = Vector3.zero;
					return;
				}

				const velocity = HumanOidRootPart.AssemblyLinearVelocity;
				const groundSpeed = new Vector3(velocity.X, 0, velocity.Z).Magnitude;
				const verticalSpeed = velocity.Y;

				const isRunning = groundSpeed >= 18.5;
				let justJumped = false;

				if (humanoid.FloorMaterial === Enum.Material.Air) {
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
					if (data.stamina <= 3) data.lowStaminaRunTimer += delta;
					data.stamina -= (100 / 23) * delta;
				} else {
					if (data.stamina > 4) data.lowStaminaRunTimer = 0;
				}

				if (data.lowStaminaJumpCount >= 2 || data.lowStaminaRunTimer >= 2) {
					player.Kick("Anticheat: Infinity Stamina Detect");
					this.Data.delete(player);
					return;
				}

				if (!isRunning && humanoid.FloorMaterial !== Enum.Material.Air) {
					data.stamina += (100 / 37) * delta;
					if (data.stamina > 7) data.lowStaminaJumpCount = 0;
				}

				data.stamina = math.clamp(data.stamina, 0, 100);

				const currentCFrame = HumanOidRootPart.CFrame;
				let isClipping = false;

				const parts = Workspace.GetPartBoundsInBox(currentCFrame, HumanOidRootPart.Size.mul(0.5), data.overlap);

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
						this.Data.delete(player);
						return;
					}

					HumanOidRootPart.CFrame = data.validCFrame;
					HumanOidRootPart.AssemblyLinearVelocity = Vector3.zero;
					HumanOidRootPart.AssemblyAngularVelocity = Vector3.zero;
					return;
				} else {
					data.noclipViolations = math.max(0, data.noclipViolations - delta * 0.5);
				}

				const currentPos = HumanOidRootPart.Position;
				const validPos = data.validCFrame.Position;

				const distMoved = new Vector3(currentPos.X, 0, currentPos.Z).sub(
					new Vector3(validPos.X, 0, validPos.Z),
				).Magnitude;

				const ping = player.GetNetworkPing();
				const cappedPing = math.clamp(ping, 0, settings.maxAllowedPing);

				let rubberBand = false;

				if (groundSpeed > settings.maxWalkSpeed + settings.speedTolerance) {
					rubberBand = true;
				}

				if (
					!rubberBand &&
					verticalSpeed > settings.maxJumpPower + settings.jumpTolerance &&
					humanoid.FloorMaterial === Enum.Material.Air
				) {
					rubberBand = true;
				}

				const maxDistance =
					(settings.maxWalkSpeed + settings.speedTolerance) * (data.timeSinceLastSync + cappedPing) + 2;

				if (!rubberBand && distMoved > maxDistance) {
					rubberBand = true;
				}

				if (rubberBand) {
					HumanOidRootPart.CFrame = data.validCFrame;
					HumanOidRootPart.AssemblyLinearVelocity = Vector3.zero;
					HumanOidRootPart.AssemblyAngularVelocity = Vector3.zero;
				} else {
					if (humanoid.FloorMaterial !== Enum.Material.Air) {
						data.validCFrame = HumanOidRootPart.CFrame;
						data.timeSinceLastSync = 0;
					}
				}
			});
		});
	}
}
