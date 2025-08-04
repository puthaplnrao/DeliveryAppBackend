const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("../utils/encryptor");
const Client = require("../models/Client");
const Token = require("../models/Token");

const {
  generateSecureToken,
  verifyToken,
} = require("../utils/generateSecureToken");
const sendResponse = require("../utils/sendResponse");
const errorCodes = require("../constants/errorCodes");

exports.register = async (req, res) => {
  try {
    const decryptedData = decrypt(req.headers, req.body.data);
    const { companyname, firstname, lastname, email, password, mobile } =
      JSON.parse(decryptedData);

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !companyname ||
      !mobile
    ) {
      return sendResponse(res, {
        status: 400,
        codeObj: {
          code: errorCodes.REGISTRATION_BAD_REQUEST.code,
          message: errorCodes.REGISTRATION_BAD_REQUEST.message,
          description: errorCodes.REGISTRATION_BAD_REQUEST.description,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      companyname,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      mobile,
    });

    await user.save();
    return sendResponse(res, {
      status: 201,
      codeObj: {
        code: errorCodes.REGISTRATION_SUCCESS.code,
        message: errorCodes.REGISTRATION_SUCCESS.message,
        description: errorCodes.REGISTRATION_SUCCESS.description,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return sendResponse(res, {
        status: 400,
        codeObj: {
          code: errorCodes.EMAIL_ALREADY_EXISTS.code,
          message: errorCodes.EMAIL_ALREADY_EXISTS.message,
          description: errorCodes.EMAIL_ALREADY_EXISTS.description,
        },
      });
    }

    console.error("Registration error:", err);
    return sendResponse(res, {
      status: 500,
      codeObj: {
        code: errorCodes.REGISTRATION_FAILED.code,
        message: errorCodes.REGISTRATION_FAILED.message,
        description: errorCodes.REGISTRATION_FAILED.description,
      },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    console.log("Content-Type:", contentType);
    const headers = req.headers;
    console.log("Request headers:", headers);

    const decryptedData = decrypt(req.headers, req.body.data);
    console.log("Decrypted data:", decryptedData);

    const { email, password } = JSON.parse(decryptedData);
    const user = await User.findOne({ email });

    if (!user)
      return sendResponse(res, {
        status: 401,
        codeObj: {
          code: errorCodes.LOGIN_INVALID_CREDENTIALS.code,
          message: errorCodes.LOGIN_INVALID_CREDENTIALS.message,
          description: errorCodes.LOGIN_INVALID_CREDENTIALS.description,
        },
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return sendResponse(res, {
        status: 401,
        codeObj: {
          code: errorCodes.LOGIN_INVALID_CREDENTIALS.code,
          message: errorCodes.LOGIN_INVALID_CREDENTIALS.message,
          description: errorCodes.LOGIN_INVALID_CREDENTIALS.description,
        },
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION_SEC,
    });

    console.log("Generated token:", token);
    // res.json({ token, message: "Login successful" });
    return sendResponse(res, {
      status: 200,
      codeObj: {
        code: errorCodes.LOGIN_SUCCESS.code,
        token: token,
        message: errorCodes.LOGIN_SUCCESS.message,
        description: errorCodes.LOGIN_SUCCESS.description,
      },
    });
  } catch (err) {
    return sendResponse(res, {
      status: 500,
      codeObj: {
        code: errorCodes.LOGIN_INTERNAL_SERVER_ERROR.code,
        message: errorCodes.LOGIN_INTERNAL_SERVER_ERROR.message,
        description: errorCodes.LOGIN_INTERNAL_SERVER_ERROR.description,
      },
    });
  }
};
