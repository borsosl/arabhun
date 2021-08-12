
export type SequenceArray =  [key: string, value: number | number[], noTashkilValue?: number][];

export type TransMapEntry = number | number[] | SequenceArray;

export const map: {[key: string]: TransMapEntry} = {
    ',': 0x060c,
    ';': 0x061b,
    '?': 0x061f,
    'A': [
        ['A*', 0x0649],
        ['A~', 0x0622],
        ['AN', [0x0627, -0x064b]],
        ['A', 0x0627],
    ],
    '2': [
        ['2u*', 0x0623],
        ['2o*', 0x0623],
        ['2i*', 0x0625],
        ['2e*', 0x0625],
        ['2a', [0x0623, -0x064e]],
        ['2u', [0x0623, -0x064f]],
        ['2o', [0x0623, -0x064f]],
        ['2A', 0x0623],
        ['2U', 0x0624],
        ['2i', [0x0625, -0x0650]],
        ['2e', [0x0625, -0x0650]],
        ['2Y', 0x0626],
        ['20', [0x0623, -0x0652]],
        ['2', 0x0621]
    ],
    'i': [
        ['i*', 0x0627],
        ['iN', -0x064d],
        ['i', -0x0650]
    ],
    'e': [
        ['e*', 0x0627],
        ['e', -0x0650]
    ],
    'u': [
        ['u*', 0x0627],
        ['uN', -0x064c],
        ['u', -0x064f]
    ],
    'o': [
        ['o*', 0x0627],
        ['o', -0x064f]
    ],
    'b': 0x0628,
    '@': [
        ['@*t', 0x0629],
        ['@t', [-0x064e, 0x0629]],
        ['@*', 0x0629],
        ['@', [-0x064e, 0x0629]]
    ],
    't': [
        ['t*', 0x062b],
        ['t', 0x062a]
    ],
    'j': 0x062c,
    'G': [
        ['G*', 0x06ad],
        ['G', 0x062c]
    ],
    'H': 0x062d,
    'X': 0x062e,
    'd': [
        ['d*', 0x0630],
        ['d', 0x062f]
    ],
    'z': [
        ['z*', 0x0630],
        ['z', 0x0632]
    ],
    'r': 0x0631,
    'J': 0x0698,
    's': [
        ['s*', 0x0634],
        ['s', 0x0633]
    ],
    'S': 0x0635,
    'D': 0x0636,
    'T': 0x0637,
    'Z': 0x0638,
    '3': 0x0639,
    'R': 0x063a,
    '_': 0x0640,
    'f': 0x0641,
    'q': 0x0642,
    'k': 0x0643,
    'K': 0x06a9,
    'g': 0x06af,
    'l': 0x0644,
    'm': 0x0645,
    'n': 0x0646,
    'h': 0x0647,
    'U': 0x0648,
    'w': 0x0648,
    'O': 0x0648,
    'Y': [
        ['Y*', 0x06cc],
        ['Y', 0x064a]
    ],
    'y': [
        ['y*', 0x06cc],
        ['y', 0x064a]
    ],
    'E': [
        ['E*', 0x06cc],
        ['E', 0x064a]
    ],
    'a': [
        ['aN', -0x064b],
        ['a', -0x064e]
    ],
    '+': [
        ['+', -0x0651]
    ],
    '0': [
        ['0', -0x0652]
    ],
    '1': [
        ['1*', -0x0656],
        ['1~', -0x0671, 0x0627],
        ['1', -0x0670]
    ],
    '%': 0x066a,
    'p': 0x067e,
    'C': 0x0686,
    'V': 0x06a2,
    'v': 0x06a4,
    'Q': 0x06a8,
    '.': [
        ['._', 0x06d4]
    ]
};

export const numeric: {[key: string]: number} = {
    '/': 0x060d,
    '0': 0x0660,
    '1': 0x0661,
    '2': 0x0662,
    '3': 0x0663,
    '4': 0x0664,
    '5': 0x0665,
    '6': 0x0666,
    '7': 0x0667,
    '8': 0x0668,
    '9': 0x0669,
    '%': 0x066a,
    '.': 0x066b,
    ',': 0x066c,
    '*': 0x066d
};
