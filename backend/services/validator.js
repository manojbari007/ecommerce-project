const { validationResult } = require("express-validator");

/**
 * This function is use for prepare response
 *
 * @param {Number} status - status
 * @param {String} message - message
 * @param {any} data - data
 * @returns {any} - response
 */
function prepareResponse(status, message, data) {
  if (data != null || data != undefined) {
    return {
      responseCode: status,
      responseMessage: message,
      responseData: data,
    };
  }
  return {
    responseCode: status,
    responseMessage: message,
  };
}

/**
 * This function is use for check validators error
 *
 * @param {any} req - req
 * @param {any} res - res
 * @returns {Boolean} - response
 */
function hasValidatorErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array()[0];
    res.status(400).json(prepareResponse(2000, err.msg, null));
    return true;
  } else {
    return false;
  }
}

/**
 * This function is use for prepare send response
 *
 * @param {any} res - res
 * @param {number} status - status
 * @param {number} code - code
 * @param {string} message - message
 * @param {object} payload - payload
 * @returns
 */
function sendResponse(res, status, code, message, payload) {
  return res.status(status).send(prepareResponse(code, message, payload));
}

module.exports = {
  hasValidatorErrors: hasValidatorErrors,
  sendResponse: sendResponse,
  prepareResponse: prepareResponse,
};
