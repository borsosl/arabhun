import {map, numeric, SequenceArray} from './tlit-to-unicode-map';

const lineSplitter = /\r?\n/;

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
    let pending = '';
    let wordStart = 0;

    for(let ix = 0; ix < len; ix++) {
        const ch = line.charAt(ix);
        const cdp = ch.codePointAt(0);
        if(isWhite(cdp)) {
            wordStart = ix + 1;
            cp.push(cdp);
            continue;
        }
        if(!trans) {
            if(ch === '{' && !shortQuote) {
                trans = true;
                wordStart = ix + 1;
            } else {
                cp.push(cdp);
                if(shortQuote)
                    trans = true;
            }
            continue;
        }
        if(ch === '}' || (shortQuote = ch === '`')) {
            trans = false;
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
            continue;
        }
        if(ch === '-' || ch === '^')
            continue;   // - ignored, ^ handled with lookahead

        let chMapping = map[ch];
        if(!chMapping) {
            cp.push(ch.codePointAt(0));
            continue;
        }
        if(typeof chMapping === 'number') {
            handleShaddahSwap(false);
            cp.push(chMapping);
            continue;
        }
        const seqArr = chMapping as SequenceArray;
        let found = false;
        for(const seq of seqArr) {
            const sub = line.substr(ix, seq[0].length);
            if(sub !== seq[0])
                continue;
            found = true;
            const seqMapping = seq[1];
            if(seqMapping instanceof Array) {
                if(ch !== '@')  // shadda comes into the middle of ah
                    handleShaddahSwap(false);
                for(let c of seqMapping as number[]) {
                    if(c < 0) {
                        if(addTashkil || enforceTashkil(line, ix + sub.length))
                            c = -c;
                        else
                            continue;
                    }
                    cp.push(c);
                    if(ch === '@' && c === 0x064e)
                        handleShaddahSwap(false);
                }
            } else {
                let c = seqMapping as number;
                let isTashkil;
                if(c < 0) {
                    if(ix === wordStart && seq.length !== 3)    // alif before leading tashkil, unless specified
                        cp.push(0x0627);
                    if(addTashkil || enforceTashkil(line, ix + sub.length)) {
                        c = -c;
                        isTashkil = true;
                    } else if(seq.length === 3) {       // specified replacement of tashkil(-like) char
                        c = seq[2];
                    } else {
                        ix += sub.length - 1;           // no replacement for tashkil in plain mode, just skip it
                        continue;
                    }
                }
                if(handleShaddahSwap(isTashkil, ch))
                    continue;
                cp.push(c);
            }
            ix += sub.length - 1;
            break;
        }
        if(!found) {
            cp.push(ch.codePointAt(0));
        }
    }
    handleShaddahSwap(false);
    return String.fromCodePoint.apply(null, cp);


    function handleShaddahSwap(isTashkil: boolean, sub?: string) {
        if(!isTashkil) {
            if(pending === '+') {
                cp.push(0x0651);
                pending = '';
            }
        } else if(sub === '+') {
            pending = sub;
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
