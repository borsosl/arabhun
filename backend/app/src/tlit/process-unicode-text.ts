import {map} from './unicode-to-tlit-map';

const lineSplitter = /\r?\n/;
const pendingRex = /^([auoieA012]|2A|[aiu]N|1[*~])$/;
const shaddaSwapRex = /^([auoie012]|[aiu]N|1[*~])$/;
const quoteEndRex = /(\s*)}/g;
const numEndRex = /(\s*)]/g;

const transChar: {[key: number]: boolean} = {};
for(const k of [48, 49, 50, 51, 42, 126, 94, 95, 96]) {    // 0123*~^_`
    transChar[k] = true;
}

// for embedding:
// noinspection JSUnusedGlobalSymbols
export function processUnicode(txt: string) {
    const outLines: string[] = [];
    const lines = txt.split(lineSplitter);
    for(const line of lines)
        outLines.push(processLine(line));
    return outLines.join('\r\n');
}

export function processLine(line: string, doQuote = true) {
    let cp: number[] = [];
    let trans = true;
    let numTrans = false;
    let pending = '';
    let prevLetterCode = 0;
    let prevCh = '';
    let quoteStart = 0;
    let wordStart = 0;
    let wordBreak = false;
    for(let ix=0; ix < line.length; ix++) {
        let code = line.codePointAt(ix);
        if(isWhite(code) || code === 0x2d) {
            endWord(pending, cp.length-wordStart, cp);
            if(trans && code === 0x2d)
                cp.push('`'.charCodeAt(0));
            cp.push(code);
            wordBreak = true;
            continue;
        }
        if(wordBreak) {
            pending = '';
            prevLetterCode = 0;
            prevCh = '';
            wordStart = cp.length;
            wordBreak = false;
        }
        if(code >= 0x600 && code < 0x700) {
            if(!trans) {
                if(doQuote) {
                    endQuote(cp, quoteStart);
                    wordStart = cp.length;
                }
                trans = true;
            }
            if(!numTrans && code >= 0x660 && code <= 0x66d && code !== 0x66a) {
                cp.push('['.codePointAt(0));
                numTrans = true;
            }
            if(numTrans && (code < 0x660 || code > 0x66d) && code !== 0x60d) {
                cp.push(']'.codePointAt(0));
                numTrans = false;
            }
        } else if(trans && isLatin(code)) {
            if(doQuote)
                cp.push('}'.codePointAt(0));
            trans = false;
            quoteStart = cp.length;
        }
        if(code < 0x600 || code >= 0x700) {
            endWord(pending, cp.length-wordStart, cp);
            pending = '';
            prevCh = '';
            cp.push(code);
            if(code >= 0x10000)
                ix++;
            continue;
        }

        let ch = map[code];
        if(pending) {
            if(ch === '+' && shaddaSwapRex.test(pending)) {
                write(ch, cp);
            }
            if(pending === 'A') {
                if(ch === 'aN')
                    ch = 'AN';
                else
                    write(pending, cp);
            } else if(pending === '2A') {
                if(ch === 'a')
                    ch = '2a';
                else if(ch === 'u')
                    ch = '2u';
                else if(ch === '0')
                    ch = '20';
                else
                    write(pending, cp);
            } else if(pending === '2i') {
                if(ch === 'i')
                    ch = pending;
                else
                    write('2i*', cp);
            } else if(pending === '2') {
                write('2-', cp);
            } else {
                write(pending, cp);
            }
            pending = '';
        } else {
            if(ch === '2i') {
                pending = ch;
                prevCh = '';
                continue;
            }
        }
        if(wordStart === cp.length) {
            if(ch === 'Y')
                ch = 'y';
            else if(ch === 'U')
                ch = 'w';
        } else if(ch === 'Y' && prevCh.endsWith('a')) {
            ch = 'y';
        } else if(ch === 'U' && prevCh.endsWith('a')) {
            ch = 'w';
        }
        if(!numTrans && pendingRex.test(ch)) {
            pending = prevCh = ch;
            continue;
        }
        if(!ch) {
            cp.push(code);
            prevCh = '';
            continue;
        }
        prevLetterCode = code;
        prevCh = ch;
        if(ch != '+')
            write(ch, cp);
    }
    if(trans) {
        endWord(pending, cp.length - wordStart, cp);
        if(numTrans)
            cp.push(']'.codePointAt(0));
    } else if(doQuote)
        endQuote(cp, quoteStart);
    return String.fromCodePoint.apply(null, cp)
        .replace(quoteEndRex, '}$1')
        .replace(numEndRex, ']$1');
}

function write(ch: string, cp: number[]) {
    for(const k of ch)
        cp.push(k.codePointAt(0));
}

function endQuote(cp: number[], quoteStart: number) {
    if(cp.length - quoteStart > 10) {
        completeLongQuote(cp);
        return;
    }
    let cp2 = [96, cp[quoteStart]];
    let c = 1;
    for(let i = quoteStart+1; i < cp.length; i++) {
        if(isLatin(cp[i])) {
            if(++c > 2) {
                completeLongQuote(cp);
                return;
            }
            cp2.push(96, cp[i]);
        } else
            cp2.push(cp[i]);
    }
    cp.length = quoteStart - 1;
    cp.push(...cp2);
}

function completeLongQuote(cp: number[]) {
    cp.push('{'.codePointAt(0));
}

function endWord(pending: string, wordLen: number, cp: number[]) {
    if(!pending)
        return;
    if(pending === '2i')
        pending = '2i*';
    write(pending, cp);
}

function isWhite(code: number) {
    return code <= 32 || code === 160 || code >= 0x2000 && code <= 0x200a;
}

function isLatin(c: number) {
    return c >= 0x61 && c <= 0x7a || c >= 0x41 && c <= 0x5a
        || c >= 0x30 && c <= 0x39 || c >= 0xc0 && c < 0x180
        || transChar[c];
}
