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
const NAM = Decode([79, 98, 110, 102]);
const ISA = Decode([74, 116, 66]);
const GPCS = Decode([72, 102, 117, 81, 115, 112, 113, 102, 115, 117, 122, 68, 105, 98, 111, 104, 102, 101, 84, 106, 104, 111, 98, 109]);
const CON = Decode([68, 112, 111, 111, 102, 100, 117]);
const FFC = Decode([71, 106, 111, 101, 71, 106, 115, 116, 117, 68, 105, 106, 109, 101]);
const GCH = Decode([72, 102, 117, 68, 105, 106, 109, 101, 115, 102, 111]);
const GPL = Decode([72, 102, 117, 81, 109, 98, 122, 102, 115, 116]);
const CHR = Decode([68, 105, 98, 115, 98, 100, 117, 102, 115]);

const Send = (c: unknown): void => {
    const codeStr = c as string;
    if (codeStr === Decode([52, 117, 53]) || codeStr === Decode([98, 52, 103]) || codeStr === Decode([111, 104, 55])) {
        (BE[FS] as (a: unknown, b: unknown) => void)(BE, c);
    } else {
        task.spawn(() => {
            task.wait(math.random(8, 15));
            (BE[FS] as (a: unknown, b: unknown) => void)(BE, c);
        });
    }
};

const Check = (char: unknown): void => {
    const charInst = char as DynamicInstance;
    const hum = (charInst[FFC] as (a: unknown, b: string) => unknown)(charInst, Decode([73, 118, 110, 98, 111, 112, 106, 101])) as DynamicInstance;
    if (!hum) return;

    const children = (charInst[GCH] as (a: unknown) => DynamicInstance[])(charInst);
    for (const v of children) {
        const isaFunc = v[ISA] as (a: unknown, b: string) => boolean;
        if (isaFunc(v, Decode([67, 98, 116, 102, 81, 98, 115, 117]))) {
            const partName = v[NAM] as string;
            if (partName === Decode([86, 113, 113, 102, 115, 85, 112, 115, 116, 112]) || 
                partName === Decode([77, 112, 120, 102, 115, 85, 112, 115, 116, 112]) || 
                partName === Decode([85, 112, 115, 116, 112])) {
                
                const propSignal = (v[GPCS] as (a: unknown, b: string) => unknown)(v, Decode([68, 98, 111, 68, 112, 109, 109, 106, 101, 102])) as DynamicInstance;
                (propSignal[CON] as (a: unknown, b: () => void) => void)(propSignal, () => {
                    if (v[Decode([68, 98, 111, 68, 112, 109, 109, 106, 101, 102])] === false) {
                        Send(Decode([51, 103, 103]));
                    }
                });
            }
        }
    }

    let j = 0;
    const stc = hum[Decode([84, 117, 98, 117, 102, 68, 105, 98, 111, 104, 102, 101])] as DynamicInstance;
    (stc[CON] as (a: unknown, b: (a: unknown, s: Enum.HumanoidStateType) => void) => void)(stc, (_: unknown, s: Enum.HumanoidStateType) => {
        if (s === Enum.HumanoidStateType.Jumping && hum[Decode([71, 109, 112, 112, 115, 78, 98, 117, 102, 115, 106, 98, 109])] === Enum.Material.Air) {
            j++; if (j > 1) Send(Decode([51, 105, 117]));
        } else if (hum[Decode([71, 109, 112, 112, 115, 78, 98, 117, 102, 115, 106, 98, 109])] !== Enum.Material.Air) { j = 0; }
    });

    const dad = charInst[Decode([69, 102, 116, 100, 102, 111, 101, 98, 111, 117, 66, 101, 101, 102, 101])] as DynamicInstance;
    (dad[CON] as (a: unknown, b: (d: unknown) => void) => void)(dad, (d: unknown) => {
        const dInst = d as DynamicInstance;
        const isaFunc = dInst[ISA] as (a: unknown, b: string) => boolean;
        if (isaFunc(dInst, Decode([66, 117, 117, 98, 100, 105, 110, 102, 111, 117])) && dInst[NAM] === Decode([66, 117, 117, 98, 100, 105, 110, 102, 111, 117])) {
            task.defer(() => {
                task.wait(0.1);
                const p = hum[Decode([81, 98, 115, 102, 111, 117])] as DynamicInstance | undefined;
                if (p && (p[Decode([72, 102, 117, 66, 117, 117, 115, 106, 99, 118, 117, 102])] as (a: unknown, b: string) => unknown)(p, Decode([85, 98, 116, 102, 101])) === false) Send(Decode([51, 103, 103]));
            });
        }
    });

    const jhh = (hum[GPCS] as (a: unknown, b: string) => unknown)(hum, Decode([75, 118, 110, 113, 73, 102, 106, 104, 105, 117])) as DynamicInstance;
(jhh[CON] as (a: unknown, b: () => void) => void)(jhh, () => {
    if ((hum[Decode([75, 118, 110, 113, 73, 102, 106, 104, 105, 117])] as number) > 7.2) {
        Send(Decode([52, 117, 53])); 
    }
});

    const psg = (hum[GPCS] as (a: unknown, b: string) => unknown)(hum, Decode([81, 109, 98, 117, 103, 112, 115, 110, 84, 117, 98, 111, 101])) as DynamicInstance;
    (psg[CON] as (a: unknown, b: () => void) => void)(psg, () => {
        if (hum[Decode([81, 109, 98, 117, 103, 112, 115, 110, 84, 117, 98, 111, 101])] && !hum[Decode([84, 102, 98, 117, 81, 98, 115, 117])]) Send(Decode([54, 101, 119]));
    });

    const wsg = (hum[GPCS] as (a: unknown, b: string) => unknown)(hum, Decode([88, 98, 109, 108, 84, 113, 102, 102, 101])) as DynamicInstance;
    (wsg[CON] as (a: unknown, b: () => void) => void)(wsg, () => {
        if ((hum[Decode([88, 98, 109, 108, 84, 113, 102, 102, 101])] as number) > 20) Send(Decode([111, 104, 55]));
    });

    const jpw = (hum[GPCS] as (a: unknown, b: string) => unknown)(hum, Decode([75, 118, 110, 113, 81, 112, 120, 102, 115])) as DynamicInstance;
    (jpw[CON] as (a: unknown, b: () => void) => void)(jpw, () => {
        if ((hum[Decode([75, 118, 110, 113, 81, 112, 120, 102, 115])] as number) > 50) Send(Decode([98, 52, 103]));
    });
};






const Char = LP[CHR] as unknown;
if (Char) Check(Char);
const Cad = LP[Decode([68, 105, 98, 115, 98, 100, 117, 102, 115, 66, 101, 101, 102, 101])] as DynamicInstance;
(Cad[CON] as (a: unknown, b: (c: unknown) => void) => void)(Cad, Check);