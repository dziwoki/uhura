'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var superagent = require('superagent');
var UhuraError = require('./UhuraError');

function checksForErrors(err, res, url) {
  // eslint-disable-line
  if (err && (err.status || err.timeout)) {
    return err;
  }

  if (res && res.body && res.body.Fault) {
    return new UhuraError(url, res.body.Fault);
  }

  return err;
}

var UhuraRequest = function (_superagent$Request) {
  _inherits(UhuraRequest, _superagent$Request);

  function UhuraRequest() {
    _classCallCheck(this, UhuraRequest);

    return _possibleConstructorReturn(this, (UhuraRequest.__proto__ || Object.getPrototypeOf(UhuraRequest)).apply(this, arguments));
  }

  _createClass(UhuraRequest, [{
    key: 'wrapRequestErrors',
    value: function wrapRequestErrors(err, res) {
      return checksForErrors(err, res, this.url);
    }
  }, {
    key: 'end',
    value: function end(cb) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _get(UhuraRequest.prototype.__proto__ || Object.getPrototypeOf(UhuraRequest.prototype), 'end', _this2).call(_this2, function (err, res) {
          if (cb) {
            cb(err, res);
          }

          var error = _this2.wrapRequestErrors(err, res);
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

module.exports = UhuraRequest;