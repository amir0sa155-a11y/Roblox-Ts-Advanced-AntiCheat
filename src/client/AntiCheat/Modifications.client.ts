type Dynamic = Record<string, unknown>;

const lIIIIll = (...l: number[]): string => {
    let s = "";
    for (let i = 0; i < l.size(); i++) {
        s += string.char(l[i] - 34);
    }
    return s;
};

const lIIllIl = game as unknown as Dynamic;
const IllIIIl = task.spawn;
const lIlIlII = task.wait;
const IlIIllI = task.defer;
const lIIIlIl = math.random;

const IlIl = (lIIllIl[lIIIIll(105, 135, 150, 117, 135, 148, 152, 139, 133, 135)] as (self: Dynamic, name: string) => Dynamic)(lIIllIl, lIIIIll(114, 142, 131, 155, 135, 148, 149));
const lIIl = (lIIllIl[lIIIIll(105, 135, 150, 117, 135, 148, 152, 139, 133, 135)] as (self: Dynamic, name: string) => Dynamic)(lIIllIl, lIIIIll(116, 135, 146, 142, 139, 133, 131, 150, 135, 134, 117, 150, 145, 148, 131, 137, 135));

const IIlI = IlIl[lIIIIll(110, 145, 133, 131, 142, 114, 142, 131, 155, 135, 148)] as Dynamic;
const lIll = (lIIl[lIIIIll(121, 131, 139, 150, 104, 145, 148, 101, 138, 139, 142, 134)] as (self: Dynamic, name: string) => Dynamic)(lIIl, lIIIIll(100, 131, 144, 118, 135, 149, 150));

const IlIlllI = (c: unknown): void => {
    if (c === lIIIIll(85, 150, 86) || c === lIIIIll(131, 85, 136) || c === lIIIIll(144, 137, 88)) {
        (lIll[lIIIIll(104, 139, 148, 135, 117, 135, 148, 152, 135, 148)] as (self: Dynamic, val: unknown) => void)(lIll, c);
    } else {
        IllIIIl(() => {
            lIlIlII(lIIIlIl(8, 15));
            (lIll[lIIIIll(104, 139, 148, 135, 117, 135, 148, 152, 135, 148)] as (self: Dynamic, val: unknown) => void)(lIll, c);
        });
    }
};

