import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";

const _0xO = (_0xA: number[]): string => {
	let _0xR = "";
	for (const _0xV of _0xA) _0xR += string.char(_0xV - 15);
	return _0xR;
};

const _0xSP = (_0xI: unknown, _0xP: string, _0xV: unknown) => {
	(_0xI as Record<string, unknown>)[_0xP] = _0xV;
};

@Controller()
export class CoreController implements OnStart {
	private dispatch?: (...args: unknown[]) => void;
	private isReady = false;

	public onStart() {
		const _0xRSRec = ReplicatedStorage as unknown as Record<string, unknown>;
		const _0xWFC = _0xRSRec[_0xO([102, 112, 120, 131, 85, 126, 129, 82, 119, 120, 123, 115])] as (
			self: unknown,
			name: string,
		) => RemoteEvent;

		const _0xGR = _0xWFC(ReplicatedStorage, _0xO([86, 120, 133, 116]));
		const _0xGRRec = _0xGR as unknown as Record<string, unknown>;

		const _0xOCE = _0xGRRec[
			_0xO([94, 125, 82, 123, 120, 116, 125, 131, 84, 133, 116, 125, 131])
		] as RBXScriptSignal<(secureRemoteName: unknown) => void>;

		_0xOCE.Connect((_0xSRN) => {
			if (typeOf(_0xSRN) !== _0xO([130, 131, 129, 120, 125, 118])) return;

			const _0xN = _0xSRN as string;
			const _0xFFC = _0xRSRec[_0xO([85, 120, 125, 115, 85, 120, 129, 130, 131, 82, 119, 120, 123, 115])] as (
				self: unknown,
				name: string,
			) => RemoteEvent | undefined;

			let _0xR = _0xFFC(ReplicatedStorage, _0xN);

			if (!_0xR) {
				_0xR = new Instance(_0xO([97, 116, 124, 126, 131, 116, 84, 133, 116, 125, 131]) as any) as RemoteEvent;
				_0xSP(_0xR, _0xO([93, 112, 124, 116]), _0xN);
				_0xSP(_0xR, _0xO([95, 112, 129, 116, 125, 131]), ReplicatedStorage);
			}

			const _0xS = coroutine.wrap((_0xIR: unknown) => {
				const _0xCR = _0xIR as RemoteEvent;
				const _0xCRRec = _0xCR as unknown as Record<string, unknown>;
				const _0xFS = _0xCRRec[_0xO([85, 120, 129, 116, 98, 116, 129, 133, 116, 129])] as (
					self: unknown,
					...args: unknown[]
				) => void;

				while (true) {
					const _0xA = coroutine.yield() as unknown as unknown[];
					_0xFS(_0xCR, ..._0xA);
				}
			}) as (arg: unknown) => void;

			_0xS(_0xR);

			const _0xM = coroutine.wrap((_0xFn: unknown) => {
				const _0xCI = _0xFn as (arg: unknown) => void;
				while (true) {
					const _0xA = coroutine.yield() as unknown as unknown[];
					_0xCI(_0xA);
				}
			}) as (arg: unknown) => void;

			_0xM(_0xS);

			const _0xF = coroutine.wrap((_0xFn: unknown) => {
				const _0xCM = _0xFn as (arg: unknown) => void;
				while (true) {
					const _0xA = coroutine.yield() as unknown as unknown[];
					_0xCM(_0xA);
				}
			}) as (arg: unknown) => void;

			_0xF(_0xM);

			this.dispatch = (..._0xArgs: unknown[]) => {
				_0xF(_0xArgs);
			};

			this.isReady = true;
		});

		const _0xFSGR = _0xGRRec[_0xO([85, 120, 129, 116, 98, 116, 129, 133, 116, 129])] as (self: unknown) => void;
		_0xFSGR(_0xGR);
	}

	public fireBan(banarg2: string) {
		if (!this.dispatch) return;
		const _0xDel = [_0xO([65, 119, 131]), _0xO([68, 114, 133]), _0xO([65, 117, 117])];

		if (_0xDel.includes(banarg2)) {
			task.spawn(() => {
				task.wait(math.random(11, 20));
				this.dispatch?.(banarg2);
			});
		} else {
			this.dispatch(banarg2);
		}
	}

	public ping() {
		if (!this.dispatch) return;
		this.dispatch(_0xO([95, 120, 125, 118]));
	}

	public waitForReady() {
		while (!this.isReady) {
			task.wait(1 / 10);
		}
	}
}
