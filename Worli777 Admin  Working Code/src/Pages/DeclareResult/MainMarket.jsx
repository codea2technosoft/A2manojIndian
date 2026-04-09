import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";

function MainMarket() {
  const [marketId, setMarketId] = useState("");
  const [session, setSession] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loader, setLoaders] = useState(false);
  const [today, setToday] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
  });
  const [yesterday, setYesterday] = useState(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2);
    return currentDate.toISOString().split("T")[0];
  });

  const itemsPerPage = 10;
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

  // State for Result Declaration section
  const [selectedPana, setSelectedPana] = useState(null);
  const [digit, setDigit] = useState("");

  // State for Winner Update section - NEW SEPARATE STATES
  const [updateSelectedPana, setUpdateSelectedPana] = useState(null);
  const [updateDigit, setUpdateDigit] = useState("");

  const [BettotalAmt, setBettotalAmt] = useState("");
  const [WinnertotalAmt, setWinnertotalAmt] = useState("");
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
  const [ResulttotalPages, setResultTotalPages] = useState(1);
  const [fillter, setFillter] = useState(false);

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
    const currentDate1 = new Date();
    currentDate1.setDate(currentDate1.getDate() - 2);
    const formattedDate1 = currentDate1.toISOString().split("T")[0];
    setYesterday(formattedDate1);
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
              market_type: "mainmarket",
            }),
          }
        );
        const data = await res.json();
        if (data?.data) {
          setMarketList(data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMarketList();
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < ResulttotalPages) setCurrentPage(currentPage + 1);
  };

  const fetchData = async (page = 1) => {
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
            market_type: "mainMarket",
            page: page,
            limit: 20,
            date: today
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMarketData(data.data);
        setResultTotalPages(Number(data.pagination.totalPages) || 1);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, today]);

  useEffect(() => {
    const fetchPanaList = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}app-pana-number-list`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data?.success === "1" && Array.isArray(data.data)) {
          const formatted = data.data.map((item) => ({
            value: item._id,
            label: item.pana.toString(),
            digit: item.digit,
          }));
          setPanaList(formatted);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPanaList();
  }, []);

  const handleShowWinner = async () => {
    // Validation
    if (!today) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Please select a date.",
      });
      return;
    }

    if (!marketId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Please select a market.",
      });
      return;
    }

    if (!session) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Please select a session.",
      });
      return;
    }

    if (!selectedPana) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Please select a pana.",
      });
      return;
    }

    if (!digit) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Digit is required.",
      });
      return;
    }

    //setLoaders(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}show-mainmarket-winner-lists`,
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
            pana: selectedPana.label,
            digit: digit,
            market_type: "mainMarket",
          }),
        }
      );

      const data = await res.json();
      setLoaders(false);

      if (
        (data?.success === true || data?.success === "1") &&
        Array.isArray(data?.winTransactions)
      ) {
        const winners = data.winTransactions;

        if (winners.length > 0) {
          setWinnertotalAmt(data.totalBetWinAmount);
          setBettotalAmt(data.totalbetAmount);
          setWinnerData(winners);
          const inputObj = {};
          winners.forEach((item) => {
            inputObj[item._id] = {
              batNumber: item.bet_key?.toString() || "",
              amount: item.bet_amount?.toString() || "",
            };
          });
          setBatInputs(inputObj);

          // Reset update section states when showing new winners
          setUpdateSelectedPana(null);
          setUpdateDigit("");
        } else {
          setWinnerData([]);
          setBatInputs({});
          Swal.fire({
            icon: "info",
            title: "No Winner Found",
            text: "No winner data found for the selected input.",
          });
        }
      } else {
        setWinnerData([]);
        setBatInputs({});
        Swal.fire({
          icon: "info",
          title: "No Winner Found",
          text: "No winner data found for the selected input.",
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoaders(false);
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

    setIsButtonDisabled(true);

    const payload = {
      session: session,
      market_id: marketId,
      result_date: formatDateToDDMMYYYY(today),
      result_number: selectedPana.label,
      digit: Number(digit),
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}main-market-result-declear`,
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
        }).then(() => {
          window.location.reload();
        });

        setSelectedPana(null);
        setDigit("");
        setSession("");
        setMarketId("");
        fetchData();
        setIsButtonDisabled(false);
        setWinnerData([]);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops",
          text: data.message || "❌ Result declaration failed.",
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error declaring result:", error);
      setIsButtonDisabled(false);
      Swal.fire({
        icon: "error",
        title: "Please Select At Least One !!!!",
        text: "❌ Server error while declaring result.",
      });
    }
  };

  const AviodBet = async () => {
    if (!selectedIds || selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one bet to void.",
      });
      return;
    }

    // ✅ Confirmation Dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Please confirm that you want to Delete Permanently this bet. Make sure to review all details carefully, as this action is final and cannot be reverted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return; // ❌ Stop if user cancels
    }


    const payload = {
      selectedIds: selectedIds,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}market-bet-aviod`,
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
          title: "Success",
          text: data.message || "✅ Bet voided successfully!",
        });
        setSelectedIds([]);
        setSelectAll(false);
        handleShowWinner(); // Refresh winner list
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "❌ Failed to void bet.",
        });
      }
    } catch (error) {
      console.error("Error voiding bet:", error);
      Swal.fire({
        icon: "error",
        title: "Please Select At Least One !!!!",
        text: "❌ Server error while voiding bet.",
      });
    }
  };

  const handleRevert = async (market_type, market_id, date) => {
    const { value: selectedGame, isConfirmed } = await Swal.fire({
      title: "Select Session",
      input: "select",
      inputOptions: {
        open: "Open",
        close: "Close",
      },
      inputPlaceholder: "Select Session",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a Session!";
        }
      },
    });

    if (!isConfirmed) return;

    const payload = {
      market_id: market_id,
      date: date,
      market_type: market_type.toLowerCase(),
      market_typeResult: market_type,
      session: selectedGame,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}main-open-close-market-bet-revert`,
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
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Revert Failed",
          text: data.message || "❌ Failed to revert.",
        });
      }
      fetchData();
    } catch (error) {
      console.error("Revert Error:", error);
      Swal.fire({
        icon: "error",
        title: "Please Select At Least One !!!!",
        text: "❌ Error while reverting.",
      });
    }
  };

  // Filter data based on search
  const filteredItems = marketData.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    return (
      item.market_id?.toLowerCase().includes(keyword) ||
      item.date?.toLowerCase().includes(keyword) ||
      item.result?.toString().includes(keyword) ||
      item.result2?.toString().includes(keyword)
    );
  });
  // const handleUpdateSelectedWinners = async () => {
  //   if (selectedIds.length === 0) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "No Selection",
  //       text: "Please select at least one winner to update.",
  //     });
  //     return;
  //   }

  //   if (!updateSelectedPana) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Pana Required",
  //       text: "Please select a Pana number.",
  //     });
  //     return;
  //   }

  //   if (!updateDigit) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Digit Required",
  //       text: "Digit is required.",
  //     });
  //     return;
  //   }

  //   // 👇 CONFIRMATION DIALOG
  //   const confirmResult = await Swal.fire({
  //     title: "Are you sure?",
  //     // html: `You are about to update <b>${selectedIds.length}</b> winner(s) with:<br/>
  //     //        Pana: <b>${updateSelectedPana.label}</b><br/>
  //     //        Digit: <b>${updateDigit}</b>`,
  //     html: `Please confirm that you want to update this bet. Make sure to review all details carefully, as this action is final and cannot be reverted.`,

  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, update it!",
  //     cancelButtonText: "Cancel",
  //   });

  //   if (!confirmResult.isConfirmed) {
  //     return; // Stop if user cancels
  //   }

  //   setLoaders(true);

  //   try {
  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       winnerIds: selectedIds,
  //       bet_key: parseInt(updateSelectedPana.label),
  //       bet_key1: parseInt(updateDigit),
  //     };

  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}mainmarket-winners-bet-update`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await res.json();
  //     setLoaders(false);

  //     if (data?.success === true || data?.success === "1") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Updated Successfully",
  //         text: "Selected winners' bet numbers have been updated.",
  //       }).then(() => {
  //         setSelectedIds([]);
  //         setSelectAll(false);
  //         setUpdateSelectedPana(null);
  //         setUpdateDigit("");
  //         handleShowWinner();
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Update Failed",
  //         text: data?.message || "Something went wrong.",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     setLoaders(false);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Something went wrong while updating winners.",
  //     });
  //   }
  // };

  // Filter winner data
const handleUpdateSelectedWinners = async () => {
  if (selectedIds.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Selection",
      text: "Please select at least one winner to update.",
    });
    return;
  }

  if (!updateSelectedPana) {
    Swal.fire({
      icon: "warning",
      title: "Pana Required",
      text: "Please select a Pana number.",
    });
    return;
  }

  if (!updateDigit) {
    Swal.fire({
      icon: "warning",
      title: "Digit Required",
      text: "Digit is required.",
    });
    return;
  }

  // Get the first selected winner to extract market details
  const selectedWinner = winnerData.find(w => selectedIds.includes(w._id));
  
  if (!selectedWinner) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Could not find selected winner details.",
    });
    return;
  }

  // 👇 CONFIRMATION DIALOG
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    html: `Please confirm that you want to update this bet. Make sure to review all details carefully, as this action is final and cannot be reverted.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, update it!",
    cancelButtonText: "Cancel",
  });

  if (!confirmResult.isConfirmed) {
    return; // Stop if user cancels
  }

  setLoaders(true);

  try {
    const token = localStorage.getItem("token");

    // Update payload with market_id, market_type, and game_type_name
    const payload = {
      winnerIds: selectedIds,
      bet_key: parseInt(updateSelectedPana.label),
      bet_key1: parseInt(updateDigit),
      market_id: selectedWinner.market_id,        // Add market_id
      market_type: "mainmarket",                   // Add market_type
      game_type_name: selectedWinner.game_type_name,
      session: selectedWinner.session 
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}mainmarket-winners-bet-update`,
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
    setLoaders(false);

    if (data?.success === true || data?.success === "1") {
      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Selected winners' bet numbers have been updated.",
      }).then(() => {
        setSelectedIds([]);
        setSelectAll(false);
        setUpdateSelectedPana(null);
        setUpdateDigit("");
        
        // Call handleShowWinner with the market details from the selected winner
        if (selectedWinner) {
          // Set the form fields with the selected winner's market details
          setMarketId(selectedWinner.market_id);
          setSession(selectedWinner.session);
          
          // Create a synthetic event to call handleShowWinner with the correct payload
          const showWinnerPayload = {
            result_date: today,
            market_id: selectedWinner.market_id,
            session: selectedWinner.session,
            pana: updateSelectedPana?.label || selectedWinner.bet_key?.toString(),
            digit: updateDigit || selectedWinner.bet_key1?.toString(),
            market_type: "mainmarket",
            game_type_name: selectedWinner.game_type_name,
            session: selectedWinner.session,
          };
          
          // Call handleShowWinner with the market details
          handleShowWinnerWithDetails(showWinnerPayload);
        } else {
          handleShowWinner();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: data?.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.error("Update error:", error);
    setLoaders(false);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while updating winners.",
    });
  }
};

// Create a new function to handle show winner with specific payload
const handleShowWinnerWithDetails = async (payload) => {
  setLoaders(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}show-mainmarket-winner-lists`,
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
    setLoaders(false);

    if (
      (data?.success === true || data?.success === "1") &&
      Array.isArray(data?.winTransactions)
    ) {
      const winners = data.winTransactions;

      if (winners.length > 0) {
        setWinnertotalAmt(data.totalBetWinAmount);
        setBettotalAmt(data.totalbetAmount);
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
        setBatInputs({});
        Swal.fire({
          icon: "info",
          title: "No Winner Found",
          text: "No winner data found for the selected input.",
        });
      }
    } else {
      setWinnerData([]);
      setBatInputs({});
      Swal.fire({
        icon: "info",
        title: "No Winner Found",
        text: "No winner data found for the selected input.",
      });
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    setLoaders(false);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while fetching winner data.",
    });
  }
};
 
 
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

  // Winner pagination
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
    setWinnerCurrentPage(1);
  }, [winnerSearchTerm]);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  // const handleUpdateSelectedWinners = async () => {
  //   if (selectedIds.length === 0) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "No Selection",
  //       text: "Please select at least one winner to update.",
  //     });
  //     return;
  //   }

  //   if (!updateSelectedPana) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Pana Required",
  //       text: "Please select a Pana number.",
  //     });
  //     return;
  //   }

  //   if (!updateDigit) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Digit Required",
  //       text: "Digit is required.",
  //     });
  //     return;
  //   }

  //   setLoaders(true);

  //   try {
  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       winnerIds: selectedIds,
  //       bet_key: parseInt(updateSelectedPana.label),
  //       bet_key1: parseInt(updateDigit),
  //     };

  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}mainmarket-winners-bet-update`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await res.json();
  //     setLoaders(false);

  //     if (data?.success === true || data?.success === "1") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Updated Successfully",
  //         text: "Selected winners' bet numbers have been updated.",
  //       }).then(() => {
  //         setSelectedIds([]);
  //         setSelectAll(false);
  //         setUpdateSelectedPana(null);
  //         setUpdateDigit("");
  //         handleShowWinner();
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Update Failed",
  //         text: data?.message || "Something went wrong.",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     setLoaders(false);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Something went wrong while updating winners.",
  //     });
  //   }
  // };

  return (
    <div className="marketname mt-3">
      {loader && (
        <div className="loaderdesign">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/loader.gif`}
            alt="logo"
            className="logo-lg"
            height="100"
          />
        </div>
      )}
      <div className="mt-2">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="card-title text-white">Declared Main Result</h3>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <form noValidate className="needs-validation">
                    <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end flex-wrap">
                      <div className="form_latest_design">
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
                          min={yesterday}
                          max={today}
                        />
                      </div>

                      <div className="form_latest_design">
                        <label className="form-label">
                          Game Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          options={marketList.map((market) => ({
                            value: market.market_id,
                            label: `${market.market_name} (${market.open_result_time} - ${market.close_result_time})`,
                          }))}
                          value={marketList
                            .map((market) => ({
                              value: market.market_id,
                              label: `${market.market_name} (${market.open_result_time} - ${market.close_result_time})`,
                            }))
                            .find((opt) => opt.value === marketId)}
                          onChange={(selectedOption) =>
                            setMarketId(selectedOption?.value || "")
                          }
                          placeholder="Select Market"
                        />
                      </div>

                      <div className="form_latest_design">
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
                          <option value="open">Open</option>
                          <option value="close">Close</option>
                        </select>
                      </div>

                      <div className="form_latest_design">
                        <label className="form-label">
                          Pana<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          options={panaList}
                          value={selectedPana}
                          onChange={(selected) => {
                            setSelectedPana(selected);
                            setDigit(
                              selected?.digit?.toString() === "000"
                                ? "0"
                                : selected?.digit?.toString() || ""
                            );
                          }}
                          placeholder="Select Pana"
                          isSearchable
                          isLoading={panaList.length === 0}
                        />
                      </div>

                      <div className="form_latest_design">
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
                      </div>

                      <div className="form_latest_design">
                        <div className="d-flex gap-2">
                          <button
                            className="buttondesign yellowcolor w-auto h-auto"
                            type="button"
                            onClick={handleShowWinner}
                          >
                            Show Winner
                          </button>
                          <button
                            className={`buttondesign declare w-auto h-auto ${isButtonDisabled ? "disabled-button" : ""}`}
                            type="button"
                            onClick={handleDeclareResult}
                            disabled={isButtonDisabled}
                          >
                            {isButtonDisabled ? "Declared" : "Declare"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {winnerData.length > 0 && (
            <div className="mt-2">
              <div className="card">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <h3 className="title_page textwhitenew">Winner List</h3>
                      <div>
                        <button className="avoidbet" onClick={AviodBet}>
                          Void Bet
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control w-25"
                      placeholder="Search Winners by Name, Market..."
                      value={winnerSearchTerm}
                      onChange={(e) => setWinnerSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Update Winners Section - Using separate states now */}
                {winnerData.length > 0 && (
                  <div className="row mb-3 mt-3">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="row align-items-end">
                            <div className="col-md-4">
                              <label className="form-label">
                                Pana <span style={{ color: "red" }}>*</span>
                              </label>
                              <Select
                                options={panaList}
                                value={updateSelectedPana}
                                onChange={(selected) => {
                                  setUpdateSelectedPana(selected);
                                  setUpdateDigit(
                                    selected?.digit?.toString() === "000"
                                      ? "0"
                                      : selected?.digit?.toString() || ""
                                  );
                                }}
                                placeholder="Select Pana"
                                isSearchable
                                isLoading={panaList.length === 0}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                Digit <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="updateDigit"
                                placeholder="Digit"
                                required
                                value={updateDigit}
                                disabled={!updateSelectedPana}
                                readOnly
                              />
                            </div>
                            <div className="col-md-4">
                              <button
                                className="btn btn-primary w-100"
                                onClick={handleUpdateSelectedWinners}
                                disabled={selectedIds.length === 0 || !updateSelectedPana}
                              >
                                Update Selected Winners ({selectedIds.length})
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-body">
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
                          <th>Market</th>
                          <th>Session</th>
                          <th>Game Type</th>
                          <th>Bet Number</th>
                          <th>Amount ({BettotalAmt})</th>
                          <th>Win Amount ({WinnertotalAmt})</th>
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
                              &nbsp;{index + 1 + (winnerCurrentPage - 1) * winnerItemsPerPage}
                            </td>
                            <td>{toSentenceCase(item.user_name)}</td>
                            <td>{item.market_id}</td>
                            <td>{toSentenceCase(item.session)}</td>
                            <td>{formatGameType(item.game_type_name)}</td>
                            <td>
                              {["triple_pana"].includes(item.game_type_name) && item.bet_key == 0
                                ? "000"
                                : item.bet_key}
                            </td>
                            <td>{batInputs[item._id]?.amount || "-"}</td>
                            <td>{item.win_Amt}</td>
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

                    {/* Winner Pagination */}
                    <ul className="d-flex justify-content-between pl-0 align-items-center mt-3">
                      <li className={`paginationbutton ${winnerCurrentPage === 1 ? "disabled" : ""}`}>
                        <span onClick={() => setWinnerCurrentPage((prev) => Math.max(prev - 1, 1))}>
                          Previous
                        </span>
                      </li>
                      <li className="d-flex list-style-none alllistnumber align-items-center gap-2">
                        <span>Page {winnerCurrentPage} of {totalWinnerPages}</span>
                      </li>
                      <li className={`paginationbutton ${winnerCurrentPage === totalWinnerPages ? "disabled" : ""}`}>
                        <span onClick={() => setWinnerCurrentPage((prev) => Math.min(prev + 1, totalWinnerPages))}>
                          Next
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Declared Results Table */}
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Date</th>
                    <th>Market Name</th>
                    <th>Open Panna</th>
                    <th>Jodi</th>
                    <th>Close Panna</th>
                    <th>Bet Revert</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    marketData.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{moment(item.date).format("DD-MM-YYYY")}</td>
                        <td>{toSentenceCase(item.market_id)}</td>
                        <td>{item.result}</td>
                        <td>{item.result2}</td>
                        <td>{item.result3}</td>
                        {(moment(item.date).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY") ||
                          moment(item.date).format("DD-MM-YYYY") === moment().subtract(1, "days").format("DD-MM-YYYY")) && (
                            <td>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Revert</Tooltip>}>
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() =>
                                    handleRevert(
                                      item.market_type,
                                      item.market_id,
                                      moment(item.date).format("DD-MM-YYYY")
                                    )
                                  }
                                >
                                  ↩
                                </button>
                              </OverlayTrigger>
                            </td>
                          )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            {marketData.length > 0 && (
              <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
                <button
                  className="paginationbutton"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="alllistnumber">
                  Page {currentPage} of {ResulttotalPages}
                </span>
                <button
                  className="paginationbutton"
                  onClick={handleNext}
                  disabled={currentPage === ResulttotalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMarket;