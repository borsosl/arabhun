import * as path from 'path';
import * as log from 'loglevel';
import express = require('express');
import logger = require('morgan');

export function startServer() {
    const app = express();

    app.use(logger('tiny'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(express.static(path.join(__dirname, '../../public'), {
        index: 'index.html'
    }));
    app.set('trust proxy', true);

    const port = process.env.PORT || 8080;
    app.listen(port, function() {
        log.info(`app started on port ${port}`);
    });
}
