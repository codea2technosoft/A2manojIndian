// utils/encryption.js (Frontend - HMAC ke bina)
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_SECRET_KEY || "mcbsbdgodtusigreaterho135tomekyakarujhsfhv";
const responseSecretKey = process.env.REACT_APP_RESPONSE_SECRET_KEY || secretKey;

// 🔹 switch (development vs live)
const USE_ENCRYPTION = false;
// const USE_ENCRYPTION = true;
// false = development (plain payload)
// true = production (encrypted payload)


// export const encryptData = (data, key = secretKey) => {
//   try {
//     const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
//     return CryptoJS.AES.encrypt(jsonString, key).toString();
//   } catch (error) {
//     console.error("Encryption error:", error);
//     throw new Error("Failed to encrypt data");
//   }
// };


export const encryptData = (data, key = secretKey) => {
  try {

    if (!USE_ENCRYPTION) {
      return data; // development me encryption skip
    }

    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

    return CryptoJS.AES.encrypt(jsonString, key).toString();

  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};


// export const decryptData = (encryptedData, key = responseSecretKey) => {
//   try {
//     const bytes = CryptoJS.AES.decrypt(encryptedData, key);
//     const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

//     if (!decryptedText) {
//       throw new Error("Decryption failed - empty result");
//     }

//     return JSON.parse(decryptedText);
//   } catch (error) {
//     console.error("Decryption error:", error);
//     throw new Error("Failed to decrypt response");
//   }
// };

export const decryptData = (encryptedData, key = responseSecretKey) => {
  try {

    if (!USE_ENCRYPTION) {
      return encryptedData; // development me direct return
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, key);

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed - empty result");
    }

    return JSON.parse(decryptedText);

  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt response");
  }
};



// HMAC ke bina simple request helper
// export const makeEncryptedRequest = async (url, data, method = 'POST') => {
//   try {
//     const encryptedData = encryptData(data);

//     const response = await fetch(url, {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ encryptedData }),
//     });

//     const responseData = await response.json();

//     if (responseData.encryptedResponse) {
//       return decryptData(responseData.encryptedResponse);
//     }

//     return responseData;
//   } catch (error) {
//     console.error("API request error:", error);
//     throw error;
//   }
// };



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
    if (!USE_ENCRYPTION) {
      console.log("📤 API Request Payload:", payload);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    // 🔹 dev mode debug
    if (!USE_ENCRYPTION) {
      console.log("📥 API Response:", responseData);
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