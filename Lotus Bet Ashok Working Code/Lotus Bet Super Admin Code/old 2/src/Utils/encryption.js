// src/utils/cryptoUtils.js
import CryptoJS from "crypto-js";
export const encryptData = (data, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return ciphertext;
};
export const decryptData = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decrypt Error:", err);
    return null;
  }
};

// 🔐 HMAC Generate
export const generateHMAC = (encryptedData, secretKey) => {
  return CryptoJS.HmacSHA256(encryptedData, secretKey).toString();
};

export const saveEncryptedLocal = (key, data, secretKey) => {
  const encrypted = encryptData(data, secretKey);
  localStorage.setItem(key, encrypted);
};

export const getDecryptedLocal = (key, secretKey) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  return decryptData(encrypted, secretKey);
};


export const saveUserType = (userType) => {
  localStorage.setItem("userType", JSON.stringify(userType));
};


export const getUserType = () => {
  try {
    const userType = localStorage.getItem("userType");
    return userType ? JSON.parse(userType) : null;
  } catch (error) {
    console.error("Error getting user type:", error);
    return null;
  }
};

export const clearUserData = () => {
  localStorage.removeItem("userType");
  localStorage.removeItem("userData");
};
