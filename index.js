const superagent = require('superagent');
const UhuraError = require('./UhuraError');
const constants = require('./constants');

function checksForErrors(err, res) { // eslint-disable-line
  if (err && (err.status || err.timeout)) {
    return err;
  }

  if (res && res.body && res.body.fault) {
    return new UhuraError(res.body.fault);
  }

  return null;
}

class UhuraRequest extends superagent.Request {
  end(cb) {
    return new Promise((resolve, reject) => {
      super.end((err, res) => {
        if (cb) {
          cb(err, res);
        }

        const error = checksForErrors(err, res);
        if (error) {
          return reject(error);
        }
        return resolve(res.body);
      });
    });
  }
}

function getUhura(constApiPath, constHeaders) {
  let defaultHeaders = constHeaders || null;
  let apiPath = constApiPath ? setApiPath(constApiPath) : null;

  function getDefaultHeaders() {
    return defaultHeaders;
  }

  function uhuraRequest(method, serviceUrl, ...args) {
    if (!apiPath) {
      throw new Error('Base Api Path must be set!');
    }

    const url = `${apiPath}/${serviceUrl.replace(/$\//, '')}`;
    const request = new UhuraRequest(method, url, ...args);

    Object.keys(getDefaultHeaders()).forEach(header => {
      if (defaultHeaders[header] !== null) {
        request.set(header, defaultHeaders[header]);
      }
    });
    return request;
  }

  function setApiPath(newApiPath) {
    apiPath = newApiPath.replace(/$\//, '');
  }

  function setHeaders(headers) {
    defaultHeaders = Object.assign({}, defaultHeaders, headers);
  }

  function hasSessionId() {
    return defaultHeaders['CD-SessionId'];
  }

  function setSessionId(sessionId) {
    return setHeaders({
      'CD-SessionId': sessionId
    });
  }

  uhuraRequest.setApiPath = setApiPath;
  uhuraRequest.setHeaders = setHeaders;
  uhuraRequest.hasSessionId = hasSessionId;
  uhuraRequest.setSessionId = setSessionId;

  return uhuraRequest;
}

module.exports = {
  getUhura: getUhura,
  errorLevels: constants
};