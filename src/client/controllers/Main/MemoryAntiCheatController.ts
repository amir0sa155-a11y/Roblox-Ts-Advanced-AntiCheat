import { Controller, OnStart } from "@flamework/core";
import { ContentProvider, Players, Stats } from "@rbxts/services";
import { CoreController } from "./Core";

const _0xO = (_0xA: number[]): string => {
	let _0xR = "";
	for (const _0xV of _0xA) _0xR += string.char(_0xV - 15);
	return _0xR;
};

const _0xGP = (_0xI: unknown, _0xP: string): unknown => {
	return (_0xI as Record<string, unknown>)[_0xP];
};

@Controller()
export class MemoryCheatsDetectionController implements OnStart {
	constructor(private readonly security: CoreController) {}

	public onStart() {
		this.security.waitForReady();

		const _0xLP = Players.LocalPlayer;
		const _0xLPRec = _0xLP as unknown as Record<string, unknown>;
		const _0xK = _0xLPRec[_0xO([90, 120, 114, 122])] as (self: unknown, msg: string) => void;

		const _0xStatsRec = Stats as unknown as Record<string, unknown>;
		const _0xGTM = _0xStatsRec[
			_0xO([86, 116, 131, 99, 126, 131, 112, 123, 92, 116, 124, 126, 129, 136, 100, 130, 112, 118, 116, 92, 113])
		] as (self: unknown) => number;

		const _0xGameRec = game as unknown as Record<string, unknown>;
		const _0xGD = _0xGameRec[_0xO([86, 116, 131, 83, 116, 130, 114, 116, 125, 115, 112, 125, 131, 130])] as (
			self: unknown,
		) => Instance[];

		let _0xSM = _0xGTM(Stats);
		let _0xSI = _0xGD(game).size();
		let _0xIC = false;

		task.spawn(() => {
			while (true) {
				task.wait(0x2 >> 1);

				if (_0xIC) {
					_0xSM = _0xGTM(Stats);
					_0xSI = _0xGD(game).size();
					continue;
				}

				const _0xCM = _0xGTM(Stats);
				const _0xCI = _0xGD(game).size();

				const _0xMD = _0xCM - _0xSM;
				const _0xID = _0xCI - _0xSI;

				if (_0xMD > 0x258) {
					this.security.fireBan(_0xO([119, 69, 112]));
				} else if (_0xMD >= 0x6e) {
					if (_0xID < 0x32) {
						_0xIC = true;

						task.spawn(() => {
							const _0xSpikeM = _0xCM;
							let _0xFA = false;

							for (let _0xSec = 0x2 >> 1; _0xSec <= 0xa; _0xSec++) {
								task.wait(0x2 >> 1);

								const _0xChkM = _0xGTM(Stats);
								const _0xChkI = _0xGD(game).size();
								const _0xRQS = _0xGP(
									ContentProvider,
									_0xO([97, 116, 128, 132, 116, 130, 131, 96, 132, 116, 132, 116, 98, 120, 137, 116]),
								) as number;

								if (_0xRQS > 0xa || _0xChkI - _0xCI > 0x64 || _0xChkM < _0xSpikeM - 0x14) {
									_0xFA = true;
									break;
								}
							}

							if (!_0xFA) {
								if (_0xGTM(Stats) >= _0xSpikeM - 0xf) {
									_0xK(_0xLP, "");
								}
							}

							_0xSM = _0xGTM(Stats);
							_0xSI = _0xGD(game).size();
							_0xIC = false;
						});
					} else {
						_0xSM = _0xCM;
					}
				} else if (_0xCM < _0xSM || _0xID > 0x55) {
					_0xSM = _0xCM;
				}

				_0xSI = _0xCI;
			}
		});
	}
}
