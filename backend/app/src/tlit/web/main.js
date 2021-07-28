/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./backend/app/src/keyboard/web-index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./backend/app/src/keyboard/process-tlit-text.ts":
/*!*******************************************************!*\
  !*** ./backend/app/src/keyboard/process-tlit-text.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.processLine = exports.processTrans = void 0;\r\nconst tlit_to_unicode_map_1 = __webpack_require__(/*! ./tlit-to-unicode-map */ \"./backend/app/src/keyboard/tlit-to-unicode-map.ts\");\r\nconst lineSplitter = /\\r?\\n/;\r\nconst alifHamzaRex = /2[auoie]/;\r\nconst tashkilRex = /^([auoie0+1]|[aiu]N|AN|20|1[*~])$/;\r\nconst startingVowelRex = /^[uoie]$/;\r\n// for embedding:\r\n// noinspection JSUnusedGlobalSymbols\r\nfunction processTrans(txt, tashkil) {\r\n    const outLines = [];\r\n    const lines = txt.split(lineSplitter);\r\n    for (const line of lines)\r\n        outLines.push(processLine(line, tashkil));\r\n    return outLines.join('\\r\\n');\r\n}\r\nexports.processTrans = processTrans;\r\nfunction processLine(line, addTashkil = true) {\r\n    let trans = true;\r\n    let shortQuote = false;\r\n    let numQuote = false;\r\n    let cp = [];\r\n    const len = line.length;\r\n    let alifHamza = false;\r\n    let pending = '';\r\n    let wordStart = 0;\r\n    for (let ix = 0; ix < len; ix++) {\r\n        const ch = line.charAt(ix);\r\n        const cdp = ch.codePointAt(0);\r\n        if (isWhite(cdp)) {\r\n            wordStart = ix + 1;\r\n            cp.push(cdp);\r\n            reset();\r\n            continue;\r\n        }\r\n        if (!trans) {\r\n            if (ch === '{')\r\n                trans = true;\r\n            else {\r\n                cp.push(cdp);\r\n                if (shortQuote)\r\n                    trans = true;\r\n            }\r\n            reset();\r\n            continue;\r\n        }\r\n        if (ch === '}' || (shortQuote = ch === '`')) {\r\n            trans = false;\r\n            reset();\r\n            continue;\r\n        }\r\n        if (numQuote) {\r\n            if (ch === ']') {\r\n                numQuote = false;\r\n                continue;\r\n            }\r\n            let c = tlit_to_unicode_map_1.numeric[ch];\r\n            if (c) {\r\n                cp.push(c);\r\n            }\r\n            else {\r\n                cp.push(cdp);\r\n            }\r\n            continue;\r\n        }\r\n        if (ch === '[') {\r\n            numQuote = true;\r\n            reset();\r\n            continue;\r\n        }\r\n        if (ch === '^') {\r\n            reset();\r\n            continue; // handled with lookahead\r\n        }\r\n        let sub = line.substr(ix, 2);\r\n        const isTashkil = tashkilRex.test(sub);\r\n        if (isTashkil && !addTashkil && !enforceTashkil(line, ix + sub.length)) {\r\n            if (sub === 'AN' || sub === '1~')\r\n                sub = 'A';\r\n            else if (sub === '20')\r\n                sub = '2A';\r\n            else {\r\n                reset();\r\n                if (ix === wordStart && line.length === 1)\r\n                    cp.push(tlit_to_unicode_map_1.map['A']);\r\n                ix += sub.length - 1;\r\n                continue;\r\n            }\r\n        }\r\n        else if (alifHamza && sub[1] === '*' && startingVowelRex.test(sub[0])) {\r\n            reset();\r\n            ix++;\r\n            continue;\r\n        }\r\n        alifHamza = false;\r\n        const cc = tlit_to_unicode_map_1.sequence[sub];\r\n        if (cc) {\r\n            if (handleShaddah(false, sub))\r\n                continue;\r\n            for (const c of cc)\r\n                cp.push(c);\r\n            ix++;\r\n            continue;\r\n        }\r\n        let c = tlit_to_unicode_map_1.map[sub];\r\n        if (c) {\r\n            if (handleShaddah(isTashkil, sub))\r\n                continue;\r\n            if (ix === wordStart && startingVowelRex.test(sub))\r\n                cp.push(tlit_to_unicode_map_1.map['A']);\r\n            cp.push(c);\r\n            if (line.length >= ix + 2) {\r\n                alifHamza = alifHamzaRex.test(sub);\r\n                if (alifHamza) {\r\n                    continue;\r\n                }\r\n                ix++;\r\n            }\r\n        }\r\n        else {\r\n            sub = ch;\r\n            if (ix === wordStart && startingVowelRex.test(sub))\r\n                cp.push(tlit_to_unicode_map_1.map['A']);\r\n            let isTashkil = tashkilRex.test(sub);\r\n            if (isTashkil && !addTashkil && !enforceTashkil(line, ix + 1)) {\r\n                reset();\r\n                continue;\r\n            }\r\n            if (handleShaddah(isTashkil, sub))\r\n                continue;\r\n            if (sub === '-') {\r\n                reset();\r\n                continue;\r\n            }\r\n            c = tlit_to_unicode_map_1.map[sub];\r\n            if (!c) {\r\n                cp.push(sub.codePointAt(0));\r\n                reset();\r\n                continue;\r\n            }\r\n            cp.push(c);\r\n        }\r\n    }\r\n    if (pending)\r\n        cp.push(tlit_to_unicode_map_1.map[pending]);\r\n    return String.fromCodePoint.apply(null, cp);\r\n    function reset() {\r\n        alifHamza = false;\r\n    }\r\n    function handleShaddah(isTashkil, sub) {\r\n        if (!isTashkil) {\r\n            if (pending === '+') {\r\n                cp.push(tlit_to_unicode_map_1.map[pending]);\r\n                pending = '';\r\n            }\r\n        }\r\n        else if (sub === '+') {\r\n            pending = sub;\r\n            reset();\r\n            return true;\r\n        }\r\n    }\r\n}\r\nexports.processLine = processLine;\r\nfunction enforceTashkil(word, ix) {\r\n    return word.length > ix && word[ix] === '^';\r\n}\r\nfunction isWhite(code) {\r\n    return code <= 32 || code === 160 || code >= 0x2000 && code <= 0x200a;\r\n}\r\n\n\n//# sourceURL=webpack:///./backend/app/src/keyboard/process-tlit-text.ts?");

/***/ }),

/***/ "./backend/app/src/keyboard/process-unicode-text.ts":
/*!**********************************************************!*\
  !*** ./backend/app/src/keyboard/process-unicode-text.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.processLine = exports.processUnicode = void 0;\r\nconst unicode_to_tlit_map_1 = __webpack_require__(/*! ./unicode-to-tlit-map */ \"./backend/app/src/keyboard/unicode-to-tlit-map.ts\");\r\nconst lineSplitter = /\\r?\\n/;\r\nconst pendingRex = /^([auoieA012]|2A|[aiu]N|1[*~])$/;\r\nconst shaddaSwapRex = /^([auoie012]|[aiu]N|1[*~])$/;\r\nconst quoteEndRex = /(\\s*)}/g;\r\nconst numEndRex = /(\\s*)]/g;\r\nconst transChar = {};\r\nfor (const k of [48, 49, 50, 51, 42, 126, 94, 95, 96]) { // 0123*~^_`\r\n    transChar[k] = true;\r\n}\r\n// for embedding:\r\n// noinspection JSUnusedGlobalSymbols\r\nfunction processUnicode(txt) {\r\n    const outLines = [];\r\n    const lines = txt.split(lineSplitter);\r\n    for (const line of lines)\r\n        outLines.push(processLine(line));\r\n    return outLines.join('\\r\\n');\r\n}\r\nexports.processUnicode = processUnicode;\r\nfunction processLine(line, doQuote = true) {\r\n    let cp = [];\r\n    let trans = true;\r\n    let numTrans = false;\r\n    let pending = '';\r\n    let prevLetterCode = 0;\r\n    let prevCh = '';\r\n    let quoteStart = 0;\r\n    let wordStart = 0;\r\n    let wordBreak = false;\r\n    for (let ix = 0; ix < line.length; ix++) {\r\n        let code = line.codePointAt(ix);\r\n        if (isWhite(code) || code === 0x2d) {\r\n            endWord(pending, cp.length - wordStart, cp);\r\n            if (trans && code === 0x2d)\r\n                cp.push('`'.charCodeAt(0));\r\n            cp.push(code);\r\n            wordBreak = true;\r\n            continue;\r\n        }\r\n        if (wordBreak) {\r\n            pending = '';\r\n            prevLetterCode = 0;\r\n            prevCh = '';\r\n            wordStart = cp.length;\r\n            wordBreak = false;\r\n        }\r\n        if (code >= 0x600 && code < 0x700) {\r\n            if (!trans) {\r\n                if (doQuote) {\r\n                    endQuote(cp, quoteStart);\r\n                    wordStart = cp.length;\r\n                }\r\n                trans = true;\r\n            }\r\n            if (!numTrans && code >= 0x660 && code <= 0x66d && code !== 0x66a) {\r\n                cp.push('['.codePointAt(0));\r\n                numTrans = true;\r\n            }\r\n            if (numTrans && (code < 0x660 || code > 0x66d) && code !== 0x60d) {\r\n                cp.push(']'.codePointAt(0));\r\n                numTrans = false;\r\n            }\r\n        }\r\n        else if (trans && isLatin(code)) {\r\n            if (doQuote)\r\n                cp.push('}'.codePointAt(0));\r\n            trans = false;\r\n            quoteStart = cp.length;\r\n        }\r\n        if (code < 0x600 || code >= 0x700) {\r\n            endWord(pending, cp.length - wordStart, cp);\r\n            pending = '';\r\n            prevCh = '';\r\n            cp.push(code);\r\n            if (code >= 0x10000)\r\n                ix++;\r\n            continue;\r\n        }\r\n        let ch = unicode_to_tlit_map_1.map[code];\r\n        if (pending) {\r\n            if (ch === '+' && shaddaSwapRex.test(pending)) {\r\n                write(ch, cp);\r\n            }\r\n            if (pending === 'A') {\r\n                if (ch === 'aN')\r\n                    ch = 'AN';\r\n                else\r\n                    write(pending, cp);\r\n            }\r\n            else if (pending === '2A') {\r\n                if (ch === 'a')\r\n                    ch = '2a';\r\n                else if (ch === 'u')\r\n                    ch = '2u';\r\n                else if (ch === '0')\r\n                    ch = '20';\r\n                else\r\n                    write(pending, cp);\r\n            }\r\n            else if (pending === '2i') {\r\n                if (ch === 'i')\r\n                    ch = pending;\r\n                else\r\n                    write('2i*', cp);\r\n            }\r\n            else if (pending === '2') {\r\n                write('2-', cp);\r\n            }\r\n            else {\r\n                write(pending, cp);\r\n            }\r\n            pending = '';\r\n        }\r\n        else {\r\n            if (ch === '2i') {\r\n                pending = ch;\r\n                prevCh = '';\r\n                continue;\r\n            }\r\n        }\r\n        if (wordStart === cp.length) {\r\n            if (ch === 'Y')\r\n                ch = 'y';\r\n            else if (ch === 'U')\r\n                ch = 'w';\r\n        }\r\n        else if (ch === 'Y' && prevCh.endsWith('a')) {\r\n            ch = 'y';\r\n        }\r\n        else if (ch === 'U' && prevCh.endsWith('a')) {\r\n            ch = 'w';\r\n        }\r\n        if (!numTrans && pendingRex.test(ch)) {\r\n            pending = prevCh = ch;\r\n            continue;\r\n        }\r\n        if (!ch) {\r\n            cp.push(code);\r\n            prevCh = '';\r\n            continue;\r\n        }\r\n        prevLetterCode = code;\r\n        prevCh = ch;\r\n        if (ch != '+')\r\n            write(ch, cp);\r\n    }\r\n    if (trans) {\r\n        endWord(pending, cp.length - wordStart, cp);\r\n        if (numTrans)\r\n            cp.push(']'.codePointAt(0));\r\n    }\r\n    else if (doQuote)\r\n        endQuote(cp, quoteStart);\r\n    return String.fromCodePoint.apply(null, cp)\r\n        .replace(quoteEndRex, '}$1')\r\n        .replace(numEndRex, ']$1');\r\n}\r\nexports.processLine = processLine;\r\nfunction write(ch, cp) {\r\n    for (const k of ch)\r\n        cp.push(k.codePointAt(0));\r\n}\r\nfunction endQuote(cp, quoteStart) {\r\n    if (cp.length - quoteStart > 10) {\r\n        completeLongQuote(cp);\r\n        return;\r\n    }\r\n    let cp2 = [96, cp[quoteStart]];\r\n    let c = 1;\r\n    for (let i = quoteStart + 1; i < cp.length; i++) {\r\n        if (isLatin(cp[i])) {\r\n            if (++c > 2) {\r\n                completeLongQuote(cp);\r\n                return;\r\n            }\r\n            cp2.push(96, cp[i]);\r\n        }\r\n        else\r\n            cp2.push(cp[i]);\r\n    }\r\n    cp.length = quoteStart - 1;\r\n    cp.push(...cp2);\r\n}\r\nfunction completeLongQuote(cp) {\r\n    cp.push('{'.codePointAt(0));\r\n}\r\nfunction endWord(pending, wordLen, cp) {\r\n    if (!pending)\r\n        return;\r\n    if (pending === '2i')\r\n        pending = '2i*';\r\n    write(pending, cp);\r\n}\r\nfunction isWhite(code) {\r\n    return code <= 32 || code === 160 || code >= 0x2000 && code <= 0x200a;\r\n}\r\nfunction isLatin(c) {\r\n    return c >= 0x61 && c <= 0x7a || c >= 0x41 && c <= 0x5a\r\n        || c >= 0x30 && c <= 0x39 || c >= 0xc0 && c < 0x180\r\n        || transChar[c];\r\n}\r\n\n\n//# sourceURL=webpack:///./backend/app/src/keyboard/process-unicode-text.ts?");

