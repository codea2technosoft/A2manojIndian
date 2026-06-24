import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";

function KingJackPortMarket() {
  const [marketId, setMarketId] = useState("");
  const [session, setSession] = useState("");
  const [today, setToday] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
  });
  const toSentenceCase = (str) => {
    return str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatGameType = (str) => {
    if (!str) return "";
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [marketList, setMarketList] = useState([]);
  const [panaList, setPanaList] = useState([]);
  const [selectedPana, setSelectedPana] = useState(null);
  const [digit, setDigit] = useState("");
  const [winnerData, setWinnerData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [batNumber, setBatNumber] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [batInputs, setBatInputs] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [marketData, setMarketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [winnerSearchTerm, setWinnerSearchTerm] = useState("");
  const [winnerCurrentPage, setWinnerCurrentPage] = useState(1);
  const [sharedBatNumber, setSharedBatNumber] = useState("");
  const [sharedAmount, setSharedAmount] = useState("");
  const winnerItemsPerPage = 20;

  const itemsPerPage = 6;
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setToday(formattedDate);
  }, []);

  useEffect(() => {
    const fetchMarketList = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}market-list-result`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              market_type: "kingjackport",
            }),
          }
        );
        const data = await res.json();
        if (data?.data) {
          setMarketList(data.data);
        } else {
          console.error("No data found in response");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMarketList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}market-declared-result-lists`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              market_type: "kingjackport",
            }),
          }
        );
        const data = await res.json();
        if (data.success) {
          setMarketData(data.data);
        } else {
          console.error("Data not found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchPanaList = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await fetch(
  //         `${process.env.REACT_APP_API_URL}app-pana-number-list`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       if (data?.success === "1" && Array.isArray(data.data)) {
  //         const formatted = data.data.map((item) => ({
  //           value: item._id,
  //           label: item.pana.toString(),
  //           digit: item.digit,
  //         }));
  //         setPanaList(formatted);
  //       } else {
  //         console.error("Invalid response");
  //       }
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };

  //   fetchPanaList();
  // }, []);

      useEffect(() => {
      const generateStaticPanaList = () => {
        const list = Array.from({ length: 100 }, (_, i) => ({
          value: i.toString(),
          label: i.toString().padStart(2, "0"),
          digit: i.toString().length,
        }));
        setPanaList(list);
      };

      generateStaticPanaList();
    }, []);



  const handleShowWinner = async () => {
    if (!today || !marketId || !session || !selectedPana || !digit) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields to view winner data.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}show-kingJacportmarket-winner-lists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            result_date: today,
            market_id: marketId,
            session: session,
            //pana: selectedPana.label,
            digit: selectedPana.label,
            market_type: "kingjackport",
          }),
        }
      );

      const data = await res.json();
      if (
        (data?.success === true || data?.success === "1") &&
        Array.isArray(data?.winTransactions)
      ) {
        const winners = data.winTransactions;
        if (winners.length > 0) {
          setWinnerData(winners);
          const inputObj = {};
          winners.forEach((item) => {
            inputObj[item._id] = {
              batNumber: item.bet_key?.toString() || "",
              amount: item.bet_amount?.toString() || "",
            };
          });
          setBatInputs(inputObj);
        } else {
          setWinnerData([]);
          setBatInputs({}); // also reset input fields
          Swal.fire({
            icon: "info",
            title: "No Winner Found",
            text: "No winner data found for the selected input.",
          });
        }
      } else {
        setWinnerData([]);
        setBatInputs({}); // also reset input fields
        Swal.fire({
          icon: "info",
           title: "No Winner Found",
            text: "No winner data found for the selected input.",
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while fetching winner data.",
      });
    }
  };

  const handleSelectAll = () => {
    const allIds = winnerData.map((item) => item._id);
    setSelectAll(!selectAll);
    setSelectedIds(!selectAll ? allIds : []);
  };

  const handleSingleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleInputChange = (id, field, value) => {
    setBatInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // const handleSubmit = () => {
  //   const payload = selectedIds.map((id) => ({
  //     user_id: id,
  //     bat_number: batInputs[id]?.batNumber || "",
  //     amount: batInputs[id]?.amount || "",
  //   }));

  //   handleSubmitWinner(payload);
  // };


const handleSubmit = async () => {
  if (!sharedBatNumber.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Missing Bat Number",
      text: "Please enter a Bat Number before submitting.",
    });
    return;
  }

  if (selectedIds.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Winner Selected",
      text: "Please select at least one winner to update.",
    });
    return;
  }

  // ✅ Prepare payload with _id, market_id and bat_number
  const payload = selectedIds.map((id) => {
    const winner = winnerData.find((item) => item._id === id);
    return {
      winner_id: id,
      market_id: winner?.market_id || "",
      bat_number: sharedBatNumber,
    };
  });

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}mainmarket-winner-updated`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ winners: payload }),
      }
    );

    const data = await res.json();

    if (data?.success === "1") {
      Swal.fire({
        icon: "success",
        title: "Winners Submitted",
        text: "Selected winners have been updated successfully.",
      });
      setSharedBatNumber("");
      setSelectedIds([]);
      setWinnerData([]);
    } else {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: data?.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.error("Submission error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while submitting winner data.",
    });
  }
};


  const handleSubmitWinner = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select Winners",
        text: "Please select at least one winner to submit.",
      });
      return;
    }
    const missingInput = selectedIds.find((id) => {
      const input = batInputs[id];
      return !input || input.batNumber.trim() === "";
    });

    if (missingInput) {
      Swal.fire({
        icon: "warning",
        title: "Enter Bat Number",
        text: "Please enter a bat number before submitting.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const winnerPayload = selectedIds.map((id) => ({
        winner_id: id,
        bat_number: batInputs[id].batNumber,
        amount: batInputs[id].amount,
      }));
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}mainmarket-winner-updated`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            winners: winnerPayload,
          }),
        }
      );

      const data = await res.json();
      if (data?.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Winners Submitted",
          text: "Selected winners have been updated successfully.",
        });
        setSelectedIds([]);
        setSelectAll(false);
        setBatInputs({});
        setWinnerData([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting winner data.",
      });
    }
  };

  const handleDeclareResult = async () => {
    if (!today || !marketId || !session || !selectedPana || !digit) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields to declare result.",
      });
      return;
    }

    // ✅ Prepare payload
    const payload = {
      session: session, // <- spelling fix
      market_id: marketId,
      result_date: formatDateToDDMMYYYY(today),
      result_number: selectedPana.label,
      digit: selectedPana.label,
    };
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}kingJackport-market-result-declear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data?.success === true || data?.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Result Declared",
          text: data.message || "✅ Result declared successfully!",
        });

        // ✅ Optional: Reset form fields
        setSelectedPana(null);
        setDigit("");
        setSession("");
        setMarketId("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Declaration Failed",
          text: data.message || "❌ Result declaration failed.",
        });
      }
    } catch (error) {
      console.error("Error declaring result:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "❌ Server error while declaring result.",
      });
    }
  };

  const handleRevert = async (item) => {
    const payload = {
      market_id: item.market_id,
      result_date: new Date(item.date).toLocaleDateString("en-GB"), // DD-MM-YYYY
      session: item.session,
      digit: 0,
      result_number: "0",
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}mainmarket-revert-bet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data?.success === "1" || data?.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Reverted",
          text: data.message || "✅ Revert successful!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Revert Failed",
          text: data.message || "❌ Failed to revert.",
        });
      }
    } catch (error) {
      console.error("Revert Error:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "❌ Error while reverting.",
      });
    }
  };

  // 🔍 Filtered data
  // const filteredItems = marketData.filter((item) => {
  //   const keyword = searchTerm.toLowerCase();
  //   return (
  //     item.market_name?.toLowerCase().includes(keyword) ||
  //     item.date?.toLowerCase().includes(keyword) ||
  //     item.open_panna?.toString().includes(keyword) ||
  //     item.close_panna?.toString().includes(keyword)
  //   );
  // });

  // Filter data based on search decleared result
  const filteredItems = marketData.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    return (
      item.market_id?.toLowerCase().includes(keyword) ||
      item.date?.toLowerCase().includes(keyword) ||
      item.result?.toString().includes(keyword) ||
      item.result2?.toString().includes(keyword)
    );
  });

  ///////filter winner data
  const filteredWinnerData = winnerData.filter((item) => {
    const keyword = winnerSearchTerm.toLowerCase();
    return (
      item.user_name?.toLowerCase().includes(keyword) ||
      item.mobile?.toString().includes(keyword) ||
      item.market_id?.toLowerCase().includes(keyword) ||
      item.session?.toLowerCase().includes(keyword) ||
      item.game_type_name?.toLowerCase().includes(keyword)
    );
  });

  // 📄 Pagination
  const totalItems = filteredItems.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  /////pagination winner
  const indexOfLastWinnerItem = winnerCurrentPage * winnerItemsPerPage;
  const indexOfFirstWinnerItem = indexOfLastWinnerItem - winnerItemsPerPage;
  const currentWinnerItems = filteredWinnerData.slice(
    indexOfFirstWinnerItem,
    indexOfLastWinnerItem
  );
  const totalWinnerPages = Math.ceil(
    filteredWinnerData.length / winnerItemsPerPage
  );
  useEffect(() => {
    setWinnerCurrentPage(1); // reset page if search term changes
  }, [winnerSearchTerm]);

  // if (winnerData.length === 0) return null;

  return (
    <div className="marketname mt-3">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form noValidate className="needs-validation">
                <div className="row align-items-end">
                  <div className="col-md-2 mb-3">
                    <label className="form-label">
                      Date<span style={{ color: "red" }}>*</span>
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      name="result_date"
                      required
                      value={today}
                      onChange={(e) => setToday(e.target.value)}
                      min={today}
                      max={today}
                    />
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label">
                      Game Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      name="market_id"
                      value={marketId}
                      onChange={(e) => setMarketId(e.target.value)}
                    >
                      <option value="">Select Market</option>
                      {marketList.map((market, index) => (
                        <option key={index} value={market.market_id}>
                          {market.market_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label">
                      Session <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      name="sesion_status"
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                    >
                      <option value="">Select Session</option>
                      <option value="close">Close</option>
                    </select>
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label">
                      Jodi Digits<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      options={panaList}
                      value={selectedPana}
                      onChange={(selected) => {
                        setSelectedPana(selected);
                        setDigit(selected?.digit?.toString() || "");
                      }}
                      placeholder="Jodi Digits"
                      isSearchable
                      isLoading={panaList.length === 0}
                    />
                  </div>
                  {/* <div className="col-md-1 mb-3">
                    <label className="form-label">
                      Digit <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="digit"
                      placeholder="Digit"
                      required
                      value={digit}
                      disabled={!selectedPana}
                      readOnly
                    />
                  </div> */}
                  <div className="col-md-3 mb-3">
                    <div className="d-flex gap-2">
                      <button
                        className="buttondesign yellowcolor"
                        type="button"
                        onClick={handleShowWinner}
                      >
                        Show Winner
                      </button>
                      <button
                        className="buttondesign declare"
                        type="button"
                        onClick={handleDeclareResult}
                      >
                        Declare
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="margin-top-50">
        <div className="mb-3 d-flex justify-content-end">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by Market Name, Panna, Date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Date</th>
              <th>Market Name</th>
              <th>Jodi Digits</th>
              {/* <th>Close Panna</th> */}
              {/* <th>Bat Revert</th> */}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{startIndex + index + 1}</td>
                  {/* <td>{new Date(item.date).toLocaleDateString()}</td> */}
                  <td>{item.date}</td>
                  <td>{toSentenceCase(item.market_id)}</td>
                  <td>{item.result}</td>
                  {/* <td>{item.result2}</td> */}
                  {/* <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Revert</Tooltip>}
                    >
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleRevert(item)}
                      >
                        ↩
                      </button>
                    </OverlayTrigger>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ⏮️ Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="paginationbutton"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="alllistnumber">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          className="paginationbutton"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {winnerData.length > 0 && (
        <>
          <div className="mb-3 d-flex justify-content-end margin-top-50">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search Winners by Name, Mobile, Market..."
              value={winnerSearchTerm}
              onChange={(e) => setWinnerSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-responsive mt-2">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="ms-1">Select All</span>
                  </th>
                  <th>User Name</th>
                  <th>Mobile</th>
                  <th>Market</th>
                  <th>Session</th>
                  <th>Game Type</th>
                  <th>Bat Number</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentWinnerItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => handleSingleSelect(item._id)}
                      />
                      &nbsp;
                      {index + 1}
                    </td>
                    <td>{toSentenceCase(item.user_name)}</td>
                    <td>{item.mobile}</td>
                    <td>{item.market_id}</td>
                    <td>{toSentenceCase(item.session)}</td>
                    <td>{formatGameType(item.game_type_name)}</td>
                    <td>{batInputs[item._id]?.batNumber || "-"}</td>
                    <td>{batInputs[item._id]?.amount || "-"}</td>
                  </tr>
                ))}
                {filteredWinnerData.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No matching winner records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="row mb-3">
              <div className="col-md-9"></div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <label>Enter Bet Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={sharedBatNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]*$/.test(value)) {
                              setSharedBatNumber(value);
                            }
                          }}
                          required
                          placeholder="Enter Bat Number"
                        />
                      </div>
                      <div className="col-12 w-100 text-end mt-2">
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          Update Winner
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul className="d-flex justify-content-between pl-0 align-items-center mt-3">
              <li
                className={`paginationbutton ${
                  winnerCurrentPage === 1 ? "disabled" : ""
                }`}
              >
                <span
                  onClick={() =>
                    setWinnerCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </span>
              </li>
              <li className="d-flex list-style-none alllistnumber align-items-center gap-2">
                <span className="">
                  Page {winnerCurrentPage} of {totalWinnerPages}
                </span>
              </li>
              <li
                className={`paginationbutton ${
                  winnerCurrentPage === totalWinnerPages ? "disabled" : ""
                }`}
              >
                <span
                  onClick={() =>
                    setWinnerCurrentPage((prev) =>
                      Math.min(prev + 1, totalWinnerPages)
                    )
                  }
                >
                  Next
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default KingJackPortMarket;
