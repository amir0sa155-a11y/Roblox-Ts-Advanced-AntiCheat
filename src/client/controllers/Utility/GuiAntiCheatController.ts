import { Controller, OnStart } from "@flamework/core";
import { StarterGui } from "@rbxts/services";

@Controller()
export class CoreGuiController implements OnStart {
	public static Ready = false;

	public onStart() {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false);
		CoreGuiController.Ready = true;
	}
}