/***/ }),

/***/ "./backend/app/src/keyboard/tlit-to-unicode-map.ts":
/*!*********************************************************!*\
  !*** ./backend/app/src/keyboard/tlit-to-unicode-map.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.numeric = exports.sequence = exports.map = void 0;\r\nexports.map = {\r\n    ',': 0x060c,\r\n    ';': 0x061b,\r\n    '?': 0x061f,\r\n    '2': 0x0621,\r\n    'A~': 0x0622,\r\n    '2a': 0x0623,\r\n    '2u': 0x0623,\r\n    '2o': 0x0623,\r\n    '2A': 0x0623,\r\n    '2U': 0x0624,\r\n    '2i': 0x0625,\r\n    '2e': 0x0625,\r\n    '2Y': 0x0626,\r\n    'A': 0x0627,\r\n    'i*': 0x0627,\r\n    'u*': 0x0627,\r\n    'e*': 0x0627,\r\n    'o*': 0x0627,\r\n    'b': 0x0628,\r\n    'h*': 0x0629,\r\n    'T*': 0x0629,\r\n    't': 0x062a,\r\n    't*': 0x062b,\r\n    'j': 0x062c,\r\n    'g': 0x062c,\r\n    'H': 0x062d,\r\n    'X': 0x062e,\r\n    'd': 0x062f,\r\n    'd*': 0x0630,\r\n    'z*': 0x0630,\r\n    'r': 0x0631,\r\n    'z': 0x0632,\r\n    's': 0x0633,\r\n    's*': 0x0634,\r\n    'S': 0x0635,\r\n    'D': 0x0636,\r\n    'T': 0x0637,\r\n    'Z': 0x0638,\r\n    '3': 0x0639,\r\n    'R': 0x063a,\r\n    '_': 0x0640,\r\n    'f': 0x0641,\r\n    'q': 0x0642,\r\n    'k': 0x0643,\r\n    'l': 0x0644,\r\n    'm': 0x0645,\r\n    'n': 0x0646,\r\n    'h': 0x0647,\r\n    'U': 0x0648,\r\n    'w': 0x0648,\r\n    'O': 0x0648,\r\n    'A*': 0x0649,\r\n    'Y': 0x064a,\r\n    'y': 0x064a,\r\n    'E': 0x064a,\r\n    'aN': 0x064b,\r\n    'uN': 0x064c,\r\n    'iN': 0x064d,\r\n    'a': 0x064e,\r\n    'u': 0x064f,\r\n    'o': 0x064f,\r\n    'i': 0x0650,\r\n    'e': 0x0650,\r\n    '+': 0x0651,\r\n    '0': 0x0652,\r\n    '1*': 0x0656,\r\n    '%': 0x066a,\r\n    '1': 0x0670,\r\n    '1~': 0x0671,\r\n    'p': 0x067e,\r\n    'J': 0x0686,\r\n    'V': 0x06a2,\r\n    'v': 0x06a4,\r\n    'G': 0x06a8,\r\n    'K': 0x06ad,\r\n    '._': 0x06d4\r\n};\r\nexports.sequence = {\r\n    'AN': [0x0627, 0x064b],\r\n    '20': [0x0623, 0x0652]\r\n};\r\nexports.numeric = {\r\n    '/': 0x060d,\r\n    '0': 0x0660,\r\n    '1': 0x0661,\r\n    '2': 0x0662,\r\n    '3': 0x0663,\r\n    '4': 0x0664,\r\n    '5': 0x0665,\r\n    '6': 0x0666,\r\n    '7': 0x0667,\r\n    '8': 0x0668,\r\n    '9': 0x0669,\r\n    '%': 0x066a,\r\n    '.': 0x066b,\r\n    ',': 0x066c,\r\n    '*': 0x066d\r\n};\r\n\n\n//# sourceURL=webpack:///./backend/app/src/keyboard/tlit-to-unicode-map.ts?");

/***/ }),

