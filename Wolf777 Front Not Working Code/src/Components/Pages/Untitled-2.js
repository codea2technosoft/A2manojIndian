const handleWithdraw = async () => {
  // Show all errors before validation
  showAllErrors();
 
  // Validate all fields
  const withdrawError = validateWithdrawAmount(withdrawAmount);
  const bankNameError = validateBankName(bankDetails.bankName);
  const accountHolderError = validateAccountHolderName(bankDetails.accountHolderName);
  const accountNoError = validateAccountNumber(bankDetails.accountNo);
  const ifscError = validateIFSC(bankDetails.ifsc);
 
  const hasErrors = withdrawError || bankNameError || accountHolderError || accountNoError || ifscError;
 
  if (hasErrors) {
    setErrors({
      withdrawAmount: withdrawError,
      bankName: bankNameError,
      accountHolderName: accountHolderError,
      accountNo: accountNoError,
      ifsc: ifscError
    });
    return;
  }
 
  setIsSubmitting(true);
  try {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("accessToken");
    const mobile = localStorage.getItem("mobile") || "0000000000";
   
    // ✅ Prepare request data
    const requestData = {
      user_id: userId,
      amount: Number(withdrawAmount),
      bank_name: bankDetails.bankName.trim(),
      account_holder_name: bankDetails.accountHolderName.trim(),
      account_number: bankDetails.accountNo.replace(/\s/g, ""),
      ifsc_code: bankDetails.ifsc.trim().toUpperCase(),
      mobile: mobile,
    };
 
    console.log("📤 Original Request Data:", requestData);
   
    // ✅ Encrypt the data
    const encryptedData = encryptData(requestData);
    console.log("🔐 Encrypted Data sent:", encryptedData.substring(0, 50) + "...");
   
    // ✅ Send ONLY encrypted data
    const response = await axios.post(
      `${baseUrl}/withdraw`,
      { encryptedData }, // ❌ NOT requestData, ✅ encryptedData
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
 
    console.log("📥 Raw Response:", response.data);
   
    // ✅ Check if response is encrypted
    if (response.data.encryptedResponse) {
      // Decrypt the response
      const decryptedResponse = decryptData(response.data.encryptedResponse);
      console.log("✅ Decrypted Response:", decryptedResponse);
     
      if (decryptedResponse.status_code === 200 || decryptedResponse.success === "1" || decryptedResponse.success === true) {
        Swal.fire({
          icon: "success",
          title: "Withdrawal Successful!",
          text: decryptedResponse.message || "Withdrawal request submitted successfully!",
          timer: 1000,
        });
        resetWithdrawForm();
        setShowWithdrawModal(false);
        fetchwallet_amount();
      } else {
        throw new Error(decryptedResponse.message || "Withdrawal failed");
      }
    } else {
      // Handle non-encrypted response (for backward compatibility)
      console.warn("⚠️ Response is NOT encrypted!");
      if (response.data.status_code === 200 || response.data.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Withdrawal Successful!",
          text: response.data.message || "Withdrawal request submitted successfully!",
          timer: 1000,
        });
        resetWithdrawForm();
        setShowWithdrawModal(false);
        fetchwallet_amount();
      } else {
        throw new Error(response.data.message || "Withdrawal failed");
      }
    }
  } catch (error) {
    console.error("❌ Withdrawal error:", error);
   
    let errorMessage = "Failed to submit withdrawal request";
   
    // Handle encrypted error response
    if (error.response && error.response.data && error.response.data.encryptedResponse) {
      try {
        const decryptedError = decryptData(error.response.data.encryptedResponse);
        errorMessage = decryptedError.message || errorMessage;
      } catch (e) {
        errorMessage = "Failed to process error response";
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
   
    Swal.fire({
      icon: "error",
      title: "Withdrawal Failed",
      text: errorMessage,
    });
  } finally {
    setIsSubmitting(false);
  }
};