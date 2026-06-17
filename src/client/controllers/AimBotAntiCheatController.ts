import { Controller, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";
import { CoreSecurityController } from "./Core";

@Controller()
export class AimBotDetectionController implements OnStart {
	constructor(private readonly security: CoreSecurityController) {}

	public onStart() {
		this.security.waitForReady();
		const player = Players.LocalPlayer;
		const camera = Workspace.CurrentCamera as Camera;

		const timers = new Map<number, number>();
		const violations = new Map<number, number>();

		const maxViolations = 3;

		RunService.Heartbeat.Connect((deltaTime: number) => {
			const localChar = player.Character;
			const localRoot = localChar?.FindFirstChild("HumanoidRootPart") as BasePart | undefined;

			const localVelocity = localRoot ? localRoot.AssemblyLinearVelocity.Magnitude : 0;

			const viewportSize = camera.ViewportSize;
			const screenCenter = new Vector2(viewportSize.X / 2, viewportSize.Y / 2);

			const allPlayers = Players.GetPlayers();

			for (const otherPlayer of allPlayers) {
				if (otherPlayer === player) continue;

				const userId = otherPlayer.UserId;

				const otherChar = otherPlayer.Character;
				if (!otherChar) continue;

				const humanoid = otherChar.FindFirstChild("Humanoid") as Humanoid | undefined;
				const rootPart = otherChar.FindFirstChild("HumanoidRootPart") as BasePart | undefined;

				if (!humanoid || humanoid.Health <= 25 || !rootPart) {
					timers.set(userId, 0);
					continue;
				}

				const targetVelocity = rootPart.AssemblyLinearVelocity.Magnitude;

				if (targetVelocity <= 16 || localVelocity <= 16) {
					timers.set(userId, 0);
					continue;
				}

				let isLocked = false;

				const bodyParts = ["Head", "HumanoidRootPart", "UpperTorso", "Torso"];

				for (const partName of bodyParts) {
					const part = otherChar.FindFirstChild(partName) as BasePart | undefined;

					if (part) {
						const [screenPos, onScreen] = camera.WorldToViewportPoint(part.Position);

						if (onScreen && screenPos) {
							const distance = new Vector2(screenPos.X, screenPos.Y).sub(screenCenter).Magnitude;

							if (distance <= 2) {
								isLocked = true;
								break;
							}
						}
					}
				}

				if (isLocked) {
					const currentTimer = (timers.get(userId) || 0) + deltaTime;

					timers.set(userId, currentTimer);

					const requiredTime = humanoid.SeatPart !== undefined ? 3 : 2;

					if (currentTimer >= requiredTime) {
						const currentViolations = (violations.get(userId) || 0) + 1;

						if (currentViolations >= maxViolations) {
							this.security.fireBan("la5");
						} else {
							violations.set(userId, currentViolations);
							timers.set(userId, 0);
						}
					}
				} else {
					const currentTimer = timers.get(userId) || 0;

					if (currentTimer > 0) {
						timers.set(userId, math.max(0, currentTimer - deltaTime * 2));
					}
				}
			}
		});
	}
}