/***/ "./backend/app/src/keyboard/unicode-to-tlit-map.ts":
/*!*********************************************************!*\
  !*** ./backend/app/src/keyboard/unicode-to-tlit-map.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.map = void 0;\r\nexports.map = {\r\n    0x060c: ',',\r\n    0x061b: ';',\r\n    0x061f: '?',\r\n    0x0621: '2',\r\n    0x0622: 'A~',\r\n    0x0623: '2A',\r\n    0x0624: '2U',\r\n    0x0625: '2i',\r\n    0x0626: '2Y',\r\n    0x0627: 'A',\r\n    0x0628: 'b',\r\n    0x0629: 'h*',\r\n    0x062a: 't',\r\n    0x062b: 't*',\r\n    0x062c: 'j',\r\n    0x062d: 'H',\r\n    0x062e: 'X',\r\n    0x062f: 'd',\r\n    0x0630: 'd*',\r\n    0x0631: 'r',\r\n    0x0632: 'z',\r\n    0x0633: 's',\r\n    0x0634: 's*',\r\n    0x0635: 'S',\r\n    0x0636: 'D',\r\n    0x0637: 'T',\r\n    0x0638: 'Z',\r\n    0x0639: '3',\r\n    0x063a: 'R',\r\n    0x0640: '_',\r\n    0x0641: 'f',\r\n    0x0642: 'q',\r\n    0x0643: 'k',\r\n    0x0644: 'l',\r\n    0x0645: 'm',\r\n    0x0646: 'n',\r\n    0x0647: 'h',\r\n    0x0648: 'U',\r\n    0x0649: 'A*',\r\n    0x064a: 'Y',\r\n    0x064b: 'aN',\r\n    0x064c: 'uN',\r\n    0x064d: 'iN',\r\n    0x064e: 'a',\r\n    0x064f: 'u',\r\n    0x0650: 'i',\r\n    0x0651: '+',\r\n    0x0652: '0',\r\n    0x0656: '1*',\r\n    0x060d: '/',\r\n    0x0660: '0',\r\n    0x0661: '1',\r\n    0x0662: '2',\r\n    0x0663: '3',\r\n    0x0664: '4',\r\n    0x0665: '5',\r\n    0x0666: '6',\r\n    0x0667: '7',\r\n    0x0668: '8',\r\n    0x0669: '9',\r\n    0x066a: '%',\r\n    0x066b: '.',\r\n    0x066c: ',',\r\n    0x066d: '*',\r\n    0x0670: '1',\r\n    0x0671: '1~',\r\n    0x067e: 'p',\r\n    0x0686: 'J',\r\n    0x06a2: 'V',\r\n    0x06a4: 'v',\r\n    0x06a8: 'G',\r\n    0x06ad: 'K',\r\n    0x06d4: '._'\r\n};\r\n\n\n//# sourceURL=webpack:///./backend/app/src/keyboard/unicode-to-tlit-map.ts?");

/***/ }),

