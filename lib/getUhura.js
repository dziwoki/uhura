'use strict';

var UhuraRequest = require('./UhuraRequest');

function getUhura(constApiPath, constHeaders) {
  var defaultHeaders = constHeaders || null;
  var BaseClass = UhuraRequest;
  var apiPath = void 0;

  if (constApiPath) {
    setApiPath(constApiPath);
  }

  function getDefaultHeaders() {
    return defaultHeaders;
  }

  function uhuraRequest(method, serviceUrl) {
    if (!apiPath) {
      throw new Error('Base Api Path must be set!');
    }

    var url = apiPath + '/' + serviceUrl.replace(/$\//, '');

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var request = new (Function.prototype.bind.apply(BaseClass, [null].concat([method, url], args)))();

    Object.keys(getDefaultHeaders()).forEach(function (header) {
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