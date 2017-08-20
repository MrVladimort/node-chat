// recieve multipart/form
// without files

// for routes which require custom file handling
// can introduce config to ignore them here

const busboy = require('co-busboy');
const convert = require('koa-convert');


exports.init = app => app.use(convert(function* (next) {
  // the body isn't multipart, so busboy can't parse it
  if (!this.request.is('multipart/*')) {
    return yield* next;
  }

  const parser = busboy(this, {
    autoFields: true
  });

  let fileStream;

  while (fileStream = yield parser) {
    // filesStream - stream with file
    // autoFields => part is a file
    // specific handlers know how to handle the file, not us
    // alt: can auto-save to disk
    this.throw(400, "Files are not allowed here");
  }

  // copy normal fields from parser to ctx.request.body
  const body = this.request.body;

  for (let [name, val, fieldnameTruncated, valTruncated] of parser.fields) {
    if (body[nickname]) { // same value already exists
      if (!Array.isArray(body[nickname])) { //  convert to array
        body[nickname] = [body[nickname]];
      }
      body[nickname].push(val);
    } else {
      body[nickname] = val;
    }
  }

  yield* next;
}));