/***/ "./backend/app/src/keyboard/web-index.ts":
/*!***********************************************!*\
  !*** ./backend/app/src/keyboard/web-index.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst process_tlit_text_1 = __webpack_require__(/*! ./process-tlit-text */ \"./backend/app/src/keyboard/process-tlit-text.ts\");\r\nconst process_unicode_text_1 = __webpack_require__(/*! ./process-unicode-text */ \"./backend/app/src/keyboard/process-unicode-text.ts\");\r\nconst inEl = document.querySelector('#in');\r\nconst outEl = document.querySelector('#out');\r\nconst isTransEl = document.querySelector('#is-trans');\r\nconst isUniEl = document.querySelector('#is-uni');\r\nconst fontPlusEl = document.querySelector('#font-plus');\r\nconst fontMinusEl = document.querySelector('#font-minus');\r\nconst loadSampleEl = document.querySelector('#load-sample');\r\nconst tashkilEl = document.querySelector('#tashkil');\r\nconst ltrEl = document.querySelector('#ltr');\r\nconst copyTransEl = document.querySelector('#copy-trans');\r\nconst copyArabEl = document.querySelector('#copy-arabic');\r\nconst wiktionaryEl = document.querySelector('#wiktionary');\r\nconst gtranslateEl = document.querySelector('#gtranslate');\r\nlet prev = '';\r\nlet fontSize = 160;\r\nlet skipNextFocusEvent = false;\r\nfunction sourceChange() {\r\n    prev = '';\r\n    tlitChange();\r\n    arabicChange();\r\n}\r\nfunction tlitChange() {\r\n    if (!isTransEl.checked)\r\n        return;\r\n    const text = inEl.value;\r\n    if (text === prev)\r\n        return;\r\n    outEl.value = process_tlit_text_1.processTrans(text, tashkilEl.checked);\r\n    if (prev && text.startsWith(prev))\r\n        outEl.scrollTop = outEl.scrollHeight;\r\n    prev = text;\r\n}\r\nfunction arabicChange() {\r\n    if (isTransEl.checked)\r\n        return;\r\n    const text = outEl.value;\r\n    if (text === prev)\r\n        return;\r\n    inEl.value = process_unicode_text_1.processUnicode(text);\r\n    if (prev && text.startsWith(prev))\r\n        inEl.scrollTop = inEl.scrollHeight;\r\n    prev = text;\r\n}\r\nfunction pageActivated() {\r\n    skipNextFocusEvent = true;\r\n}\r\nfunction selectAllOnFocus(el) {\r\n    if (!skipNextFocusEvent)\r\n        el.select();\r\n    skipNextFocusEvent = false;\r\n}\r\nfunction adjustFontSize(delta) {\r\n    fontSize += delta;\r\n    outEl.style.fontSize = fontSize + '%';\r\n}\r\nfunction loadSample() {\r\n    inEl.value = `namuUd*aj: Al-byt bay0taNA bay0tAN li-l-2iYjAr s*ad+ah* uk0tub0 u*k0tu____b0 maA2Yidah* h1d*A 3am+^aAn 3o^maAn [1,234.56]\r\n}Click on \"Show tashkil\" and see differences. Embed: {kalimaT*uN} = word\r\n}Such mixed content is best viewed with \"Left-to-right\" on.`;\r\n    inEl.style.height = '6em';\r\n    outEl.className = '';\r\n    outEl.style.height = '6em';\r\n    isTransEl.checked = true;\r\n    tashkilEl.checked = false;\r\n    ltrEl.checked = true;\r\n    fontSize = 110;\r\n    outEl.style.fontSize = fontSize + '%';\r\n    prev = '';\r\n    tlitChange();\r\n}\r\nfunction tashkilClick() {\r\n    prev = '';\r\n    tlitChange();\r\n}\r\nfunction ltrClick() {\r\n    outEl.className = ltrEl.checked ? '' : 'rtl';\r\n}\r\nfunction copy(textEl) {\r\n    textEl.select();\r\n    document.execCommand('copy');\r\n}\r\nfunction wiktionaryClick() {\r\n    window.open('https://en.wiktionary.org/wiki/' + encodeURIComponent(outEl.value), '_blank').focus();\r\n}\r\nfunction gtranslateClick() {\r\n    window.open('https://translate.google.com/?sl=ar&tl=en&op=translate&text=' + encodeURIComponent(outEl.value), '_blank').focus();\r\n}\r\nisTransEl.onclick = sourceChange;\r\nisUniEl.onclick = sourceChange;\r\ninEl.onkeyup = tlitChange;\r\ninEl.onfocus = () => selectAllOnFocus(inEl);\r\noutEl.onkeyup = arabicChange;\r\noutEl.onfocus = () => selectAllOnFocus(outEl);\r\nfontPlusEl.onclick = () => adjustFontSize(20);\r\nfontMinusEl.onclick = () => adjustFontSize(-20);\r\nloadSampleEl.onclick = loadSample;\r\ntashkilEl.onclick = tashkilClick;\r\nltrEl.onclick = ltrClick;\r\ncopyTransEl.onclick = () => copy(inEl);\r\ncopyArabEl.onclick = () => copy(outEl);\r\nwiktionaryEl.onclick = wiktionaryClick;\r\ngtranslateEl.onclick = gtranslateClick;\r\nwindow.onfocus = pageActivated;\r\n\n\n//# sourceURL=webpack:///./backend/app/src/keyboard/web-index.ts?");

/***/ })

/******/ });