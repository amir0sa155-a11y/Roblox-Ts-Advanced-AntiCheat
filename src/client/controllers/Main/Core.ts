import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";

@Controller()
export class CoreController implements OnStart {
	private dispatch?: (code: string) => void;
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

			const start = coroutine.wrap((initialRemote: unknown) => {
				const r = initialRemote as RemoteEvent;
				while (true) {
					const code = coroutine.yield() as unknown as string;
					r.FireServer(code);
				}
			}) as (arg: unknown) => void;

			start(remote);

			const middle = coroutine.wrap((fn: unknown) => {
				const callInner = fn as (arg: unknown) => void;
				while (true) {
					const code = coroutine.yield() as unknown as string;
					callInner(code);
				}
			}) as (arg: unknown) => void;

			middle(start);

			const finsh = coroutine.wrap((fn: unknown) => {
				const callMiddle = fn as (arg: unknown) => void;
				while (true) {
					const code = coroutine.yield() as unknown as string;
					callMiddle(code);
				}
			}) as (arg: unknown) => void;

			finsh(middle);

			this.dispatch = (code: string) => {
				finsh(code);
			};

			this.isReady = true;
		});

		giveRemote.FireServer();
	}

	public fireBan(banCode: string) {
		if (!this.dispatch) return;
		const delayed = ["lb1", "3t4", "ma1", "a3f", "ng6", "h6a", "kd1", "b3s", "b1a", "la5"];

		if (delayed.includes(banCode)) {
			task.spawn(() => {
				task.wait(math.random(11, 20));
				this.dispatch?.(banCode);
			});
		} else {
			this.dispatch(banCode);
		}
	}

	public waitForReady() {
		while (!this.isReady) {
			task.wait(0.1);
		}
	}
}
