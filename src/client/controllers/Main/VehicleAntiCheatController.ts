import { Controller, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";
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
export class VehicleAntiCheatController implements OnStart {
	constructor(private readonly security: CoreController) {}

	public onStart() {
		this.security.waitForReady();

		const _0xLP = Players.LocalPlayer;

		const _0xSC = (_0xChar: Model) => {
			const _0xCharRec = _0xChar as unknown as Record<string, unknown>;
			const _0xWFC = _0xCharRec[_0xO([102, 112, 120, 131, 85, 126, 129, 82, 119, 120, 123, 115])] as (
				self: unknown,
				name: string,
			) => Humanoid;
			const _0xHum = _0xWFC(_0xChar, _0xO([87, 132, 124, 112, 125, 126, 120, 115]));
			const _0xHumRec = _0xHum as unknown as Record<string, unknown>;

			let _0xHBC: RBXScriptConnection | undefined;
			let _0xTC: RBXScriptConnection | undefined;

			const _0xSeated = _0xHumRec[_0xO([98, 116, 112, 131, 116, 115])] as RBXScriptSignal<
				(active: boolean, seat: Instance | undefined) => void
			>;

			_0xSeated.Connect((_0xAct, _0xSeat) => {
				if (_0xHBC) {
					const _0xHBCRec = _0xHBC as unknown as Record<string, (s: unknown) => void>;
					_0xHBCRec[_0xO([83, 120, 130, 114, 126, 125, 125, 116, 114, 131])](_0xHBC);
					_0xHBC = undefined;
				}
				if (_0xTC) {
					const _0xTCRec = _0xTC as unknown as Record<string, (s: unknown) => void>;
					_0xTCRec[_0xO([83, 120, 130, 114, 126, 125, 125, 116, 114, 131])](_0xTC);
					_0xTC = undefined;
				}

				if (!_0xAct || !_0xSeat) return;

				const _0xSeatRec = _0xSeat as unknown as Record<string, unknown>;
				const _0xIsA = _0xSeatRec[_0xO([88, 130, 80])] as (s: unknown, c: string) => boolean;

				if (!_0xIsA(_0xSeat, _0xO([101, 116, 119, 120, 114, 123, 116, 98, 116, 112, 131]))) return;

				const _0xVS = _0xSeat as VehicleSeat;

				const _0xWSRec = Workspace as unknown as Record<string, unknown>;
				const _0xFFCWS = _0xWSRec[
					_0xO([85, 120, 125, 115, 85, 120, 129, 130, 131, 82, 119, 120, 123, 115])
				] as (s: unknown, n: string) => Instance | undefined;
				const _0xVF = _0xFFCWS(Workspace, _0xO([101, 116, 119, 120, 114, 123, 116, 130]));

				const _0xLPN = _0xGP(_0xLP, _0xO([93, 112, 124, 116])) as string;

				let _0xPV: Instance | undefined;
				if (_0xVF) {
					const _0xFFCVF = (_0xVF as unknown as Record<string, unknown>)[
						_0xO([85, 120, 125, 115, 85, 120, 129, 130, 131, 82, 119, 120, 123, 115])
					] as (s: unknown, n: string) => Instance | undefined;
					_0xPV = _0xFFCVF(_0xVF, _0xLPN);
				}

				let _0xBody: BasePart | undefined;
				if (_0xPV) {
					const _0xFFCPV = (_0xPV as unknown as Record<string, unknown>)[
						_0xO([85, 120, 125, 115, 85, 120, 129, 130, 131, 82, 119, 120, 123, 115])
					] as (s: unknown, n: string) => BasePart | undefined;
					_0xBody = _0xFFCPV(_0xPV, _0xO([81, 126, 115, 136])) as BasePart | undefined;
				}

				let _0xLTT = 0x0;
				let _0xKD1VT = 0x0;

				if (_0xBody && _0xVF) {
					const _0xBodyRec = _0xBody as unknown as Record<string, unknown>;
					const _0xTouched = _0xBodyRec[_0xO([99, 126, 132, 114, 119, 116, 115])] as RBXScriptSignal<
						(o: BasePart) => void
					>;
					_0xTC = _0xTouched.Connect((_0xOP) => {
						const _0xOPRec = _0xOP as unknown as Record<string, unknown>;
						const _0xIDO = _0xOPRec[
							_0xO([88, 130, 83, 116, 130, 114, 116, 125, 115, 112, 125, 131, 94, 117])
						] as (s: unknown, p: Instance) => boolean;

						if (_0xIDO(_0xOP, _0xVF) && _0xPV && !_0xIDO(_0xOP, _0xPV)) {
							_0xLTT = os.clock();
						}
					});
				}

				let _0xLPos = _0xGP(_0xVS, _0xO([95, 126, 130, 120, 131, 120, 126, 125])) as Vector3;
				const _0xInitALV = _0xGP(
					_0xVS,
					_0xO([
						80, 130, 130, 116, 124, 113, 123, 136, 91, 120, 125, 116, 112, 129, 101, 116, 123, 126, 114,
						120, 131, 136,
					]),
				) as Vector3;
				let _0xLVel = (_0xInitALV as unknown as Record<string, number>)[
					_0xO([92, 112, 118, 125, 120, 131, 132, 115, 116])
				];

				const _0xRSRec = RunService as unknown as Record<string, unknown>;
				const _0xHBEvent = _0xRSRec[_0xO([87, 116, 112, 129, 131, 113, 116, 112, 131])] as RBXScriptSignal<
					(dt: number) => void
				>;

				_0xHBC = _0xHBEvent.Connect((_0xDT) => {
					const _0xPar = _0xGP(_0xVS, _0xO([95, 112, 129, 116, 125, 131]));
					if (!_0xPar || _0xDT <= 0x0) return;

					const _0xCPos = _0xGP(_0xVS, _0xO([95, 126, 130, 120, 131, 120, 126, 125])) as Vector3;
					const _0xCALV = _0xGP(
						_0xVS,
						_0xO([
							80, 130, 130, 116, 124, 113, 123, 136, 91, 120, 125, 116, 112, 129, 101, 116, 123, 126, 114,
							120, 131, 136,
						]),
					) as Vector3;
					const _0xCAS = (_0xCALV as unknown as Record<string, number>)[
						_0xO([92, 112, 118, 125, 120, 131, 132, 115, 116])
					];

					const _0xSub = (_0xCPos as unknown as Record<string, (s: unknown, v: Vector3) => Vector3>)[
						_0xO([130, 132, 113])
					];
					const _0xDispV = _0xSub(_0xCPos, _0xLPos);
					const _0xDisp = (_0xDispV as unknown as Record<string, number>)[
						_0xO([92, 112, 118, 125, 120, 131, 132, 115, 116])
					];

					const _0xCS = _0xDisp / _0xDT;

					if (_0xCAS <= 0x2 >> 1 && _0xCS >= 0x19) {
						_0xKD1VT += _0xDT;

						if (_0xKD1VT >= 0x4) {
							if (_0xHBC) {
								const _0xHBCRec = _0xHBC as unknown as Record<string, (s: unknown) => void>;
								_0xHBCRec[_0xO([83, 120, 130, 114, 126, 125, 125, 116, 114, 131])](_0xHBC);
							}
							this.security.fireBan(_0xO([122, 115, 64]));
							return;
						}
					} else {
						_0xKD1VT = math.max(0x0, _0xKD1VT - _0xDT * 0x2);
					}

					if (_0xCAS < 0x15e) {
						const _0xVSk = _0xCAS - _0xLVel;
						if (_0xVSk >= 0x16 && os.clock() - _0xLTT > 6 / 10) {
							if (_0xHBC) {
								const _0xHBCRec = _0xHBC as unknown as Record<string, (s: unknown) => void>;
								_0xHBCRec[_0xO([83, 120, 130, 114, 126, 125, 125, 116, 114, 131])](_0xHBC);
							}
							if (_0xTC) {
								const _0xTCRec = _0xTC as unknown as Record<string, (s: unknown) => void>;
								_0xTCRec[_0xO([83, 120, 130, 114, 126, 125, 125, 116, 114, 131])](_0xTC);
							}
							this.security.fireBan(_0xO([113, 66, 130]));
							return;
						}
					}

					_0xLPos = _0xCPos;
					_0xLVel = _0xCAS;
				});
			});
		};

		const _0xCharProp = _0xGP(_0xLP, _0xO([82, 119, 112, 129, 112, 114, 131, 116, 129])) as Model | undefined;
		if (_0xCharProp) _0xSC(_0xCharProp);

		const _0xCA = _0xGP(
			_0xLP,
			_0xO([82, 119, 112, 129, 112, 114, 131, 116, 129, 80, 115, 115, 116, 115]),
		) as RBXScriptSignal<(char: Model) => void>;
		_0xCA.Connect(_0xSC);
	}
}
