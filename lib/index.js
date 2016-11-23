'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var superagent = require('superagent');
var UhuraError = require('./UhuraError');
var constants = require('./constants');

function checksForErrors(err, res) {
  // eslint-disable-line
  if (err && (err.status || err.timeout)) {
    return err;
  }

  if (res && res.body && res.body.Fault) {
    return new UhuraError(res.body.Fault);
  }

  return null;
}

var UhuraRequest = function (_superagent$Request) {
  _inherits(UhuraRequest, _superagent$Request);

  function UhuraRequest() {
    _classCallCheck(this, UhuraRequest);

    return _possibleConstructorReturn(this, (UhuraRequest.__proto__ || Object.getPrototypeOf(UhuraRequest)).apply(this, arguments));
  }

  _createClass(UhuraRequest, [{
    key: 'end',
    value: function end(cb) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _get(UhuraRequest.prototype.__proto__ || Object.getPrototypeOf(UhuraRequest.prototype), 'end', _this2).call(_this2, function (err, res) {
          if (cb) {
            cb(err, res);
          }

          var error = checksForErrors(err, res);
          if (error) {
            return reject(error);
          }
          return resolve(res.body);
        });
      });
    }
  }]);

  return UhuraRequest;
}(superagent.Request);

function getUhura(constApiPath, constHeaders) {
  var defaultHeaders = constHeaders || null;
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

    var request = new (Function.prototype.bind.apply(UhuraRequest, [null].concat([method, url], args)))();

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