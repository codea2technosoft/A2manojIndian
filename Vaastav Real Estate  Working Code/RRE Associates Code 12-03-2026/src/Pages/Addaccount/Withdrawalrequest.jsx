import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const WithdrawalRequest = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [reranumber, setreranumber] = useState("");
  const [bankList, setBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReraAlert, setShowReraAlert] = useState(false);
  
  const navigate = useNavigate();
  

  const [showCashOption, setShowCashOption] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");

  useEffect(() => {
    // ✅ Get current domain and check
    const domain = window.location.hostname;
    setCurrentDomain(domain);
    
    // ✅ More flexible domain check
    const shouldShowCash = 
      domain === 'studyy.khataaareportts.com' ||
      domain.endsWith('.studyy.khataaareportts.com') ||
      domain.includes('khataaareportts');
    
    console.log("🔄 DOMAIN CHECK:", {
      current: domain,
      shouldShowCash: shouldShowCash,
    });
    
    setShowCashOption(shouldShowCash);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // if (response.ok && data.status === "1") {
        //   setreranumber(data.data.rera_number);
        //   if (!data.data.rera_number || data.data.rera_number === "inactive") {
        //     setShowAlert(true);
        //   } else {
        //     setShowAlert(false);
        //   }
        // }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBankNames = async () => {
      try {
        const url = `${API_URL}/bank-accounts-list-success`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success === "1" && Array.isArray(data.data)) {
          setBankList(data.data);
        } else {
          console.error("Bank list format invalid:", data);
        }
      } catch (error) {
        console.error("Error fetching bank names:", error);
        Swal.fire("Error", "Failed to fetch bank names", "error");
      }
    };

    fetchBankNames();
  }, [API_URL, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBankId) {
      Swal.fire("Warning", "Please select a withdrawal method", "warning");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      Swal.fire("Warning", "Please enter a valid amount", "warning");
      return;
    }

    // Prepare payload based on selection
    let payload = {
      amount: Number(amount),
    };

    if (selectedBankId === "cash") {
      // For cash withdrawal
      payload.withdrawal_type = "cash";
      payload.bank_name = "Cash";
      payload.id = "cash";
    } else {
      // For bank withdrawal
      const selectedBank = bankList.find(
        (b) => b.id.toString() === selectedBankId
      );
      if (!selectedBank) {
        Swal.fire("Error", "Selected bank not found", "error");
        return;
      }
      payload.id = selectedBank.id;
      payload.bank_name = selectedBank.bank_name;
      payload.withdrawal_type = "bank";
    }

    setLoading(true);
    try {
      const url = `${API_URL}/withdrawal-request`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success == "1") {
        Swal.fire(
          "Success",
          result.message || "Withdrawal submitted successfully!",
          "success"
        ).then(() => {
          setSelectedBankId("");
          setAmount("");
          // /window.location.href = '/withdrawal-history';
         // navigate("/withdrawal-history");
        });
      }
      else {
        let errorMessage = result.message || "Failed to submit withdrawal";

        if (result.allowed_dates && result.allowed_dates.length > 0) {
          errorMessage += "<strong> &nbsp;Allowed Dates:</strong>";
          result.allowed_dates.forEach((date) => {
            const [year, month, day] = date.split("-");
            const formattedDate = `${day}-${month}-${year}`;
            errorMessage += `<li>${formattedDate}</li>`;
          });
          errorMessage += "</ul>";
        }

        Swal.fire("Error", errorMessage, "error");
        return;
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="container mt-4">
      {/* Show form only if RERA number exists and is active */}
      {/* {reranumber && reranumber ? ( */}
        <div className="card">
          <div className="card-header">
            <div className="titlepage"><h3>Withdrawal Request</h3></div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Withdrawal Method</label>
                <select
                  className="form-select"
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                >
                  <option value="">Select Method</option>
                  
                  {/* Cash option - only show for specific domains */}
                  {showCashOption && <option value="cash">Cash</option>}
                  
                  {/* Bank options */}
                  {bankList.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) > 0) {
                      setAmount(val);
                    }
                  }}
                  placeholder="Enter withdrawal amount"
                  min="1"
                />
              </div>
              <div className="d-flex justify-content-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Withdrawal"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      {/* ) 
      : (
        <>
          {showAlert &&
            Swal.fire({
              icon: "warning",
              title: "⚠️ Warning",
              text: "You have not updated your RERA number and your account status is inactive, so you cannot make a withdrawal. Please update and try again.",
              confirmButtonText: "OK",
              confirmButtonColor: "#3085d6",
            }).then(() => {
              setShowAlert(false);
            })}
        </>
      )} */}
    </div>
  );
};

export default WithdrawalRequest;