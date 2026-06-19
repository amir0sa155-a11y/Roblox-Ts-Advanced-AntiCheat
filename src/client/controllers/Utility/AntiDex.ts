import { Controller, OnStart } from "@flamework/core";
import { Players, HttpService, Workspace, UserInputService, Stats } from "@rbxts/services";
import { CoreGuiController } from "./GuiAntiCheatController";

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
export class GuiAntiCheatController implements OnStart {
	public async onStart() {
		while (!CoreGuiController.Ready) {
			task.wait();
		}

		const _0xLP = Players.LocalPlayer;
		if (!_0xLP) return;

		const _0xLPRec = _0xLP as unknown as Record<string, unknown>;

		const _0xWFC = _0xLPRec[_0xO([102, 112, 120, 131, 85, 126, 129, 82, 119, 120, 123, 115])] as (
			self: unknown,
			name: string,
		) => PlayerGui;
		const _0xPGui = _0xWFC(_0xLP, _0xO([95, 123, 112, 136, 116, 129, 86, 132, 120]));

		const _0xWSRec = Workspace as unknown as Record<string, unknown>;
		const _0xCam = _0xWSRec[_0xO([82, 132, 129, 129, 116, 125, 131, 82, 112, 124, 116, 129, 112])] as
			| Camera
			| undefined;

		const _0xDGui = new Instance(_0xO([98, 114, 129, 116, 116, 125, 86, 132, 120]) as any) as ScreenGui;

		const _0xHSRec = HttpService as unknown as Record<string, unknown>;
		const _0xGGUID = _0xHSRec[_0xO([86, 116, 125, 116, 129, 112, 131, 116, 86, 100, 88, 83])] as (
			self: unknown,
			wrap: boolean,
		) => string;

		_0xSP(_0xDGui, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
		_0xSP(_0xDGui, _0xO([88, 118, 125, 126, 129, 116, 86, 132, 120, 88, 125, 130, 116, 131]), true);
		_0xSP(_0xDGui, _0xO([97, 116, 130, 116, 131, 94, 125, 98, 127, 112, 134, 125]), false);
		_0xSP(_0xDGui, _0xO([95, 112, 129, 116, 125, 131]), _0xPGui);

		const _0xFr = new Instance(_0xO([99, 116, 135, 131, 81, 132, 131, 131, 126, 125]) as any) as TextButton;
		_0xSP(_0xFr, _0xO([93, 112, 124, 116]), _0xGGUID(HttpService, false));
		_0xSP(_0xFr, _0xO([99, 116, 135, 131]), "");
		_0xSP(
			_0xFr,
			_0xO([
				81, 112, 114, 122, 118, 129, 126, 132, 125, 115, 99, 129, 112, 125, 130, 127, 112, 129, 116, 125, 114,
				136,
			]),
			0x2 >> 1,
		);
		_0xSP(_0xFr, _0xO([80, 114, 131, 120, 133, 116]), true);
		_0xSP(_0xFr, _0xO([101, 120, 130, 120, 113, 123, 116]), true);

		_0xSP(_0xFr, _0xO([80, 125, 114, 119, 126, 129, 95, 126, 120, 125, 131]), new Vector2(0x2 >> 1, 1 / 2));
		_0xSP(_0xFr, _0xO([95, 126, 130, 120, 131, 120, 126, 125]), new UDim2(104 / 100, -20, 1 / 2, 0));
		_0xSP(_0xFr, _0xO([98, 120, 137, 116]), new UDim2(209 / 1000, 0, 1001 / 1000, 0));
		_0xSP(_0xFr, _0xO([95, 112, 129, 116, 125, 131]), _0xDGui);

		const _0xUS = new Instance(_0xO([100, 88, 98, 114, 112, 123, 116]) as any) as UIScale;
		_0xSP(_0xUS, _0xO([95, 112, 129, 116, 125, 131]), _0xFr);

		const _0xUpdUI = () => {
			if (_0xCam) {
				const _0xVS = _0xGP(
					_0xCam,
					_0xO([101, 120, 116, 134, 127, 126, 129, 131, 98, 120, 137, 116]),
				) as Vector2;
				const _0xY = _0xGP(_0xVS, _0xO([104])) as number;
				const _0xSF = _0xY / 1080;
				_0xSP(_0xUS, _0xO([98, 114, 112, 123, 116]), math.clamp(_0xSF, 1 / 2, 3 / 2));
			}
		};

		if (_0xCam) {
			const _0xCamRec = _0xCam as unknown as Record<string, unknown>;
			const _0xGPCS = _0xCamRec[
				_0xO([
					86, 116, 131, 95, 129, 126, 127, 116, 129, 131, 136, 82, 119, 112, 125, 118, 116, 115, 98, 120, 118,
					125, 112, 123,
				])
			] as (self: unknown, prop: string) => RBXScriptSignal<() => void>;
			_0xGPCS(_0xCam, _0xO([101, 120, 116, 134, 127, 126, 129, 131, 98, 120, 137, 116])).Connect(_0xUpdUI);
			_0xUpdUI();
		}

		let _0xVio = 0;
		let _0xMemSpk = false;

		const _0xStatsRec = Stats as unknown as Record<string, unknown>;
		const _0xGTM = _0xStatsRec[
			_0xO([86, 116, 131, 99, 126, 131, 112, 123, 92, 116, 124, 126, 129, 136, 100, 130, 112, 118, 116, 92, 113])
		] as (self: unknown) => number;

		let _0xLastMem = _0xGTM(Stats);
		let _0xLastClk = 0;

		task.spawn(() => {
			while (true) {
				task.wait(0x2 >> 1);
				const _0xCurMem = _0xGTM(Stats);
				const _0xMemDiff = _0xCurMem - _0xLastMem;

				if (_0xMemDiff > 0x2d) {
					_0xMemSpk = true;
				}

				if (math.abs(_0xMemDiff) > 0x14) {
					_0xLastMem = _0xCurMem;
				}
			}
		});

		task.spawn(() => {
			while (true) {
				task.wait(0x12c);
				if (_0xVio > 0) {
					_0xVio -= 0x2 >> 1;
				}
			}
		});

		const _0xFrRec = _0xFr as unknown as Record<string, unknown>;
		const _0xMB1C = _0xFrRec[
			_0xO([92, 126, 132, 130, 116, 81, 132, 131, 131, 126, 125, 64, 82, 123, 120, 114, 122])
		] as RBXScriptSignal<() => void>;
		_0xMB1C.Connect(() => {
			_0xLastClk = os.clock();
		});

		const _0xUISRec = UserInputService as unknown as Record<string, unknown>;
		const _0xIB = _0xUISRec[_0xO([88, 125, 127, 132, 131, 81, 116, 118, 112, 125])] as RBXScriptSignal<
			(input: InputObject) => void
		>;

		const _0xEnumRec = Enum as unknown as Record<string, Record<string, unknown>>;
		const _0xUIT = _0xEnumRec[_0xO([100, 130, 116, 129, 88, 125, 127, 132, 131, 99, 136, 127, 116])];
		const _0xMB1 = _0xUIT[_0xO([92, 126, 132, 130, 116, 81, 132, 131, 131, 126, 125, 64])];
		const _0xTouch = _0xUIT[_0xO([99, 126, 132, 114, 119])];

		_0xIB.Connect((_0xInp) => {
			const _0xInpType = _0xGP(_0xInp, _0xO([100, 130, 116, 129, 88, 125, 127, 132, 131, 99, 136, 127, 116]));

			if (_0xInpType !== _0xMB1 && _0xInpType !== _0xTouch) {
				return;
			}

			if (!_0xMemSpk) return;

			const _0xPos = _0xGP(_0xInp, _0xO([95, 126, 130, 120, 131, 120, 126, 125])) as Vector3;
			const _0xAPos = _0xGP(
				_0xFr,
				_0xO([80, 113, 130, 126, 123, 132, 131, 116, 95, 126, 130, 120, 131, 120, 126, 125]),
			) as Vector2;
			const _0xASize = _0xGP(_0xFr, _0xO([80, 113, 130, 126, 123, 132, 131, 116, 98, 120, 137, 116])) as Vector2;

			const _0xPosX = _0xGP(_0xPos, _0xO([103])) as number;
			const _0xPosY = _0xGP(_0xPos, _0xO([104])) as number;
			const _0xAPosX = _0xGP(_0xAPos, _0xO([103])) as number;
			const _0xAPosY = _0xGP(_0xAPos, _0xO([104])) as number;
			const _0xASizeX = _0xGP(_0xASize, _0xO([103])) as number;
			const _0xASizeY = _0xGP(_0xASize, _0xO([104])) as number;

			const _0xIns =
				_0xPosX >= _0xAPosX &&
				_0xPosX <= _0xAPosX + _0xASizeX &&
				_0xPosY >= _0xAPosY &&
				_0xPosY <= _0xAPosY + _0xASizeY;

			if (_0xIns) {
				const _0xInpT = os.clock();

				task.wait(3 / 10);

				if (_0xLastClk < _0xInpT) {
					_0xVio += 0x2 >> 1;

					if (_0xVio >= 0x6 >> 1) {
						const _0xKick = _0xLPRec[_0xO([90, 120, 114, 122])] as (self: unknown, msg: string) => void;
						//		_0xKick(_0xLP, "");
					}
				}
			}
		});
	}
}
