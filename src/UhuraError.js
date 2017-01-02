const constants = require('./constants');

function getErrorSeverity(level) {
  return constants[`ERROR_LEVEL_${level}`];
}

class UhuraError extends Error {
  constructor(url, uhuraFault) {
    const message = `UHURA request for: ${url} returned an Error with code: "${uhuraFault.Code}"; message: "${uhuraFault.Message}"`;
    super(message);

    this.code = uhuraFault.Code;
    this.externalCode = uhuraFault.ExternalCode;
    this.originalMessage = uhuraFault.Message;
    this.severity = getErrorSeverity(uhuraFault.Severity);
  }
}

module.exports = UhuraError;