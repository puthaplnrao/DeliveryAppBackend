// utils/sendResponse.js
const sendResponse = (
  res,
  { status = 200, codeObj, data = null, error = null }
) => {
  let response = null;
  if (codeObj.token !== null) {
    response = {
      code: codeObj.code,
      message: codeObj.message,
      description: codeObj.description,
      token: codeObj.token,
    };
  } else {
    response = {
      code: codeObj.code,
      message: codeObj.message,
      description: codeObj.description,
    };
  }

  if (data !== null) response.data = data;
  if (error !== null) response.error = error;

  return res.status(status).json(response);
};

module.exports = sendResponse;