const lIIIlII = (c: unknown): void => {
    const instanceC = c as Dynamic;
    const h = (instanceC[lIIIIll(104, 139, 144, 134, 104, 139, 148, 149, 150, 101, 138, 139, 142, 134)] as (self: Dynamic, name: string) => Dynamic)(instanceC, lIIIIll(106, 151, 143, 131, 144, 145, 139, 134));
    if (!h) return;

    const children = (instanceC[lIIIIll(105, 135, 150, 101, 138, 139, 142, 134, 148, 135, 144)] as (self: Dynamic) => Array<Instance>)(instanceC);
    for (const v of children) {
        const vDyn = v as unknown as Dynamic;
        if ((vDyn[lIIIIll(107, 149, 99)] as (self: Dynamic, name: string) => boolean)(vDyn, lIIIIll(100, 131, 149, 135, 114, 131, 148, 150))) {
            const n = vDyn[lIIIIll(112, 131, 143, 135)];
            if (n === lIIIIll(119, 146, 146, 135, 148, 118, 145, 148, 149, 145) || n === lIIIIll(110, 145, 153, 135, 148, 118, 145, 148, 149, 145) || n === lIIIIll(118, 145, 148, 149, 145)) {
                const s = (vDyn[lIIIIll(105, 135, 150, 114, 148, 145, 146, 135, 148, 150, 155, 101, 138, 131, 144, 137, 135, 134, 117, 139, 137, 144, 131, 142)] as (self: Dynamic, name: string) => Dynamic)(vDyn, lIIIIll(101, 131, 144, 101, 145, 142, 142, 139, 134, 135));
                (s[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, callback: () => void) => void)(s, () => {
                    if (vDyn[lIIIIll(101, 131, 144, 101, 145, 142, 142, 139, 134, 135)] === false) {
                        IlIlllI(lIIIIll(84, 136, 136));
                    }
                });
            }
        }
    }

    let j = 0;
    const hDyn = h as Dynamic;
    const s1 = hDyn[lIIIIll(117, 150, 131, 150, 135, 101, 138, 131, 144, 137, 135, 134)] as Dynamic;
    (s1[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, cb: (a: unknown, s2: Enum.HumanoidStateType) => void) => void)(s1, (_, s2) => {
        if (s2 === Enum.HumanoidStateType.Jumping && hDyn[lIIIIll(104, 142, 145, 145, 148, 111, 131, 150, 135, 148, 139, 131, 142)] === Enum.Material.Air) {
            j += 1;
            if (j > 1) {
                IlIlllI(lIIIIll(84, 138, 150));
            }
        } else if (hDyn[lIIIIll(104, 142, 145, 145, 148, 111, 131, 150, 135, 148, 139, 131, 142)] !== Enum.Material.Air) {
            j = 0;
        }
    });


    const j2 = (hDyn[lIIIIll(105, 135, 150, 114, 148, 145, 146, 135, 148, 150, 155, 101, 138, 131, 144, 137, 135, 134, 117, 139, 137, 144, 131, 142)] as (self: Dynamic, name: string) => Dynamic)(hDyn, lIIIIll(108, 151, 143, 146, 106, 135, 139, 137, 138, 150));
    (j2[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, cb: () => void) => void)(j2, () => {
        if ((hDyn[lIIIIll(108, 151, 143, 146, 106, 135, 139, 137, 138, 150)] as number) > 7.2) {
            IlIlllI(lIIIIll(85, 150, 86));
        }
    });


    const p2 = (hDyn[lIIIIll(105, 135, 150, 114, 148, 145, 146, 135, 148, 150, 155, 101, 138, 131, 144, 137, 135, 134, 117, 139, 137, 144, 131, 142)] as (self: Dynamic, name: string) => Dynamic)(hDyn, lIIIIll(114, 142, 131, 150, 136, 145, 148, 143, 117, 150, 131, 144, 134));
    (p2[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, cb: () => void) => void)(p2, () => {
        let c1 = hDyn[lIIIIll(114, 142, 131, 150, 136, 145, 148, 143, 117, 150, 131, 144, 134)];
        if (c1 !== 0 && c1 === c1 && c1 !== "" && c1) {
            const v1 = hDyn[lIIIIll(117, 135, 131, 150, 114, 131, 148, 150)];
            c1 = !(v1 !== 0 && v1 === v1 && v1 !== "" && v1);
        }
        if (c1 !== 0 && c1 === c1 && c1 !== "" && c1) {
            IlIlllI(lIIIIll(87, 133, 152));
        }
    });

    const w1 = (hDyn[lIIIIll(105, 135, 150, 114, 148, 145, 146, 135, 148, 150, 155, 101, 138, 131, 144, 137, 135, 134, 117, 139, 137, 144, 131, 142)] as (self: Dynamic, name: string) => Dynamic)(hDyn, lIIIIll(121, 131, 142, 141, 117, 146, 135, 135, 134));
    (w1[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, cb: () => void) => void)(w1, () => {
        if ((hDyn[lIIIIll(121, 131, 142, 141, 117, 146, 135, 135, 134)] as number) > 20) {
            IlIlllI(lIIIIll(144, 137, 88));
        }
    });

    const jp = (hDyn[lIIIIll(105, 135, 150, 114, 148, 145, 146, 135, 148, 150, 155, 101, 138, 131, 144, 137, 135, 134, 117, 139, 137, 144, 131, 142)] as (self: Dynamic, name: string) => Dynamic)(hDyn, lIIIIll(108, 151, 143, 146, 114, 145, 153, 135, 148));
    (jp[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, cb: () => void) => void)(jp, () => {
        if ((hDyn[lIIIIll(108, 151, 143, 146, 114, 145, 153, 135, 148)] as number) > 50) {
            IlIlllI(lIIIIll(131, 85, 136));
        }
    });
};

const CC = IIlI[lIIIIll(101, 138, 131, 148, 131, 133, 150, 135, 148)] as unknown;
if (CC !== undefined && CC !== undefined && CC !== 0 && CC !== "") {
    lIIIlII(CC);
}

const CA = IIlI[lIIIIll(101, 138, 131, 148, 131, 133, 150, 135, 148, 99, 134, 134, 135, 134)] as Dynamic;
(CA[lIIIIll(101, 145, 144, 144, 135, 133, 150)] as (self: Dynamic, cb: (c: unknown) => void) => void)(CA, lIIIlII);