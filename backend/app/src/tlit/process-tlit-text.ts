import {map, sequence, numeric} from './tlit-to-unicode-map';

const lineSplitter = /\r?\n/;
const alifHamzaRex = /2[auoie]/;
const tashkilRex = /^([auoie0+1]|[aiu]N|AN|20|1[*~])$/;
const startingVowelRex = /^[uoie]$/;

// for embedding:
// noinspection JSUnusedGlobalSymbols
export function processTrans(txt: string, tashkil: boolean) {
    const outLines: string[] = [];
    const lines = txt.split(lineSplitter);
    for(const line of lines)
        outLines.push(processLine(line, tashkil));
    return outLines.join('\r\n');
}

export function processLine(line: string, addTashkil = true) {
    let trans = true;
    let shortQuote = false;
    let numQuote = false;
    let cp: number[] = [];
    const len = line.length;
    let alifHamza = false;
    let pending = '';
    let wordStart = 0;

    for(let ix = 0; ix < len; ix++) {
        const ch = line.charAt(ix);
        const cdp = ch.codePointAt(0);
        if(isWhite(cdp)) {
            wordStart = ix + 1;
            cp.push(cdp);
            reset();
            continue;
        }
        if(!trans) {
            if(ch === '{')
                trans = true;
            else {
                cp.push(cdp);
                if(shortQuote)
                    trans = true;
            }
            reset();
            continue;
        }
        if(ch === '}' || (shortQuote = ch === '`')) {
            trans = false;
            reset();
            continue;
        }
        if(numQuote) {
            if(ch === ']') {
                numQuote = false;
                continue;
            }
            let c = numeric[ch];
            if(c) {
                cp.push(c);
            } else {
                cp.push(cdp);
            }
            continue;
        }
        if(ch === '[') {
            numQuote = true;
            reset();
            continue;
        }
        if(ch === '^') {
            reset();
            continue;   // handled with lookahead
        }
        let sub = line.substr(ix, 2);
        const isTashkil = tashkilRex.test(sub);
        if(isTashkil && !addTashkil && !enforceTashkil(line, ix + sub.length)) {
            if(sub === 'AN' || sub === '1~')
                sub = 'A';
            else if(sub === '20')
                sub = '2A';
            else {
                reset();
                if(ix === wordStart && line.length === 1)
                    cp.push(map['A']);
                ix += sub.length - 1;
                continue;
            }
        } else if(alifHamza && sub[1] === '*' && startingVowelRex.test(sub[0])) {
            reset();
            ix++;
            continue;
        }
        alifHamza = false;
        const cc = sequence[sub];
        if(cc) {
            if(handleShaddah(false, sub))
                continue;
            for(const c of cc)
                cp.push(c);
            ix++;
            continue;
        }
        let c = map[sub];
        if(c) {
            if(handleShaddah(isTashkil, sub))
                continue;
            if(ix === wordStart && startingVowelRex.test(sub))
                cp.push(map['A']);
            cp.push(c);
            if(line.length >= ix + 2) {
                alifHamza = alifHamzaRex.test(sub);
                if(alifHamza) {
                    continue;
                }
                ix++;
            }
        } else {
            sub = ch;
            if(ix === wordStart && startingVowelRex.test(sub))
                cp.push(map['A']);
            let isTashkil = tashkilRex.test(sub);
            if(isTashkil && !addTashkil && !enforceTashkil(line, ix + 1)) {
                reset();
                continue;
            }
            if(handleShaddah(isTashkil, sub))
                continue;
            if(sub === '-') {
                reset();
                continue;
            }
            c = map[sub];
            if(!c) {
                cp.push(sub.codePointAt(0));
                reset();
                continue;
            }
            cp.push(c);
        }
    }
    if(pending)
        cp.push(map[pending]);
    return String.fromCodePoint.apply(null, cp);

    function reset() {
        alifHamza = false;
    }

    function handleShaddah(isTashkil: boolean, sub: string) {
        if(!isTashkil) {
            if(pending === '+') {
                cp.push(map[pending]);
                pending = '';
            }
        } else if(sub === '+') {
            pending = sub;
            reset();
            return true;
        }
    }
}

function enforceTashkil(word: string, ix: number) {
    return word.length > ix && word[ix] === '^';
}

function isWhite(code: number) {
    return code <= 32 || code === 160 || code >= 0x2000 && code <= 0x200a;
}
