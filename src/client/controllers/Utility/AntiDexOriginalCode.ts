import { CoreController } from "../Main/Core";
import { Controller, OnStart } from "@flamework/core";
import { Players, HttpService, UserInputService, Stats, GuiService, Workspace } from "@rbxts/services";
import { CoreGuiController } from "./GuiAntiCheatController";

@Controller()
export class GuiAntiCheatController implements OnStart {
	constructor(private security: CoreController) {}

	public async onStart() {
		while (!CoreGuiController.Ready) {
			task.wait();
		}

		const localPlayer = Players.LocalPlayer;
		if (!localPlayer) return;

		const playerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;
		const Gui = new Instance("ScreenGui");
		Gui.Parent = playerGui;
		Gui.Name = HttpService.GenerateGUID(false);
		Gui.IgnoreGuiInset = false;
		Gui.ResetOnSpawn = false;
		Gui.DisplayOrder = 100;

		Gui.AncestryChanged.Connect((_, newParent) => {
			if (newParent !== playerGui) {
				this.security.fireBan("lb1");
			}
		});

		task.spawn(() => {
			while (Gui.Parent === playerGui) {
				task.wait(0.6);
				Gui.Name = HttpService.GenerateGUID(false);
				Gui.DisplayOrder = math.random(100 - 15, 100 + 15);
			}
		});

		const frames: Frame[] = [];

		const createFrame = (size: UDim2, position: UDim2): Frame => {
			const frame = new Instance("Frame");
			frame.Name = HttpService.GenerateGUID(false);
			frame.BackgroundTransparency = 1;
			frame.Visible = true;
			frame.Active = false;
			frame.AnchorPoint = new Vector2(0, 0);
			frame.Size = size;
			frame.Position = position;
			frame.Parent = Gui;

			frame.AncestryChanged.Connect((_, newParent) => {
				if (newParent !== Gui) {
					this.security.fireBan("lb1");
				}
			});

			frames.push(frame);
			return frame;
		};

		const isPC = UserInputService.KeyboardEnabled && UserInputService.MouseEnabled;
		const isMobile = UserInputService.TouchEnabled && !UserInputService.KeyboardEnabled;

		createFrame(new UDim2(0.74, 0, 0.65, 0), new UDim2(0.26, 0, 0, 0));
		const targetSearchFrame = createFrame(new UDim2(0.185, 0, 0.35, 0), new UDim2(0.816, 0, 0.65, 0));

		if (isPC) {
			createFrame(new UDim2(0.26, 0, 0.236, 0), new UDim2(0, 0, 0.414, 0));
			createFrame(new UDim2(0.821, 0, 0.351, 0), new UDim2(-0.006, 0, 0.65, 0));
		}

		if (isMobile) {
			createFrame(new UDim2(0.245, 0, 0.65, 0), new UDim2(0.572, 0, 0.359, 0));
		}

		const circle = new Instance("Frame");
		circle.BackgroundColor3 = new Color3(0, 1, 0);
		circle.AnchorPoint = new Vector2(0.5, 0.5);
		circle.Position = new UDim2(0.5, 0, 0.5, 0);
		circle.Visible = false;
		circle.Parent = Gui;

		const uiCorner = new Instance("UICorner");
		uiCorner.CornerRadius = new UDim(0.5, 0);
		uiCorner.Parent = circle;

		const MAX_RADIUS_PC = 203;
		const MOBILE_SCALE = 0.45;

		const updateVisualizer = () => {
			const camera = Workspace.CurrentCamera;
			if (camera) {
				const radius = math.min(MAX_RADIUS_PC, camera.ViewportSize.Y * MOBILE_SCALE);
				const diameter = radius * 2;
				circle.Size = new UDim2(0, diameter, 0, diameter);
			}
		};

		const camera = Workspace.CurrentCamera;
		if (camera) {
			camera.GetPropertyChangedSignal("ViewportSize").Connect(updateVisualizer);
			updateVisualizer();
		}

		let violations = 0;
		let memorySpiked = true;

		let tracking = false;
		let trackedText = "";
		const bannedwords = ["remotespy", "rspy", "dex", "odex", "cobalt", "cspy"];

		task.spawn(() => {
			while (true) {
				task.wait(400);
				if (violations > 0) {
					violations -= 1;
				}
			}
		});

		UserInputService.InputBegan.Connect((key, gp) => {
			if (key.UserInputType === Enum.UserInputType.Keyboard) {
				if (!tracking) return;

				if (key.KeyCode === Enum.KeyCode.Backspace) {
					if (trackedText.size() > 0) {
						trackedText = trackedText.sub(1, -2);
					}
					return;
				}

				if (key.KeyCode === Enum.KeyCode.Return || key.KeyCode === Enum.KeyCode.KeypadEnter) {
					const text = trackedText.lower();
					if (bannedwords.includes(text)) {
						violations += 1;
						if (violations >= 3) {
							localPlayer.Kick("");
						}
					}

					trackedText = "";
					tracking = false;
					return;
				}

				const Sstring = UserInputService.GetStringForKeyCode(key.KeyCode);
				if (Sstring) {
					if (Sstring !== "") {
						trackedText += Sstring.lower();
					}
				}
				return;
			}

			if (key.UserInputType !== Enum.UserInputType.MouseButton1) {
				if (key.UserInputType !== Enum.UserInputType.Touch) {
					return;
				}
			}

			const position = key.Position;
			let isInsideFrame = false;
			let clickedTargetFRAME = false;

			for (const frame of frames) {
				const APosition = frame.AbsolutePosition;
				const size = frame.AbsoluteSize;

				const inside =
					position.X >= APosition.X &&
					position.X <= APosition.X + size.X &&
					position.Y >= APosition.Y &&
					position.Y <= APosition.Y + size.Y;

				if (inside) {
					isInsideFrame = true;
					if (frame === targetSearchFrame) {
						clickedTargetFRAME = true;
					}
					break;
				}
			}

			if (!clickedTargetFRAME) {
				if (tracking) {
					tracking = false;
					trackedText = "";
				}
			}

			if (!memorySpiked) return;

			if (isInsideFrame) {
				if (gp) {
					const guiObjectsInMouse = playerGui.GetGuiObjectsAtPosition(position.X, position.Y);
					let ClickedGuiIsaGAMEGUI = false;

					for (const obj of guiObjectsInMouse) {
						if (obj.IsA("GuiObject")) {
							if (obj.Active) {
								if (!frames.includes(obj as Frame)) {
									ClickedGuiIsaGAMEGUI = true;
									break;
								}
							}
						}
					}

					if (GuiService.GetEmotesMenuOpen()) {
						const framePosition = circle.AbsolutePosition;
						const frameSize = circle.AbsoluteSize;

						const centerX = framePosition.X + frameSize.X / 2;
						const centerY = framePosition.Y + frameSize.Y / 2;
						const radius = frameSize.X / 2;

						const distance = new Vector2(position.X - centerX, position.Y - centerY).Magnitude;

						if (distance <= radius) {
							return;
						}
					}

					if (clickedTargetFRAME) {
						tracking = true;
						trackedText = "";
					}

					if (!clickedTargetFRAME) {
						violations += 1;
						if (violations >= 3) {
							localPlayer.Kick("");
						}
					}
				}
			}
		});
	}
}
