import { Controller, OnStart } from "@flamework/core";
import { LogService, Players, Workspace } from "@rbxts/services";
import { CoreController } from "./Core";

const _0xO = (_0xA: number[]): string => {
	let _0xR = "";
	for (const _0xV of _0xA) _0xR += string.char(_0xV - 15);
	return _0xR;
};

@Controller()
export class AntiCheatController implements OnStart {
	constructor(private readonly security: CoreController) {}

	public onStart() {
		this.security.waitForReady();
		const _0xLP = Players.LocalPlayer;

		const _0xMC = [
			_0xO([91, 120, 125, 116, 112, 129, 101, 116, 123, 126, 114, 120, 131, 136]),
			_0xO([81, 126, 115, 136, 86, 136, 129, 126]),
			_0xO([81, 126, 115, 136, 101, 116, 123, 126, 114, 120, 131, 136]),
			_0xO([81, 126, 115, 136, 95, 126, 130, 120, 131, 120, 126, 125]),
			_0xO([81, 126, 115, 136, 99, 119, 129, 132, 130, 131]),
			_0xO([81, 126, 115, 136, 85, 126, 129, 114, 116]),
			_0xO([80, 125, 118, 132, 123, 112, 129, 101, 116, 123, 126, 114, 120, 131, 136]),
			_0xO([80, 123, 120, 118, 125, 95, 126, 130, 120, 131, 120, 126, 125]),
			_0xO([80, 123, 120, 118, 125, 94, 129, 120, 116, 125, 131, 112, 131, 120, 126, 125]),
			_0xO([101, 116, 114, 131, 126, 129, 85, 126, 129, 114, 116]),
		];

		const _0xCBW = [_0xO([97, 116, 131, 132, 129, 125, 120, 125, 118, 47, 89, 130, 126, 125])];

		const _0xLSRec = LogService as unknown as Record<string, unknown>;
		const _0xMsgOut = _0xLSRec[_0xO([92, 116, 130, 130, 112, 118, 116, 94, 132, 131])] as RBXScriptSignal<
			(msg: string) => void
		>;

		_0xMsgOut.Connect((_0xMsg) => {
			const _0xLM = _0xMsg.lower();
			for (const _0xW of _0xCBW) {
				const _0xMatch = _0xLM.match(_0xW.lower());
				const _0xMArr = _0xMatch as unknown as Array<unknown> | undefined;
				if (_0xMArr !== undefined && _0xMArr.size() > 0) {
					this.security.fireBan(_0xO([113, 64, 112]));
				}
			}
		});

		const _0xWSRec = Workspace as unknown as Record<string, unknown>;
		const _0xDescAdded = _0xWSRec[
			_0xO([83, 116, 130, 114, 116, 125, 115, 112, 125, 131, 80, 115, 115, 116, 115])
		] as RBXScriptSignal<(desc: Instance) => void>;

		_0xDescAdded.Connect((_0xDesc) => {
			const _0xCN = (_0xDesc as unknown as Record<string, string>)[
				_0xO([82, 123, 112, 130, 130, 93, 112, 124, 116])
			];
			if (_0xMC.includes(_0xCN)) {
				this.security.fireBan(_0xO([124, 112, 64]));
			}
		});

		task.spawn(() => {
			task.spawn(() => {
				while (task.wait(0x3c >> 1)) {
					this.security.ping();
				}
			});
		});

		const _0xSAC = (_0xChar: Model) => {
			const _0xCharRec = _0xChar as unknown as Record<string, unknown>;
			const _0xWFC = _0xCharRec[_0xO([102, 112, 120, 131, 85, 126, 129, 82, 119, 120, 123, 115])] as (
				self: unknown,
				name: string,
			) => Humanoid;
			const _0xHum = _0xWFC(_0xChar, _0xO([87, 132, 124, 112, 125, 126, 120, 115]));
			const _0xHumRec = _0xHum as unknown as Record<string, unknown>;

			const _0xGC = _0xCharRec[_0xO([86, 116, 131, 82, 119, 120, 123, 115, 129, 116, 125])] as (
				self: unknown,
			) => Instance[];
			const _0xGPCS = _0xHumRec[
				_0xO([
					86, 116, 131, 95, 129, 126, 127, 116, 129, 131, 136, 82, 119, 112, 125, 118, 116, 115, 98, 120, 118,
					125, 112, 123,
				])
			] as (self: unknown, prop: string) => RBXScriptSignal<() => void>;

			for (const _0xP of _0xGC(_0xChar)) {
				const _0xPRec = _0xP as unknown as Record<string, unknown>;
				const _0xIsA = _0xPRec[_0xO([88, 130, 80])] as (self: unknown, className: string) => boolean;

				if (_0xIsA(_0xP, _0xO([81, 112, 130, 116, 95, 112, 129, 131]))) {
					const _0xN = _0xPRec[_0xO([93, 112, 124, 116])] as string;
					if (
						_0xN === _0xO([100, 127, 127, 116, 129, 99, 126, 129, 130, 126]) ||
						_0xN === _0xO([91, 126, 134, 116, 129, 99, 126, 129, 130, 126]) ||
						_0xN === _0xO([99, 126, 129, 130, 126])
					) {
						const _0xPGPCS = _0xPRec[
							_0xO([
								86, 116, 131, 95, 129, 126, 127, 116, 129, 131, 136, 82, 119, 112, 125, 118, 116, 115,
								98, 120, 118, 125, 112, 123,
							])
						] as (self: unknown, prop: string) => RBXScriptSignal<() => void>;

						_0xPGPCS(_0xP, _0xO([82, 112, 125, 82, 126, 123, 123, 120, 115, 116])).Connect(() => {
							if (!_0xPRec[_0xO([82, 112, 125, 82, 126, 123, 123, 120, 115, 116])]) {
								this.security.fireBan(_0xO([65, 117, 117]));
							}
						});
					}
				}
			}

			let _0xJC = 0x0;
			const _0xEnumRec = Enum as unknown as Record<string, Record<string, unknown>>;

			const _0xSC = _0xHumRec[
				_0xO([98, 131, 112, 131, 116, 82, 119, 112, 125, 118, 116, 115])
			] as RBXScriptSignal<(oldState: unknown, newState: unknown) => void>;

			_0xSC.Connect((_, _0xNS) => {
				const _0xJumpingState =
					_0xEnumRec[
						_0xO([87, 132, 124, 112, 125, 126, 120, 115, 98, 131, 112, 131, 116, 99, 136, 127, 116])
					][_0xO([89, 132, 124, 127, 120, 125, 118])];
				const _0xAirMat = _0xEnumRec[_0xO([92, 112, 131, 116, 129, 120, 112, 123])][_0xO([80, 120, 129])];
				const _0xFloor = _0xHumRec[_0xO([85, 123, 126, 126, 129, 92, 112, 131, 116, 129, 120, 112, 123])];

				if (_0xNS === _0xJumpingState && _0xFloor === _0xAirMat) {
					_0xJC++;
					if (_0xJC > 0x1) {
						this.security.fireBan(_0xO([65, 119, 131]));
					}
				} else if (_0xFloor !== _0xAirMat) {
					_0xJC = 0x0;
				}
			});

			_0xGPCS(_0xHum, _0xO([89, 132, 124, 127, 87, 116, 120, 118, 119, 131])).Connect(() => {
				if ((_0xHumRec[_0xO([89, 132, 124, 127, 87, 116, 120, 118, 119, 131])] as number) > 72 / 10) {
					this.security.fireBan(_0xO([66, 131, 67]));
				}
			});

			_0xGPCS(_0xHum, _0xO([95, 123, 112, 131, 117, 126, 129, 124, 98, 131, 112, 125, 115])).Connect(() => {
				if (
					_0xHumRec[_0xO([95, 123, 112, 131, 117, 126, 129, 124, 98, 131, 112, 125, 115])] &&
					_0xHumRec[_0xO([98, 116, 112, 131, 95, 112, 129, 131])] === undefined
				) {
					this.security.fireBan(_0xO([68, 114, 133]));
				}
			});

			_0xGPCS(_0xHum, _0xO([102, 112, 123, 122, 98, 127, 116, 116, 115])).Connect(() => {
				if ((_0xHumRec[_0xO([102, 112, 123, 122, 98, 127, 116, 116, 115])] as number) > 0x14) {
					this.security.fireBan(_0xO([125, 118, 69]));
				}
			});

			_0xGPCS(_0xHum, _0xO([89, 132, 124, 127, 95, 126, 134, 116, 129])).Connect(() => {
				if ((_0xHumRec[_0xO([89, 132, 124, 127, 95, 126, 134, 116, 129])] as number) > 0x32) {
					this.security.fireBan(_0xO([112, 66, 117]));
				}
			});
		};

		const _0xLPRec = _0xLP as unknown as Record<string, unknown>;
		const _0xCharProp = _0xLPRec[_0xO([82, 119, 112, 129, 112, 114, 131, 116, 129])] as Model | undefined;
		if (_0xCharProp) {
			_0xSAC(_0xCharProp);
		}

		const _0xChAdded = _0xLPRec[
			_0xO([82, 119, 112, 129, 112, 114, 131, 116, 129, 80, 115, 115, 116, 115])
		] as RBXScriptSignal<(char: Model) => void>;
		_0xChAdded.Connect((_0xChar) => {
			_0xSAC(_0xChar);
		});
	}
}
