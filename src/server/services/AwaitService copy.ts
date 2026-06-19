import { Service, OnStart } from "@flamework/core";
import { ReplicatedStorage, ServerStorage, Players } from "@rbxts/services";
import { BanService } from "./BanService";

interface PlayerSession {
	lastHeartbeat: number;
}

@Service()
export class AntiCheatRemoteService implements OnStart {
	private playerSessions = new Map<Player, PlayerSession>();

	constructor(private banService: BanService) {}

	public onStart() {
		task.wait(0.5);

		const value = ServerStorage.GetAttribute("AntiCheatRemote") as string;
		const banEvent = ReplicatedStorage.WaitForChild(value) as RemoteEvent;

		Players.PlayerAdded.Connect((player) => {
			this.playerSessions.set(player, {
				lastHeartbeat: os.clock(),
			});
		});

		Players.PlayerRemoving.Connect((player) => {
			this.playerSessions.delete(player);
		});

		banEvent.OnServerEvent.Connect((player, actionName) => {
			if (typeOf(actionName) !== "string") return;

			if (actionName === "Ping") {
				const session = this.playerSessions.get(player);
				if (session) {
					session.lastHeartbeat = os.clock();
				}
				return;
			}

			this.banService.ban(player, actionName as string);
		});

		task.spawn(() => {
			while (task.wait(10)) {
				const currentTime = os.clock();
				for (const [player, session] of this.playerSessions) {
					if (!player.Parent) continue;

					const networkPing = player.GetNetworkPing();

					if (currentTime - session.lastHeartbeat > 420 && networkPing < 1.5) {
						this.playerSessions.delete(player);
						this.banService.ban(player, "vaa");
					}
				}
			}
		});
	}
}
