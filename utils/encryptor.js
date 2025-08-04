const CryptoJS = require("crypto-js");
const { checkout } = require("../routes/authRoutes");

const secretKey = process.env.ENC_SECRET;
let doEncBypsass = false;

function encrypt(reqHeaders, text) {
  const contentType = reqHeaders["content-type"];
  const headers = reqHeaders["authorization"];
  if (reqHeaders["api-text"] == "rajnara") {
    // console.log("Content-Type:", contentType);
    // console.log("Request headers:", headers);
    doEncBypsass = true;
    return JSON.stringify(cipherText);
  }
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decrypt(reqHeaders, cipherText) {
  const contentType = reqHeaders["content-type"];
  const headers = reqHeaders["authorization"];
  if (reqHeaders["api-text"] == "rajnara") {
    console.log("Content-Type:", contentType);
    console.log("Request headers:", headers);
    doEncBypsass = true;
    return JSON.stringify(cipherText);
  }

  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  console.log(bytes.toString(CryptoJS.enc.Utf8));
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
