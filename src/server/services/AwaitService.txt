import { Service, OnStart } from "@flamework/core";
import { ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { BanService } from "./BanService";

@Service()
export class AntiCheatRemoteService implements OnStart {
	constructor(private banService: BanService) {}

	public onStart() {
		task.wait(0.5);

		const value = ServerStorage.GetAttribute("AntiCheatRemote") as string;
		const banEvent = ReplicatedStorage.WaitForChild(value) as RemoteEvent;

		banEvent.OnServerEvent.Connect((player, actionName) => {
			print(actionName);

			this.banService.executeBan(player, actionName as string);
		});
	}
}
