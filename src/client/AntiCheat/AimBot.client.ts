interface DynamicInstance {
    [key: string]: unknown;
}

const MyG = game as unknown as DynamicInstance;
const Decode = (t: number[]): string => string.char(...t.map(x => x - 1));

const GS = Decode([72, 102, 117, 84, 102, 115, 119, 106, 100, 102]);
const P = (MyG[GS] as (a: unknown, b: string) => unknown)(MyG, Decode([81, 109, 98, 122, 102, 115, 116])) as DynamicInstance;
const R = (MyG[GS] as (a: unknown, b: string) => unknown)(MyG, Decode([83, 102, 113, 109, 106, 100, 98, 117, 102, 101, 84, 117, 112, 115, 98, 104, 102])) as DynamicInstance;
const W = (MyG[GS] as (a: unknown, b: string) => unknown)(MyG, Decode([88, 112, 115, 108, 116, 113, 98, 100, 102])) as DynamicInstance;
const LP = P[Decode([77, 112, 100, 98, 109, 81, 109, 98, 122, 102, 115])] as DynamicInstance;
const WFC = Decode([88, 98, 106, 117, 71, 112, 115, 68, 105, 106, 109, 101]);
const BE = (R[WFC] as (a: unknown, b: string) => unknown)(R, Decode([67, 98, 111, 85, 102, 116, 117])) as DynamicInstance;
const FS = Decode([71, 106, 115, 102, 84, 102, 115, 119, 102, 115]);
const FFC = Decode([71, 106, 111, 101, 71, 106, 115, 116, 117, 68, 105, 106, 109, 101]);
const CHR = Decode([68, 105, 98, 115, 98, 100, 117, 102, 115]);
const GPL = Decode([72, 102, 117, 81, 109, 98, 122, 102, 115, 116]);

const RS = (MyG[GS] as (a: unknown, b: string) => unknown)(MyG, Decode([83, 118, 111, 84, 102, 115, 119, 106, 100, 102])) as DynamicInstance;
const HB = RS[Decode([73, 102, 98, 115, 117, 99, 102, 98, 117])] as DynamicInstance;
const CAM = W[Decode([68, 118, 115, 115, 102, 111, 117, 68, 98, 110, 102, 115, 98])] as DynamicInstance;
const CON = Decode([68, 112, 111, 111, 102, 100, 117]);

const Send = (data: unknown): void => {
    (BE[FS] as (a: unknown, b: unknown) => void)(BE, data);
     print("lock")
};

const _t = new Map<number, number>();
const _v = new Map<number, number>();
const _mV = 3;

(HB[CON] as (a: unknown, b: (dT: number) => void) => void)(HB, (dT: number) => {
    const cL = LP[CHR] as DynamicInstance | undefined;
    const rP = cL ? (cL[FFC] as (a: unknown, b: string) => unknown)(cL, Decode([73, 118, 110, 98, 111, 112, 106, 101, 83, 112, 112, 117, 81, 98, 115, 117])) as DynamicInstance : undefined;
    const lV = rP ? (rP[Decode([66, 116, 116, 102, 110, 99, 109, 122, 77, 106, 111, 102, 98, 115, 87, 102, 109, 112, 100, 106, 117, 122])] as Vector3).Magnitude : 0;

    const vS = CAM[Decode([87, 106, 102, 120, 113, 112, 115, 117, 84, 106, 123, 102])] as Vector2;
    const sC = new Vector2(vS.X / 2, vS.Y / 2);
    const aP = (P[GPL] as (a: unknown) => Player[])(P);

    for (const oP of aP) {
        if (oP === (LP as unknown as Player)) continue;
        const uI = oP.UserId;
        const cO = (oP as unknown as DynamicInstance)[CHR] as DynamicInstance | undefined;
        if (!cO) continue;

        const hO = (cO[FFC] as (a: unknown, b: string) => unknown)(cO, Decode([73, 118, 110, 98, 111, 112, 106, 101])) as DynamicInstance | undefined;
        const rO = (cO[FFC] as (a: unknown, b: string) => unknown)(cO, Decode([73, 118, 110, 98, 111, 112, 106, 101, 83, 112, 112, 117, 81, 98, 115, 117])) as DynamicInstance | undefined;

        if (!hO || (hO[Decode([73, 102, 98, 109, 117, 105])] as number) <= 25 || !rO) {
            _t.set(uI, 0);
            continue;
        }

        const tV = (rO[Decode([66, 116, 116, 102, 110, 99, 109, 122, 77, 106, 111, 102, 98, 115, 87, 102, 109, 112, 100, 106, 117, 122])] as Vector3).Magnitude;
        if (tV <= 9 || lV <= 9) {
            _t.set(uI, 0);
            continue;
        }

        let iL = false;
        const bP = [
            Decode([73, 102, 98, 101]), 
            Decode([73, 118, 110, 98, 111, 112, 106, 101, 83, 112, 112, 117, 81, 98, 115, 117]),
            Decode([86, 113, 113, 102, 115, 85, 112, 115, 116, 112]), 
            Decode([85, 112, 115, 116, 112]) 
        ];

        for (let i = 0; i < bP.size(); i++) {
            const pN = bP[i];
            const pT = (cO![FFC] as (a: unknown, b: string) => unknown)(cO!, tostring(pN)) as DynamicInstance | undefined;
            if (pT) {
                const pS = pT[Decode([81, 112, 116, 106, 117, 106, 112, 111])] as Vector3;
                const [sP, iOS] = (CAM[Decode([88, 112, 115, 109, 101, 85, 112, 87, 106, 102, 120, 113, 112, 115, 117, 81, 112, 106, 111, 117])] as (a: unknown, p: Vector3) => LuaTuple<[Vector3, boolean]>)(CAM, pS);
                if (iOS && sP) {
                    const d = new Vector2(sP.X, sP.Y).sub(sC).Magnitude;
                    if (d <= 2) {
                        iL = true;
                        break;
                    }
                }
            }
        }

        if (iL) {
            const cT = (_t.get(uI) || 0) + dT;
            _t.set(uI, cT);
            const rT = hO[Decode([84, 102, 98, 117, 81, 98, 115, 117])] !== undefined ? 3 : 2;
            if (cT >= rT) {
                const cV = (_v.get(uI) || 0) + 1;
                if (cV >= _mV) {
                    Send(Decode([109, 98, 54]));
                } else {
                    _v.set(uI, cV);
                    _t.set(uI, 0);
                }
            }
        } else {
            const cT = _t.get(uI) || 0;
            if (cT > 0) {
                _t.set(uI, math.max(0, cT - (dT * 2)));
            }
        }
    }
});