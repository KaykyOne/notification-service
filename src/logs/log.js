import pino from 'pino';

const log = pino({
    transport:{
        target: 'pino/file',
        options:{
            destination: './app.log'
        }
    }
});

const error = pino({
    transport:{
        target: 'pino/file',
        options:{
            destination: './error.log'
        }
    }
});

export { log, error };

