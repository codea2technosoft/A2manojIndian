// utils/encryption.js (Frontend - HMAC ke bina)
import CryptoJS from 'crypto-js';

const secretKey =
  process.env.REACT_APP_SECRET_KEY ||
  "mcbsbdgodtusigreaterho135tomekyakarujhsfhv";
const responseSecretKey = process.env.REACT_APP_RESPONSE_SECRET_KEY || secretKey;

// 🔹 switch (development vs live)
export const USE_ENCRYPTION = false; // true = production (encrypted payload)
export const DEBUG_ENCRYPTION = true; // true = show console logs for debugging

export const encryptData = (data, key = secretKey) => {
  try {
    if (!USE_ENCRYPTION) {
      if (DEBUG_ENCRYPTION) console.log("📤 Encryption OFF, returning plain data:", data);
      return data; // development me encryption skip
    }

    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();

    if (DEBUG_ENCRYPTION) console.log("📤 Encrypted Payload:", encrypted);
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

export const decryptData = (encryptedData, key = responseSecretKey) => {
  try {
    if (!USE_ENCRYPTION) {
      if (DEBUG_ENCRYPTION) console.log("📥 Decryption OFF, returning plain data:", encryptedData);
      return encryptedData; // development me direct return
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed - empty result");
    }

    const parsed = JSON.parse(decryptedText);
    if (DEBUG_ENCRYPTION) console.log("📥 Decrypted Response:", parsed);

    return parsed;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt response");
  }
};

// HMAC ke bina simple request helper
export const makeEncryptedRequest = async (url, data = {}, method = 'POST') => {
  try {
    // 🔹 payload prepare
    const payload = USE_ENCRYPTION
      ? { encryptedData: encryptData(data) }
      : data;

    // 🔹 request config
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // 🔹 GET request me body nahi hoti
    if (method !== "GET") {
      config.body = JSON.stringify(payload);
    }

    // 🔹 dev mode debug
    if (DEBUG_ENCRYPTION) {
      console.log("🔹 Request URL:", url);
      console.log("🔹 Request Method:", method);
      console.log("🔹 Request Payload (" + (USE_ENCRYPTION ? "Encrypted" : "Plain") + "):", payload);
      console.log("🔹 Request Headers:", config.headers);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    // 🔹 dev mode debug
    if (DEBUG_ENCRYPTION) {
      console.log("🔹 Response Payload (" + (USE_ENCRYPTION ? "Encrypted" : "Plain") + "):", responseData);
    }

    // 🔹 response decrypt
    if (USE_ENCRYPTION && responseData.encryptedResponse) {
      return decryptData(responseData.encryptedResponse);
    }

    return responseData;

  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};