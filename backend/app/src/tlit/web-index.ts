import {processTrans} from './process-tlit-text';
import {processUnicode} from './process-unicode-text';

const inEl = document.querySelector('#in') as HTMLTextAreaElement;
const outEl = document.querySelector('#out') as HTMLTextAreaElement;
const isTransEl = document.querySelector('#is-trans') as HTMLInputElement;
const isUniEl = document.querySelector('#is-uni') as HTMLInputElement;
const fontPlusEl = document.querySelector('#font-plus') as HTMLInputElement;
const fontMinusEl = document.querySelector('#font-minus') as HTMLInputElement;
const loadSampleEl = document.querySelector('#load-sample') as HTMLInputElement;
const tashkilEl = document.querySelector('#tashkil') as HTMLInputElement;
const ltrEl = document.querySelector('#ltr') as HTMLInputElement;
const copyTransEl = document.querySelector('#copy-trans') as HTMLImageElement;
const copyArabEl = document.querySelector('#copy-arabic') as HTMLImageElement;
const wiktionaryEl = document.querySelector('#wiktionary') as HTMLImageElement;
const gtranslateEl = document.querySelector('#gtranslate') as HTMLImageElement;

let prev = '';
let fontSize = 160;
let skipNextFocusEvent = false;

function sourceChange() {
    prev = '';
    tlitChange();
    arabicChange();
}

function tlitChange() {
    if(!isTransEl.checked)
        return;
    const text = inEl.value;
    if(text === prev)
        return;
    outEl.value = processTrans(text, tashkilEl.checked);
    if(prev && text.startsWith(prev))
        outEl.scrollTop = outEl.scrollHeight;
    prev = text;
}

function arabicChange() {
    if(isTransEl.checked)
        return;
    const text = outEl.value;
    if(text === prev)
        return;
    inEl.value = processUnicode(text);
    if(prev && text.startsWith(prev))
        inEl.scrollTop = inEl.scrollHeight;
    prev = text;
}

function pageActivated() {
    skipNextFocusEvent = true;
}

function selectAllOnFocus(el: HTMLTextAreaElement) {
    if(!skipNextFocusEvent)
        el.select();
    skipNextFocusEvent = false;
}

function adjustFontSize(delta: number) {
    fontSize += delta;
    outEl.style.fontSize = fontSize + '%';
}

function loadSample() {
    inEl.value = `namuUd*aj: Al-byt bay0taNA bay0tAN li-l-2iYjAr s*ad+ah* uk0tub0 u*k0tu____b0 maA2Yidah* h1d*A 3am+^aAn 3o^maAn [1,234.56]
}Click on "Show tashkil" and see differences. Embed: {kalimaT*uN} = word
}Such mixed content is best viewed with "Left-to-right" on.`;
    inEl.style.height = '6em';
    outEl.className = '';
    outEl.style.height = '6em';
    isTransEl.checked = true;
    tashkilEl.checked = false;
    ltrEl.checked = true;
    fontSize = 110;
    outEl.style.fontSize = fontSize + '%';
    prev = '';
    tlitChange();
}

function tashkilClick() {
    prev = '';
    tlitChange();
}

function ltrClick() {
    outEl.className = ltrEl.checked ? '' : 'rtl';
}

function copy(textEl: HTMLTextAreaElement) {
    textEl.select();
    document.execCommand('copy');
}

function wiktionaryClick() {
    window.open('https://en.wiktionary.org/wiki/' + encodeURIComponent(outEl.value), '_blank').focus();
}

function gtranslateClick() {
    window.open('https://translate.google.com/?sl=ar&tl=en&op=translate&text=' + encodeURIComponent(outEl.value), '_blank').focus();
}

isTransEl.onclick = sourceChange;
isUniEl.onclick = sourceChange;
inEl.onkeyup = tlitChange;
inEl.onfocus = () => selectAllOnFocus(inEl);
outEl.onkeyup = arabicChange;
outEl.onfocus = () => selectAllOnFocus(outEl);
fontPlusEl.onclick = () => adjustFontSize(20);
fontMinusEl.onclick = () => adjustFontSize(-20);
loadSampleEl.onclick = loadSample;
tashkilEl.onclick = tashkilClick;
ltrEl.onclick = ltrClick;
copyTransEl.onclick = () => copy(inEl);
copyArabEl.onclick = () => copy(outEl);
wiktionaryEl.onclick = wiktionaryClick;
gtranslateEl.onclick = gtranslateClick;
window.onfocus = pageActivated;
