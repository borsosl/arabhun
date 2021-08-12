import {processLine} from '../process-tlit-text';
import {processLine as processUniLine} from '../process-unicode-text';

const reversibleSequences: string[][] = [
    ['A b p t t* j C H X d d* r z J s s* S D T Z 3 R f q k K g l m n h w y Y* A*',
        'ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ك ک گ ل م ن ه و ي ی ى',
        'ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ك ک گ ل م ن ه و ي ی ى'],
    ['Q G* v V', 'ڨ ڭ ڤ ڢ', 'ڨ ڭ ڤ ڢ'],
    ['ya30rifu', 'يَعْرِفُ', 'يعرف'],
    ['s*ad+@', 'شَدَّة', 'شدة'],
    ['bay0tuN bay0taNA bay0tAN bay0tiN', 'بَيْتٌ بَيْتًا بَيْتاً بَيْتٍ', 'بيت بيتا بيتا بيت'],
    ['2akala\t2Akl', 'أَكَلَ\tأكل', 'أكل\tأكل'],
    ['2iDaAf@', 'إِضَافَة', 'إضافة'],
    ['2ukal+imu', 'أُكَلِّمُ', 'أكلم'],
    ['maA2Yid@', 'مَائِدَة', 'مائدة'],
    ['s*a20n s*u2UuUn', 'شَأْن شُؤُون', 'شأن شؤون'],
    ['A~kulu', 'آكُلُ', 'آكل'],
    ['masaA2', 'مَسَاء', 'مساء'],
    ['masaA2-iY', 'مَسَاءِي', 'مساءي'],
    ['2i*', 'إ', 'إ'],
    ['1~l02iXaA2-i', 'ٱلْإِخَاءِ', 'الإخاء'],
    ['A} abc {t.', 'ا abc ت.'],
    ['A% [1,234.56%] b [1 2]', 'ا٪ ١٬٢٣٤٫٥٦٪ ب ١ ٢']
];

describe('Transliteration to Unicode', () => {

    const irreversibleSequences: string[][] = [
        ['G z* U/w/O Y/y/E', 'ج ذ و/و/و ي/ي/ي', 'ج ذ و/و/و ي/ي/ي'],
        ['2i*DAf@*', 'إضافة', 'إضافة'],
        ['2u*klm', 'أكلم', 'أكلم'],
        ['telefiz0yoOn', 'تِلِفِزْيُون', 'تلفزيون'],
        ['ij0lis0 uk0tub0', 'اِجْلِسْ اُكْتُبْ', 'اجلس اكتب'],
        ['i*jls u*ktb', 'اجلس اكتب', 'اجلس اكتب']
    ];

    describe('should process reversible samples', function() {
        testSampleSet(reversibleSequences);
    });

    describe('should process irreversible samples', function() {
        testSampleSet(irreversibleSequences);
    });

    function testSampleSet(sequences: string[][]) {
        it('with tashkil', () => {
            for(const pair of sequences) {
                expect(processLine(pair[0])).toBe(pair[1]);
            }
        });

        it('without tashkil', () => {
            for(const pair of sequences) {
                if(pair[2])
                    expect(processLine(pair[0], false)).toBe(pair[2]);
            }
        });
    }
});

describe('Unicode to Transliteration', () => {
    it('should reverse transliterate samples', () => {
        for(const pair of reversibleSequences) {
            expect(processUniLine(pair[1])).toBe(pair[0]);
        }
    });
});
