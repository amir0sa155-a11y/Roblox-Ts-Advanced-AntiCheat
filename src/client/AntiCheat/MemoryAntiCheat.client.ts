interface DynamicInstance {
    [key: string]: unknown;
}

const _M = game as unknown as DynamicInstance;
const _D = (t: number[]): string => string.char(...t.map(x => x - 1));

const _GS = _D([72, 102, 117, 84, 102, 115, 119, 106, 100, 102]);
const _WC = _D([88, 98, 106, 117, 71, 112, 115, 68, 105, 106, 109, 101]);
const _RQ = _D([83, 102, 114, 118, 102, 116, 117, 82, 118, 102, 118, 102, 84, 106, 123, 102]);
const _GM = _D([72, 102, 117, 85, 112, 117, 98, 109, 78, 102, 110, 112, 115, 122, 86, 116, 98, 104, 102, 78, 99]);
const _GD = _D([72, 102, 117, 69, 102, 116, 100, 102, 111, 101, 98, 111, 117, 116]);
const _FS = _D([71, 106, 115, 102, 84, 102, 115, 119, 102, 115]);

const _CP = (_M[_GS] as (a: unknown, b: string) => unknown)(_M, _D([68, 112, 111, 117, 102, 111, 117, 81, 115, 112, 119, 106, 101, 102, 115])) as DynamicInstance;
const _P = (_M[_GS] as (a: unknown, b: string) => unknown)(_M, _D([81, 109, 98, 122, 102, 115, 116])) as DynamicInstance;
const _RS = (_M[_GS] as (a: unknown, b: string) => unknown)(_M, _D([83, 102, 113, 109, 106, 100, 98, 117, 102, 101, 84, 117, 112, 115, 98, 104, 102])) as DynamicInstance;
const _S = (_M[_GS] as (a: unknown, b: string) => unknown)(_M, _D([84, 117, 98, 117, 116])) as DynamicInstance;
const _BT = (_RS[_WC] as (a: unknown, b: string) => unknown)(_RS, _D([67, 98, 111, 85, 102, 116, 117])) as DynamicInstance;

const _iQ = _CP[_RQ] as number;
if (_iQ > 0) {
    do { task.wait(); } while ((_CP[_RQ] as number) > _iQ * 0.9);
}

const _LP = _P[_D([77, 112, 100, 98, 109, 81, 109, 98, 122, 102, 115])] as DynamicInstance;
const _PG = (_LP[_WC] as (a: unknown, b: string) => unknown)(_LP, _D([81, 109, 98, 122, 102, 115, 72, 118, 106])) as DynamicInstance;

let _sM = (_S[_GM] as (a: unknown) => number)(_S);
let _lI = ((_M[_GD] as (a: unknown) => unknown[])(_M)).size();
let _lGI = ((_PG[_GD] as (a: unknown) => unknown[])(_PG)).size();
let _iT = false;

task.spawn(() => {
    while (true) {
        task.wait(1);
        if (_iT) {
            _sM = (_S[_GM] as (a: unknown) => number)(_S);
            _lI = ((_M[_GD] as (a: unknown) => unknown[])(_M)).size();
            _lGI = ((_PG[_GD] as (a: unknown) => unknown[])(_PG)).size();
            continue;
        }

        const _cM = (_S[_GM] as (a: unknown) => number)(_S);
        const _cI = ((_M[_GD] as (a: unknown) => unknown[])(_M)).size();
        const _cGI = ((_PG[_GD] as (a: unknown) => unknown[])(_PG)).size();

        const _mD = _cM - _sM;
        const _iD = _cI - _lI;
        const _gD = _cGI - _lGI;

        if (_mD > 600) {
            (_BT[_FS] as (a: unknown, b: string) => void)(_BT, _D([105, 55, 98]));
        } else if (_mD >= 60) {
            if (_iD < 50 && _gD < 30) {
                _iT = true;
                task.spawn(() => {
                    const _sTM = _cM;
                    let _j = false;
                    for (let _sec = 1; _sec <= 10; _sec++) {
                        task.wait(1);
                        const _chM = (_S[_GM] as (a: unknown) => number)(_S);
                        const _chI = ((_M[_GD] as (a: unknown) => unknown[])(_M)).size();
                        const _chGI = ((_PG[_GD] as (a: unknown) => unknown[])(_PG)).size();
                        
                        if ((_CP[_RQ] as number) > 5 || (_chI - _cI) > 100 || (_chGI - _cGI) > 40 || _chM < (_sTM - 20)) {
                            _j = true; 
                            break;
                        }
                    }

                    if (!_j) {
                        if (((_S[_GM] as (a: unknown) => number)(_S)) >= (_sTM - 15)) {
                            (_LP[_D([76, 106, 100, 108])] as (a: unknown, b: string) => void)(_LP, _D([84, 102, 100, 118, 115, 106, 117, 122, 59, 33, 66, 111, 112, 110, 98, 109, 112, 118, 116, 33, 78, 102, 110, 112, 115, 122, 33, 83, 102, 117, 102, 111, 117, 106, 112, 111]));
                        }
                    }

                    _sM = (_S[_GM] as (a: unknown) => number)(_S);
                    _lI = ((_M[_GD] as (a: unknown) => unknown[])(_M)).size();
                    _lGI = ((_PG[_GD] as (a: unknown) => unknown[])(_PG)).size();
                    _iT = false;
                });
            } else {
                _sM = _cM;
            }
        } else if (_cM < _sM || _iD > 50 || _gD > 30) {
            _sM = _cM;
        }

        _lI = _cI;
        _lGI = _cGI;
    }
});