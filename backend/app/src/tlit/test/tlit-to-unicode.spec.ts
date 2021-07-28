import {processLine} from '../process-tlit-text';
import {processLine as processUniLine} from '../process-unicode-text';

const reversibleSequences: string[][] = [
    ['A b t t* j H X d d* r z s s* S D T Z 3 R f q k l m n h w y',
        'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي',
        'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'],
    ['ya30rifu', 'يَعْرِفُ', 'يعرف'],
    ['s*ad+ah*', 'شَدَّة', 'شدة'],
    ['bay0tuN bay0taNA bay0tAN bay0tiN', 'بَيْتٌ بَيْتًا بَيْتاً بَيْتٍ', 'بيت بيتا بيتا بيت'],
    ['2akala\t2Akl', 'أَكَلَ\tأكل', 'أكل\tأكل'],
    ['2iDaAfah* 2i*DAfh*', 'إِضَافَة إضافة', 'إضافة إضافة'],
    ['2ukal+imu', 'أُكَلِّمُ', 'أكلم'],
    ['maA2Yidah*', 'مَائِدَة', 'مائدة'],
    ['s*a20n s*u2UuUn', 'شَأْن شُؤُون', 'شأن شؤون'],
    ['A~kulu', 'آكُلُ', 'آكل'],
    ['masaA2', 'مَسَاء', 'مساء'],
    ['masaA2-iY', 'مَسَاءِي', 'مساءي'],
    ['2i*', 'إ', 'إ'],
    ['A} abc {t', 'ا abc ت'],
    ['A% [1,234.56%] b [1 2]', 'ا٪ ١٬٢٣٤٫٥٦٪ ب ١ ٢']
];

describe('Transliteration to Unicode', () => {

    const irreversibleSequences: string[][] = [
        ['g z* U/w/O Y/y/E', 'ج ذ و/و/و ي/ي/ي', 'ج ذ و/و/و ي/ي/ي'],
        ['2u*klm', 'أكلم', 'أكلم'],
        ['telefiz0yoOn', 'تِلِفِزْيُون', 'تلفزيون'],
        ['ij0lis0 uk0tub0', 'اِجْلِسْ اُكْتُبْ', 'اجلس اكتب'],
        ['i*jls u*ktb', 'اجلس اكتب', 'اجلس اكتب']
    ];

    it('should transliterate samples', () => {
        for(const pair of reversibleSequences) {
            expect(processLine(pair[0])).toBe(pair[1]);
            if(pair[2])
                expect(processLine(pair[0], false)).toBe(pair[2]);
        }
        for(const pair of irreversibleSequences) {
            expect(processLine(pair[0])).toBe(pair[1]);
            if(pair[2])
                expect(processLine(pair[0], false)).toBe(pair[2]);
        }
    });
});

describe('Unicode to Transliteration', () => {
    it('should reverse transliterate samples', () => {
        for(const pair of reversibleSequences) {
            expect(processUniLine(pair[1])).toBe(pair[0]);
        }
    });
});
