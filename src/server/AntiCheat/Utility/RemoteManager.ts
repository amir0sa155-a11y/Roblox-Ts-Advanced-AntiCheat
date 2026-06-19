import { OnStart, Service } from "@flamework/core";
import { Players, ReplicatedStorage, HttpService, ServerStorage } from "@rbxts/services";

@Service()
export class AntiCheatRemoteService implements OnStart {
	maxRequests = 1;
	giveRequests = new Map<number, number>();

	secureRemote!: RemoteEvent;
	giveRemote!: RemoteEvent;

	public onStart() {
		const name = HttpService.GenerateGUID(false);
		this.secureRemote = new Instance("RemoteEvent");
		this.secureRemote.Name = name;
		this.secureRemote.Parent = ReplicatedStorage;

		ServerStorage.SetAttribute("AntiCheatRemote", name);

		this.giveRemote = new Instance("RemoteEvent");
		this.giveRemote.Name = "Give";
		this.giveRemote.Parent = ReplicatedStorage;

		this.giveRemote.OnServerEvent.Connect((player) => {
			const userId = player.UserId;

			const current = (this.giveRequests.get(userId) ?? 0) + 1;
			this.giveRequests.set(userId, current);

			if (current > this.maxRequests) {
				player.Kick("Exploit detected");
				return;
			}

			this.giveRemote.FireClient(player, name);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.giveRequests.delete(player.UserId);
		});
	}
}
