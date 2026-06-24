import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const WithdrawalRequest = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [reranumber, setreranumber] = useState("");

  const [bankList, setBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

        if (response.ok && data.status === "1") {
          setreranumber(data.data.rera_number);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBankId) {
      Swal.fire("Warning", "Please select a bank", "warning");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      Swal.fire("Warning", "Please enter a valid amount", "warning");
      return;
    }

    const selectedBank = bankList.find(
      (b) => b.id.toString() === selectedBankId
    );

    setLoading(true);
    try {
      const url = `${API_URL}/withdrawal-request`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedBank.id,
          bank_name: selectedBank.bank_name,
          amount: Number(amount),
        }),
      });

      const result = await response.json();

      if (result.success == "1") {
        Swal.fire(
          "Success",
          result.message || "Withdrawal submitted successfully!",
          "success"
        );
        setSelectedBankId("");
        setAmount("");
        navigate('/withdrawal-history');
      } else {
        let errorMessage = result.message || "Failed to submit withdrawal";

        if (result.allowed_dates && result.allowed_dates.length > 0) {
          errorMessage +=
            "<strong> &nbsp;Allowed Dates:</strong>";
          result.allowed_dates.forEach((date) => {
            // format change: YYYY-MM-DD -> DD-MM-YYYY
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

  return (
    <div className="mt-2">
      {reranumber === null || reranumber === "" ? (
        <>
          <div className="alert alert-warning shadow-lg rounded-3 p-4 text-center">
            <h4 className="alert-heading mb-3">⚠️ RERA Number Not Active</h4>
            <p className="mb-4">
              Your status is not active. Please update your RERA number to continue.
            </p>
            <button
              onClick={() => (window.location.href = "/update-rera-number")}
              className="btn btn-primary px-4"
            >
              Update RERA Number
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <div class="titlepage"><h3>Withdrawal Request</h3></div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Bank Name</label>
                  <select
                    className="form-select"
                    value={selectedBankId}
                    onChange={(e) => setSelectedBankId(e.target.value)}
                  >
                    <option value="">Select Bank</option>
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
        </>
      )}

    </div>
  );
};
export default WithdrawalRequest;
