const UhuraRequest = require('./UhuraRequest');

function getUhura(constApiPath, constHeaders) {
  let defaultHeaders = constHeaders || null;
  let BaseClass = UhuraRequest;
  let apiPath;

  if (constApiPath) {
    setApiPath(constApiPath);
  }

  function getDefaultHeaders() {
    return defaultHeaders;
  }

  function uhuraRequest(method, serviceUrl, ...args) {
    if (!apiPath) {
      throw new Error('Base Api Path must be set!');
    }

    const url = `${apiPath}/${serviceUrl.replace(/$\//, '')}`;
    const request = new BaseClass(method, url, ...args);

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
    return !!defaultHeaders['CD-SessionId'];
  }

  function getSessionId() {
    return defaultHeaders['CD-SessionId'];
  }

  function setSessionId(sessionId) {
    return setHeaders({
      'CD-SessionId': sessionId
    });
  }

  function setBaseClass(NewBaseClass) {
    BaseClass = NewBaseClass;
  }

  uhuraRequest.setApiPath = setApiPath;
  uhuraRequest.setHeaders = setHeaders;
  uhuraRequest.hasSessionId = hasSessionId;
  uhuraRequest.getSessionId = getSessionId;
  uhuraRequest.setSessionId = setSessionId;
  uhuraRequest.setBaseClass = setBaseClass;

  return uhuraRequest;
}

module.exports = getUhura;
