import { Service, OnStart } from "@flamework/core";
import { Players, DataStoreService } from "@rbxts/services";

interface AliasConfig {
	PrivateReason: string;
	DisplayReason: string;
	Duration: number;
	InstantBan: boolean;
	ApplyToAlts: boolean;
	Delay: [number, number];
}

interface BanData {
	BanTime: number;
	Reason: string;
	DisplayMessage: string;
	BanDuration: number;
	ApplyToAlts: boolean;
}

@Service()
export class BanService implements OnStart {
	public static instance: BanService;
	private BanStore!: DataStore;
	private StatsStore!: DataStore;

	private flaggedPlayers = new Set<number>();
	private processedBans = new Set<number>();

	private static Aliases: Record<string, AliasConfig> = {
		a1b: {
			PrivateReason: "Vortex External",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: false,
			ApplyToAlts: true,
			Delay: [86400, 172800],
		},
		"2ht": {
			PrivateReason: "Infinite Jump",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: false,
			ApplyToAlts: true,
			Delay: [86400, 172800],
		},
		"2ff": {
			PrivateReason: "NoClip",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: false,
			ApplyToAlts: true,
			Delay: [64800, 124000],
		},
		"5cv": {
			PrivateReason: "Fly",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: false,
			ApplyToAlts: true,
			Delay: [64800, 86400],
		},
		ng6: {
			PrivateReason: "Speed Hacks",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		a3f: {
			PrivateReason: "JumpPower Hacks",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		"3t4": {
			PrivateReason: "Gravity Hacks",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		h6a: {
			PrivateReason: "Possible Inject",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: false,
			Delay: [0, 0],
		},
		la5: {
			PrivateReason: "AimBot",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		lb1: {
			PrivateReason: "Removing important assests from the game",
			DisplayReason: "Exploiting",
			Duration: 604800,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		d1g: {
			PrivateReason: "Vehicle Fling",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		ma1: {
			PrivateReason: "Movment Instaces",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		kd1: {
			PrivateReason: "Car Is Moving with Position With No Movment",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		b3s: {
			PrivateReason: "Car Speed Boost",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
		b1a: {
			PrivateReason: "Blacklisted Words In Console",
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: true,
			ApplyToAlts: true,
			Delay: [0, 0],
		},
	};

	public onStart() {
		BanService.instance = this;
		this.BanStore = DataStoreService.GetDataStore("DelayedBans");
		this.StatsStore = DataStoreService.GetDataStore("BanStats");

		Players.PlayerAdded.Connect((p) => this.checkDelayedBansOnJoin(p));
	}

	public executeBan(player: Player, actionName: string) {
		const userId = player.UserId;
		const banInfo: AliasConfig = BanService.Aliases[actionName] || {
			PrivateReason: actionName,
			DisplayReason: "Exploiting",
			Duration: -1,
			InstantBan: false,
			ApplyToAlts: true,
			Delay: [0, 0],
		};

		if (!banInfo.InstantBan) {
			if (this.flaggedPlayers.has(userId)) return;
			this.flaggedPlayers.add(userId);
		}

		if (banInfo.InstantBan) {
			this.performBanOffline(
				userId,
				banInfo.PrivateReason,
				banInfo.DisplayReason,
				banInfo.Duration,
				banInfo.ApplyToAlts,
			);
		} else {
			const randomDelay = math.random(banInfo.Delay[0], banInfo.Delay[1]);

			pcall(() => {
				this.BanStore.UpdateAsync(tostring(userId), () => {
					return $tuple({
						BanTime: os.time() + randomDelay,
						Reason: banInfo.PrivateReason,
						DisplayMessage: banInfo.DisplayReason,
						BanDuration: banInfo.Duration,
						ApplyToAlts: banInfo.ApplyToAlts,
					});
				});
			});

			task.delay(randomDelay, () => {
				this.performBanOffline(
					userId,
					banInfo.PrivateReason,
					banInfo.DisplayReason,
					banInfo.Duration,
					banInfo.ApplyToAlts,
				);
			});
		}
	}

	private performBanOffline(userId: number, pReason: string, dReason: string, duration: number, alts: boolean) {
		if (this.processedBans.has(userId)) return;
		this.processedBans.add(userId);

		const [success] = pcall(() =>
			Players.BanAsync({
				UserIds: [userId],
				Duration: duration,
				DisplayReason: dReason,
				PrivateReason: pReason,
				ExcludeAltAccounts: !alts,
				ApplyToUniverse: true,
			}),
		);

		if (success) {
			pcall(() => {
				this.StatsStore.UpdateAsync(pReason, (old) => {
					return $tuple(((old as number) || 0) + 1);
				});
				this.BanStore.RemoveAsync(tostring(userId));
			});
		} else {
			this.processedBans.delete(userId);
			this.flaggedPlayers.delete(userId);
		}
	}

	private checkDelayedBansOnJoin(player: Player) {
		const userId = player.UserId;
		const [success, rawData] = pcall(() => this.BanStore.GetAsync(tostring(userId)));

		if (success && rawData) {
			this.flaggedPlayers.add(userId);
			const data = rawData as BanData;
			const timeUntilBan = data.BanTime - os.time();

			task.delay(timeUntilBan <= 0 ? 60 : timeUntilBan, () => {
				this.performBanOffline(userId, data.Reason, data.DisplayMessage, data.BanDuration, data.ApplyToAlts);
			});
		}
	}
}
