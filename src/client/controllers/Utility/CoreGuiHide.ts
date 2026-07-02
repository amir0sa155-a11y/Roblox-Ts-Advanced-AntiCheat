import { Controller, OnStart } from "@flamework/core";
import { StarterGui } from "@rbxts/services";

@Controller()
export class CoreGuiController implements OnStart {
	public static Ready = false;

	public onStart() {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);
		CoreGuiController.Ready = true;
	}
}
	