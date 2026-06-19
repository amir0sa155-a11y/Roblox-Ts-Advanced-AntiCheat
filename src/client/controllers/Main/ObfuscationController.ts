import { Controller, OnStart } from "@flamework/core";
import { Players, CollectionService, HttpService } from "@rbxts/services";
import { CoreController } from "./Core";

const _0xO = (_0xA: number[]): string => {
	let _0xR = "";
	for (const _0xV of _0xA) _0xR += string.char(_0xV - 15);
	return _0xR;
};

const _0xSP = (_0xI: unknown, _0xP: string, _0xV: unknown) => {
	(_0xI as Record<string, unknown>)[_0xP] = _0xV;
};

const _0xGP = (_0xI: unknown, _0xP: string): unknown => {
	return (_0xI as Record<string, unknown>)[_0xP];
};

@Controller()
export class ObfuscationController implements OnStart {
	constructor(private readonly security: CoreController) {}

	public onStart() {
		this.security.waitForReady();
		task.wait(1);

		const _0xLP = Players.LocalPlayer;
		const _0xLPRec = _0xLP as unknown as Record<string, unknown>;
		const _0xWFC = _0xLPRec[_0xO([102, 112, 120, 131, 85, 126, 129, 82, 119, 120, 123, 115])] as (
			self: unknown,
			name: string,
		) => Folder;
		const _0xSPS = _0xWFC(_0xLP, _0xO([95, 123, 112, 136, 116, 129, 98, 114, 129, 120, 127, 131, 130]));

		const _0xRF: Folder[] = [];
		const _0xACS: Instance[] = [];
		const _0xCont: Instance[] = [_0xSPS];

		const _0xSPSRec = _0xSPS as unknown as Record<string, unknown>;
		const _0xGD = _0xSPSRec[_0xO([86, 116, 131, 83, 116, 130, 114, 116, 125, 115, 112, 125, 131, 130])] as (
			self: unknown,
		) => Instance[];

		for (const _0xObj of _0xGD(_0xSPS)) {
			const _0xObjRec = _0xObj as unknown as Record<string, unknown>;
			const _0xIsA = _0xObjRec[_0xO([88, 130, 80])] as (self: unknown, className: string) => boolean;
			if (_0xIsA(_0xObj, _0xO([85, 126, 123, 115, 116, 129]))) {
				_0xCont.push(_0xObj);
			}
		}

		const _0xHSRec = HttpService as unknown as Record<string, unknown>;
		const _0xGGUID = _0xHSRec[_0xO([86, 116, 125, 116, 129, 112, 131, 116, 86, 100, 88, 83])] as (
			self: unknown,
			wrap: boolean,
		) => string;

		for (let _0xI = 0; _0xI < 10; _0xI++) {
			const _0xF = new Instance(_0xO([85, 126, 123, 115, 116, 129]) as any) as Folder;
			_0xSP(_0xF, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
			_0xSP(_0xF, _0xO([95, 112, 129, 116, 125, 131]), _0xCont[math.random(0, _0xCont.size() - 1)]);

			_0xRF.push(_0xF);
			_0xCont.push(_0xF);

			const _0xAC = _0xGP(
				_0xF,
				_0xO([80, 125, 114, 116, 130, 131, 129, 136, 82, 119, 112, 125, 118, 116, 115]),
			) as RBXScriptSignal<(child: Instance, parent: Instance | undefined) => void>;
			_0xAC.Connect((_, _0xP) => {
				if (!_0xP) {
					this.security.fireBan(_0xO([123, 113, 64]));
				}
			});
		}

		const _0xACF = new Instance(_0xO([85, 126, 123, 115, 116, 129]) as any) as Folder;
		_0xSP(_0xACF, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
		_0xSP(_0xACF, _0xO([95, 112, 129, 116, 125, 131]), _0xRF[math.random(0, _0xRF.size() - 1)]);

		const _0xACAC = _0xGP(
			_0xACF,
			_0xO([80, 125, 114, 116, 130, 131, 129, 136, 82, 119, 112, 125, 118, 116, 115]),
		) as RBXScriptSignal<(child: Instance, parent: Instance | undefined) => void>;
		_0xACAC.Connect((_, _0xP) => {
			if (!_0xP) {
				this.security.fireBan(_0xO([123, 113, 64]));
			}
		});

		const _0xCSRec = CollectionService as unknown as Record<string, unknown>;
		const _0xGT = _0xCSRec[_0xO([86, 116, 131, 99, 112, 118, 118, 116, 115])] as (
			self: unknown,
			tag: string,
		) => Instance[];

		for (const _0xInst of _0xGT(CollectionService, _0xO([80, 125, 131, 120, 82, 119, 116, 112, 131]))) {
			_0xACS.push(_0xInst);
			pcall(() => {
				_0xSP(_0xInst, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
				_0xSP(_0xInst, _0xO([95, 112, 129, 116, 125, 131]), _0xACF);
			});
		}

		task.spawn(() => {
			while (true) {
				task.wait(1);
				for (const _0xSO of _0xACS) {
					if (_0xGP(_0xSO, _0xO([95, 112, 129, 116, 125, 131]))) {
						_0xSP(_0xSO, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
					}
				}
			}
		});

		task.spawn(() => {
			while (true) {
				task.wait(1);
				for (const _0xF of _0xRF) {
					if (_0xGP(_0xF, _0xO([95, 112, 129, 116, 125, 131]))) {
						_0xSP(_0xF, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
					}
				}
				if (_0xGP(_0xACF, _0xO([95, 112, 129, 116, 125, 131]))) {
					_0xSP(_0xACF, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
				}
			}
		});

		task.spawn(() => {
			while (true) {
				task.wait(0.1);
				if (_0xRF.size() > 0) {
					const _0xTF = _0xRF[math.random(0, _0xRF.size() - 1)];
					if (_0xGP(_0xTF, _0xO([95, 112, 129, 116, 125, 131]))) {
						_0xSP(_0xACF, _0xO([95, 112, 129, 116, 125, 131]), _0xTF);
					}
				}
			}
		});
	}
}
