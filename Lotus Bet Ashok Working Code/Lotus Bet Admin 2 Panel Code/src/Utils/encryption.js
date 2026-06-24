// src/utils/cryptoUtils.js
import CryptoJS from "crypto-js";

// 🔐 AES Encrypt
export const encryptData = (data, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return ciphertext;
};

// 🔓 AES Decrypt
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

// 🧩 Save encrypted data to LocalStorage
export const saveEncryptedLocal = (key, data, secretKey) => {
  const encrypted = encryptData(data, secretKey);
  localStorage.setItem(key, encrypted);
};

// 🧩 Get & decrypt LocalStorage data
export const getDecryptedLocal = (key, secretKey) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  return decryptData(encrypted, secretKey);
};

// 🧩 Save User Type
export const saveUserType = (userType) => {
  localStorage.setItem("userType", JSON.stringify(userType));
};

// 🧩 Get User Type
export const getUserType = () => {
  try {
    const userType = localStorage.getItem("userType");
    return userType ? JSON.parse(userType) : null;
  } catch (error) {
    console.error("Error getting user type:", error);
    return null;
  }
};

// 🧹 Clear All login-related data
export const clearUserData = () => {
  localStorage.removeItem("userType");
  localStorage.removeItem("userData");
};
