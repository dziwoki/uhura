'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var constants = require('./constants');

function getErrorSeverity(level) {
  return constants['ERROR_LEVEL_' + level];
}

var UhuraError = function (_Error) {
  _inherits(UhuraError, _Error);

  function UhuraError(uhuraFault) {
    _classCallCheck(this, UhuraError);

    var message = 'UHURA returned Error with code: "' + uhuraFault.Code + '"; message: "' + uhuraFault.Message + '"';

    var _this = _possibleConstructorReturn(this, (UhuraError.__proto__ || Object.getPrototypeOf(UhuraError)).call(this, message));

    _this.code = uhuraFault.Code;
    _this.externalCode = uhuraFault.ExternalCode;
    _this.originalMessage = uhuraFault.Message;
    _this.severity = getErrorSeverity(uhuraFault.Severity);
    return _this;
  }

  return UhuraError;
}(Error);

module.exports = UhuraError;