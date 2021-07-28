
import * as cli from 'command-line-args';
import * as fs from "fs";
import {processTrans} from './process-tlit-text';
import {processUnicode} from './process-unicode-text';

interface Options {
    reverse: boolean,
    tashkil: boolean;
    input: string
}

const opt: Options = cli([
    { name: 'reverse', alias: 'r', type: Boolean },
    { name: 'tashkil', alias: 't', type: Boolean },
    { name: 'input', type: String, defaultOption: true }
]) as Options;

const txt = fs.readFileSync(opt.input).toString();
process.stdout.write(Buffer.from(
    opt.reverse ? processUnicode(txt) : processTrans(txt, opt.tashkil)));
