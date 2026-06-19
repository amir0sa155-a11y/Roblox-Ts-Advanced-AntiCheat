import { Controller, OnStart } from "@flamework/core";
import { Players, HttpService, Workspace, UserInputService, Stats } from "@rbxts/services";
import { CoreGuiController } from "./GuiAntiCheatController";

@Controller()
export class GuiAntiCheatController implements OnStart {
	public async onStart() {
		while (!CoreGuiController.Ready) {
			task.wait();
		}

		const localPlayer = Players.LocalPlayer;
		if (!localPlayer) return;

		const playerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;
		const camera = Workspace.CurrentCamera;
		const detectGui = new Instance("ScreenGui");
		detectGui.Name = HttpService.GenerateGUID(false);
		detectGui.IgnoreGuiInset = true;
		detectGui.ResetOnSpawn = false;
		detectGui.Parent = playerGui;

		const frame = new Instance("TextButton");
		frame.Name = HttpService.GenerateGUID(false);
		frame.Text = "";
		frame.BackgroundTransparency = 1;
		frame.Active = true;
		frame.Visible = true;

		frame.AnchorPoint = new Vector2(1, 0.5);
		frame.Position = new UDim2(1.04, -20, 0.5, 0);
		frame.Size = new UDim2(0.209, 0, 1.001, 0);
		frame.Parent = detectGui;

		const uiScale = new Instance("UIScale");
		uiScale.Parent = frame;

		const updateUI = () => {
			if (camera) {
				const viewportSize = camera.ViewportSize;
				const scaleFactor = viewportSize.Y / 1080;
				uiScale.Scale = math.clamp(scaleFactor, 0.5, 1.5);
			}
		};

		if (camera) {
			camera.GetPropertyChangedSignal("ViewportSize").Connect(updateUI);
			updateUI();
		}

		let violations = 0;
		let memorySpiked = false;
		let lastMemory = Stats.GetTotalMemoryUsageMb();
		let lastClickTime = 0;

		task.spawn(() => {
			while (true) {
				task.wait(1);
				const currentMemory = Stats.GetTotalMemoryUsageMb();
				const memoryDifferent = currentMemory - lastMemory;

				if (memoryDifferent > 60) {
					memorySpiked = true;
				}

				if (math.abs(memoryDifferent) >= 20) {
					lastMemory = currentMemory;
				}
			}
		});

		task.spawn(() => {
			while (true) {
				task.wait(300);
				if (violations > 0) {
					violations -= 1;
				}
			}
		});

		frame.MouseButton1Click.Connect(() => {
			lastClickTime = os.clock();
		});

		UserInputService.InputBegan.Connect((input) => {
			if (
				input.UserInputType !== Enum.UserInputType.MouseButton1 &&
				input.UserInputType !== Enum.UserInputType.Touch
			) {
				return;
			}

			if (!memorySpiked) return;

			const position = input.Position;
			const APosition = frame.AbsolutePosition;
			const size = frame.AbsoluteSize;

			const inside =
				position.X >= APosition.X &&
				position.X <= APosition.X + size.X &&
				position.Y >= APosition.Y &&
				position.Y <= APosition.Y + size.Y;

			if (inside) {
				const inputTime = os.clock();

				task.wait(0.3);

				if (lastClickTime < inputTime) {
					violations += 1;

					if (violations >= 3) {
						localPlayer.Kick("");
					}
				}
			}
		});
	}
}
