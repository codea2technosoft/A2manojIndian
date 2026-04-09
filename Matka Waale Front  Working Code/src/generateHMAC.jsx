import CryptoJS from "crypto-js";

const generateHMAC = (message, secretKey) => {
  return CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Hex);
};

export default generateHMAC;
