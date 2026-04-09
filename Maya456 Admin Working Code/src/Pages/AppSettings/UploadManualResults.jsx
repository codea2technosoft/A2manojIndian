import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function UploadManualResults() {
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);
  const [marketType, setMarketType] = useState("");
  const [mainMarkets, setMainMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [FilterMarketname, setFilterMarketname] = useState("");

  // Get month range based on fromDate
  const getMonthRange = (dateString) => {
    if (!dateString) return { minDate: "", maxDate: "" };
    
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return {
      minDate: firstDay.toISOString().split('T')[0],
      maxDate: lastDay.toISOString().split('T')[0]
    };
  };

  const monthRange = getMonthRange(fromDate);

  // Fetch markets based on selected market type
  const fetchMarkets = async () => {
    if (!marketType) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/market-list-manualResult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          market_type: marketType,
          marketname: FilterMarketname,
          page: 1,
        }),
      });
      const data = await res.json();
      
      console.log("Market API Response:", data); // Debug log
      
      if (data.message == "Not Found") {
        setMainMarkets([]);
      } else {
        const markets = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [data];
        setMainMarkets(markets);
      }
    } catch (err) {
      console.error("Error fetching market list:", err);
      setMainMarkets([]);
    }
  };

  // Automatically generate fields when both dates are filled
  useEffect(() => {
    if (fromDate && endDate) {
      generateResultsFields();
    }
  }, [fromDate, endDate]);

  // Fetch markets when market type changes
  useEffect(() => {
    if (marketType) {
      fetchMarkets();
      setSelectedMarket(""); // Reset selected market when type changes
    }
  }, [marketType]);

  // Calculate number of days between two dates and generate inputs
  const generateResultsFields = () => {
    const start = new Date(fromDate);
    const end = new Date(endDate);
    
    if (start > end) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "From date cannot be greater than end date!",
      });
      setResults([]);
      return;
    }

    // Check if end date is in same month as from date
    if (start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "End date must be in the same month as from date!",
      });
      setEndDate("");
      setResults([]);
      return;
    }

    // Calculate difference in days
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates

    if (daysDiff <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "Please select valid dates!",
      });
      setResults([]);
      return;
    }

    // Generate empty results array for each day
    const newResults = Array.from({ length: daysDiff }, (_, index) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + index);
      
      return {
        date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        open_digit: "",
        jodi_digit: "",
        close_digit: ""
      };
    });

    setResults(newResults);
  };

  // Handle individual result input change
  const handleResultChange = (index, field, value) => {
    const newResults = [...results];
    newResults[index] = {
      ...newResults[index],
      [field]: value
    };
    setResults(newResults);
  };

  // Check if at least one digit is filled in ALL results
  const areAllResultsFilled = () => {
    return results.every(item => 
      item.open_digit.trim() !== "" || 
      item.jodi_digit.trim() !== "" || 
      item.close_digit.trim() !== ""
    );
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const hasDates = fromDate && endDate;
    const hasMarketType = marketType;
    const hasSelectedMarket = selectedMarket;
    const hasResults = results.length > 0;
    const allResultsFilled = areAllResultsFilled();

    console.log("Form Validation:", {
      hasDates,
      hasMarketType,
      hasSelectedMarket,
      hasResults,
      allResultsFilled,
      results
    });

    return hasDates && hasMarketType && hasSelectedMarket && hasResults && allResultsFilled;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log("Submit button clicked!"); // Debug log
    console.log("Form Valid:", isFormValid()); // Debug log
    console.log("Results:", results); // Debug log

    // Detailed validation check
    if (!fromDate || !endDate) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select both from date and end date!",
      });
      return;
    }

    if (!marketType) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select market type!",
      });
      return;
    }

    if (!selectedMarket) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a market!",
      });
      return;
    }

    if (results.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please generate result fields by selecting dates!",
      });
      return;
    }

    if (!areAllResultsFilled()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill at least one result detail (Open Digit, Jodi Digit or Close Digit) for all days!",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Find selected market object
      const marketObj = mainMarkets.find(market => 
        market.market_id === selectedMarket || market.market_name === selectedMarket
      );

      // Prepare payload with dynamic market data including market_type
      const payload = {
        from_date: fromDate,
        end_date: endDate,
        market_type: marketType,
        market_id: marketObj?.market_id || selectedMarket,
        market_name: marketObj?.market_name || selectedMarket,
        results: results
      };

      console.log("Submitting payload:", payload);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/add-manual-result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${results.length} days results added successfully!`,
        });
        // Reset form
        setFromDate("");
        setEndDate("");
        setMarketType("");
        setSelectedMarket("");
        setMainMarkets([]);
        setResults([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error adding results:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting.",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const isButtonDisabled = !isFormValid();

  console.log("Button Disabled:", isButtonDisabled); // Debug log
  console.log("All Results Filled:", areAllResultsFilled()); // Debug log

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card mt-3">
          <div className="card-header bg-color-black">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="card-title text-white">Add Manual Results</h3>
            </div>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit}>
              <div className="row">
                {/* Market Type Selection */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Market Type<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    value={marketType}
                    onChange={(e) => setMarketType(e.target.value)}
                    required
                  >
                    <option value="">Select Market Type</option>
                    <option value="kingstarline">King Starline</option>
                    <option value="kingjackport">King Jackport</option>
                    <option value="mainmarket">Main Market</option>
                  </select>
                </div>

                {/* Market Selection - Dynamic based on market type */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Market Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    disabled={!marketType || mainMarkets.length === 0}
                    required
                  >
                    <option value="">Select Market</option>
                    {mainMarkets.map((market, index) => (
                      <option 
                        key={index} 
                        value={market.market_id || market.market_name}
                      >
                        {market.market_name || market.market_id}
                      </option>
                    ))}
                  </select>
                  {marketType && mainMarkets.length === 0 && (
                    <small className="text-muted">No markets found for selected type</small>
                  )}
                </div>

                {/* Date Inputs */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    From Date<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setEndDate("");
                      setResults([]);
                    }}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    End Date<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={monthRange.minDate}
                    max={monthRange.maxDate}
                    disabled={!fromDate}
                    required
                  />
                  {fromDate && (
                    <small className="text-muted">
                      Only dates from {formatDate(monthRange.minDate)} to {formatDate(monthRange.maxDate)} are allowed
                    </small>
                  )}
                </div>

                {/* Show number of days info */}
                {results.length > 0 && (
                  <div className="col-md-12 mb-3">
                    <div className="alert alert-info">
                      <strong>{results.length} days</strong> selected between {formatDate(fromDate)} and {formatDate(endDate)}
                    </div>
                  </div>
                )}

                {/* Dynamic Result Inputs - Only show when dates are selected */}
                {results.map((result, index) => (
                  <div key={index} className="col-md-12 mb-4 p-3 border rounded">
                    <div className="row">
                      {/* Result Date - Readonly */}
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">
                          Result Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={formatDate(result.date)}
                          readOnly
                        />
                      </div>
                      
                      {/* Open Digit - Not mandatory, 3 digits max */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Open Digit
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={result.open_digit}
                          onChange={(e) => handleResultChange(index, "open_digit", e.target.value)}
                          placeholder="Enter open digit (max 3 digits)"
                          maxLength={3}
                        />
                        <small className="text-muted">Optional - Maximum 3 digits</small>
                      </div>
                      
                      {/* Jodi Digit - Not mandatory */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Jodi Digit
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={result.jodi_digit}
                          onChange={(e) => handleResultChange(index, "jodi_digit", e.target.value)}
                          placeholder="Enter jodi digit"
                          maxLength={2}
                        />
                        <small className="text-muted">Optional - Maximum 2 digits</small>
                      </div>
                      
                      {/* Close Digit - Not mandatory, 3 digits max */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Close Digit
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={result.close_digit}
                          onChange={(e) => handleResultChange(index, "close_digit", e.target.value)}
                          placeholder="Enter close digit (max 3 digits)"
                          maxLength={3}
                        />
                        <small className="text-muted">Optional - Maximum 3 digits</small>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isButtonDisabled}
                    >
                      Add Results ({results.length} days)
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadManualResults;