const path = require('path');

module.exports = {
    mode: 'development',
    entry: './backend/app/src/tlit/web-index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'web')
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    onlyCompileBundledFiles: true
                }
            }
        ]
    }
};
