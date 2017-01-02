const superagent = require('superagent');
const UhuraError = require('./UhuraError');

function checksForErrors(err, res, url) { // eslint-disable-line
  if (err && (err.status || err.timeout)) {
    return err;
  }

  if (res && res.body && res.body.Fault) {
    return new UhuraError(url, res.body.Fault);
  }

  return err;
}

class UhuraRequest extends superagent.Request {
  wrapRequestErrors(err, res) {
    return checksForErrors(err, res, this.url);
  }

  end(cb) {
    return new Promise((resolve, reject) => {
      super.end((err, res) => {
        if (cb) {
          cb(err, res);
        }

        const error = this.wrapRequestErrors(err, res);
        if (error) {
          return reject(error);
        }
        return resolve(res.body);
      });
    });
  }
}

module.exports = UhuraRequest;