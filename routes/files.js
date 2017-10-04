const fs = require('fs');
const config = require('config');
const mime = require('mime');
const path = require('path');

exports.frontPage = async function (ctx, next) {
    ctx.body = 'Files';
};

exports.get = async function (ctx, next) {
    let filepath = path.join(__dirname, '../public/files', ctx.params.path);
    console.log('get file ', filepath);

    let fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream
        .on('error', err => {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                console.error(err);
                if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end('Internal error');
                } else {
                    res.end();
                }

            }
        })
        .on('open', () => {
            res.setHeader('Content-Type', mime.lookup(filepath));
        });

    res
        .on('close', () => {
            fileStream.destroy();
        });

};

exports.post = async function (ctx, next) {
    let filepath = path.join(__dirname, '../public/files', ctx.params.path);
    console.log('upload ', filepath);

    let size = 0;

    let writeStream = new fs.WriteStream(filepath, {flags: 'wx'});

    ctx.req
        .on('data', chunk => {
            size += chunk.length;
            console.log(size, ' < ', config.limitFileSize);
            if (size > config.limitFileSize) {
                // early connection close before recieving the full request

                ctx.res.statusCode = 413;

                // if we just res.end w/o connection close, browser may keep on sending the file
                // the connection will be kept alive, and the browser will hang (trying to send more data)
                // this header tells node to close the connection
                // also see http://stackoverflow.com/questions/18367824/how-to-cancel-http-upload-from-data-events/18370751#18370751

                // ctx.res.setHeader('Connection', 'close');

                writeStream.destroy();

                fs.unlink(filepath, err => { // eslint-disable-line
                    // ignore error

                    // Some browsers will handle this as 'CONNECTION RESET' error
                    ctx.res.end('File is too big!');
                });
            }
        })
        .on('close', () => {
            writeStream.destroy();
            fs.unlink(filepath, err => { // eslint-disable-line
                /* ignore error */
            });
        })
        .pipe(writeStream);

    writeStream
        .on('error', err => {
            if (err.code === 'EEXIST') {
                ctx.res.statusCode = 409;
                ctx.res.end('File exists');
            } else {
                console.error(err);
                if (!ctx.res.headersSent) {
                    ctx.res.writeHead(500, {'Connection': 'close'});
                    ctx.res.end('Internal error');
                } else {
                    ctx.res.end();
                }
                fs.unlink(filepath, err => { // eslint-disable-line
                    /* ignore error */
                });
            }
            ctx.res.destroy();
        })
        .on('close', () => {
            // Note: can't use on('finish')
            // finish = data flushed, for zero files happens immediately,
            // even before 'file exists' check

            // for zero files the event sequence may be:
            //   finish -> error

            // we must use 'close' event to track if the file has really been written down
            ctx.res.end('OK');
        });
};

exports.delete = async function (ctx, next) {
    let filepath = path.join(__dirname, '../public/files', ctx.params.path);
    console.log('delete ', filepath);
};
