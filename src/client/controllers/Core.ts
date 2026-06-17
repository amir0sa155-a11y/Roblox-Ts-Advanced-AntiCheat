import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";

@Controller()
export class CoreSecurityController implements OnStart {
	private caller?: (code: string) => void;
	private isReady = false;

	public onStart() {
		const giveRemote = ReplicatedStorage.WaitForChild("Give") as RemoteEvent;

		giveRemote.OnClientEvent.Connect((secureRemoteName: unknown) => {
			if (typeOf(secureRemoteName) !== "string") return;

			const name = secureRemoteName as string;
			let remote = ReplicatedStorage.FindFirstChild(name) as RemoteEvent | undefined;
			if (!remote) {
				remote = new Instance("RemoteEvent");
				remote.Name = name;
				remote.Parent = ReplicatedStorage;
			}

			const co = coroutine.wrap((initialRemote: unknown) => {
				const r = initialRemote as RemoteEvent;
				while (true) {
					const code = coroutine.yield() as any as string;
					r.FireServer(code);
				}
			}) as (arg: unknown) => void;

			co(remote);

			this.caller = (code: string) => {
				co(code);
			};

			this.isReady = true;
		});

		giveRemote.FireServer();
	}

	public fireBan(banCode: string) {
		if (!this.caller) return;

		const immediateBans = ["3t4", "ma1", "a3f", "ng6", "h6a", "kd1", "b3s"];

		if (immediateBans.includes(banCode)) {
			this.caller(banCode);
		} else {
			task.spawn(() => {
				task.wait(math.random(11, 20));
				this.caller?.(banCode);
			});
		}
	}

	public waitForReady() {
		while (!this.isReady) {
			task.wait(0.1);
		}
	}
}
