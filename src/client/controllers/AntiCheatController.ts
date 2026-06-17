import { Controller, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { CoreSecurityController } from "./Core";

@Controller()
export class MovementAntiCheatController implements OnStart {
	constructor(private readonly security: CoreSecurityController) {}

	public onStart() {
		this.security.waitForReady();

		const LocalPlayer = Players.LocalPlayer;

		const movementClasses = [
			"LinearVelocity",
			"BodyGyro",
			"BodyVelocity",
			"BodyPosition",
			"BodyThrust",
			"BodyForce",
			"AngularVelocity",
			"AlignPosition",
			"AlignOrientation",
			"VectorForce",
		];

		Workspace.DescendantAdded.Connect((descendant) => {
			if (movementClasses.includes(descendant.ClassName)) {
				this.security.fireBan("ma1");
			}
		});

		const setupAntiCheat = (character: Model) => {
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;

			for (const part of character.GetChildren()) {
				if (part.IsA("BasePart")) {
					const name = part.Name;

					if (name === "UpperTorso" || name === "LowerTorso" || name === "Torso") {
						part.GetPropertyChangedSignal("CanCollide").Connect(() => {
							if (!part.CanCollide) {
								this.security.fireBan("2ff");
							}
						});
					}
				}
			}

			let jumpCount = 0;

			humanoid.StateChanged.Connect((_, newState) => {
				if (newState === Enum.HumanoidStateType.Jumping && humanoid.FloorMaterial === Enum.Material.Air) {
					jumpCount++;

					if (jumpCount > 1) {
						this.security.fireBan("2ht");
					}
				} else if (humanoid.FloorMaterial !== Enum.Material.Air) {
					jumpCount = 0;
				}
			});

			humanoid.GetPropertyChangedSignal("JumpHeight").Connect(() => {
				if (humanoid.JumpHeight > 7.2) {
					this.security.fireBan("3t4");
				}
			});

			humanoid.GetPropertyChangedSignal("PlatformStand").Connect(() => {
				if (humanoid.PlatformStand && humanoid.SeatPart === undefined) {
					this.security.fireBan("5cv");
				}
			});

			humanoid.GetPropertyChangedSignal("WalkSpeed").Connect(() => {
				if (humanoid.WalkSpeed > 20) {
					this.security.fireBan("ng6");
				}
			});

			humanoid.GetPropertyChangedSignal("JumpPower").Connect(() => {
				if (humanoid.JumpPower > 50) {
					this.security.fireBan("a3f");
				}
			});
		};

		if (LocalPlayer.Character) {
			setupAntiCheat(LocalPlayer.Character);
		}

		LocalPlayer.CharacterAdded.Connect((character) => {
			setupAntiCheat(character);
		});
	}
}
