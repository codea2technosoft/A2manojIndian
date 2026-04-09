import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

import moment from "moment";
import {
  getFancyList,
  manageFancyResult,
  settledFancyNow,
  rollbackFancyNow,
  deleteAllFancyBets,
  getFancyByList
} from "../../Server/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { MdRefresh } from "react-icons/md";
const FancyResult = () => {
  const { eventId } = useParams();
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
  });
  const navigate = useNavigate();
  const [fancies, setFancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const hasActiveFilters = filters.name !== "";
  useEffect(() => {
    if (eventId) fetchFancyList();
  }, [eventId]);

  const fetchFancyList = async (search = "") => {
    try {
      setLoading(true);
      setIsSearching(true);
      if (search !== undefined) {
        setSearchTerm(search);
      }
      const payload = {
        event_id: eventId,
        search: search !== undefined ? search : searchTerm,
      };
      const res = await getFancyList(payload);
      if (res.data.success) {
        setFancies(res.data.market || []);
      } else {
        toast.error("No fancy list found");
      }
    } catch (err) {
      toast.error("Error fetching fancies");
    }
    finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleViewFancy = async (f) => {
    try {
      setBtnLoader("view_" + f.fancy_id, true);

      const payload = {
        fancy_id: f.fancy_id,
        event_id: f.event_id,
        page: 1,
        limit: 50,
      };

      const res = await getFancyByList(payload);

      if (res.data.status_code === 1) {
        setViewData(res.data.data);
        setModalTitle(f.name);
        setShowModal(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error fetching fancy list");
    } finally {
      setBtnLoader("view_" + f.fancy_id, false);
    }
  };



  const getStatusBadge = (f) => {
    if (f.is_rollback) return <span className="badge bg-danger">Rollback</span>;
    // if (f.is_settled) return <span className="badge bg-primary">Settled</span>;
    if (f.result_val) return <span className="badge bg-success">Result Declared</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };



  const handleDeleteBets = async (f) => {
    const ok = await confirmAction(
      "Delete All Bets?",
      `All bets will be deleted for Fancy: ${f.name}`
    );

    if (!ok.isConfirmed) return;

    try {
      setBtnLoader("delete_" + f.fancy_id, true);

      const res = await deleteAllFancyBets({
        fancy_id: f.fancy_id,
        event_id: f.event_id,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchFancyList();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error deleting bets ❌");
    } finally {
      setBtnLoader("delete_" + f.fancy_id, false);
    }
  };



  // const handleInputChange = (id, value) =>
  //   setInputValues((prev) => ({ ...prev, [id]: value }));

  const handleInputChange = (fancyId, value) => {
    setInputValues(prev => ({
      ...prev,
      [fancyId]: value
    }));
  };

  // Update Button Loader
  const setBtnLoader = (id, val) => {
    setBtnLoading((prev) => ({ ...prev, [id]: val }));
  };

  // Confirm Popup
  // Confirm Popup (Updated)
  const confirmAction = async (title, htmlMessage) => {
    return await Swal.fire({
      title: title,
      html: htmlMessage,   // HTML now renders
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed",
      cancelButtonText: "Cancel",
    });
  };


  const handleUpdateResult = async (f) => {
    // const result_val = inputValues[f.fancy_id];
    const result_val = inputValues[f._id];

    if (!result_val) return toast.warning("Enter a value!");

    const ok = await confirmAction(
      "Update Fancy Result?",
      `Fancy: ${f.team} (ID: ${f.fancy_id})`
    );
    if (!ok.isConfirmed) return;

    try {
      setBtnLoader(f.fancy_id, true);
      const res = await manageFancyResult({
        fancy_id: f.fancy_id,
        event_id: f.event_id,
        result_val,
      });

      if (res.data.success) {
        toast.success("Result Updated!");
        setFancies((prev) => prev.filter((x) => x._id !== f._id));
        setInputValues((prev) => {
          const copy = { ...prev };
          delete copy[f._id];
          return copy;
        });
        // fetchFancyList();
      } else toast.error(res.data.message);
    } catch {
      toast.error("Error updating result");
    } finally {
      setBtnLoader(f.fancy_id, false);
    }
  };



  // // SETTLE
  const handleSettle = async (f) => {
    // const value = inputValues[f.fancy_id];
    const value = inputValues[f._id];

    if (!value) return toast.warning("Enter value before settling!");

    const ok = await confirmAction(
      `${f.name}`,
      `<b>Result Value:</b> ${value}`
    );
    if (!ok.isConfirmed) return;

    try {
      setBtnLoader("settle_" + f.fancy_id, true);
      const res = await settledFancyNow({
        id: f.fancy_id,
        fancy_id: f.fancy_id,
        event_id: f.event_id,
        value,
      });
      if (res.data.status_code === 1) {
        Swal.fire({
          icon: "success",
          title: "Result Declared ✅",
          html: `
      <b>Fancy:</b> ${f.team || f.name}<br/>
      <b>Result Value:</b> ${value}
    `,
          confirmButtonText: "OK",
        });

        fetchFancyList();
        return
      }
      
 if (res.data.status_code === 0) {
  Swal.fire({
    title: "Oops!",
    text: res.data.message,
  });
    fetchFancyList();  // 👈 Refresh Fancy List (Fail)
 
  return; 
} 
    } catch (err)
    {
      toast.error(err.res.data.message);
    } finally {
      setBtnLoader("settle_" + f.fancy_id, false);
    }
  };
  const handleClearAllFilters = () => {
    if (filters.name !== "") {
      setFilters({ name: "" });
      fetchFancyList(1, searchTerm, { name: "" });
    }
  };
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    fetchFancyList("");
    setIsSearching(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    fetchFancyList(searchInput);
  };

  const handleRollback = async (f) => {
    const ok = await confirmAction(
      "Rollback Settlement?",
      `Fancy: ${f.team} (ID: ${f.fancy_id})`
    );
    if (!ok.isConfirmed) return;

    try {
      setBtnLoader("rollback_" + f.fancy_id, true);
      const res = await rollbackFancyNow({
        id: f.fancy_id,
        fancy_id: f.fancy_id,
        event_id: f.event_id,
      });

      if (res.data.status_code === 1) {
        toast.success("Rollback Successful");
        fetchFancyList();
      } else toast.error(res.data.message);
    } catch {
      toast.error("Error performing rollback");
    } finally {
      setBtnLoader("rollback_" + f.fancy_id, false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-dark text-white d-flex justify-content-between">
        <h5 className="mb-0">Fancy Result Management</h5>

        <div>

          <button
            className="backbutton"
            onClick={() => window.location.href = window.location.href}
          >
            <MdRefresh size={20} />
          </button>


          <button className="backbutton" onClick={() => navigate(-1)}>
            ← Back
          </button>

        </div>
      </div>
      <div className="card-body">

        {fancies.length > 0 && (
          <div className="row mb-3 align-items-center">

            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "300px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search master..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <FiSearch />
                  </button>

                  {(searchTerm || hasActiveFilters) && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">Filters Active</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleClearAllFilters}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {searchTerm && (
                <div className="mt-2">
                  <small className="text-muted">
                    Search results for: <strong>"{searchTerm}"</strong>
                  </small>
                </div>
              )}
            </div>

          </div>
        )}



        {loading ? (
          <p>Loading...</p>
        ) : fancies.length === 0 ? (
          <p>No Fancy Found.</p>
        ) : (
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fancy</th>
                {/* <th>ID</th> */}
                {/* <th>Stake</th> */}
                {/* <th>Odd</th> */}
                <th>Status</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fancies.map((f, i) => (
                <tr key={f._id}>
                  <td>{i + 1}</td>
                  <td>{f.name}</td>
                  {/* <td>{f.fancy_id}</td> */}
                  {/* <td>{f.stake}</td> */}
                  {/* <td>{f.odd}</td> */}
                  <td>

                    <button
                      className="btn btn-danger btn-sm mt-1"
                      disabled={btnLoading["delete_" + f.fancy_id]}
                      onClick={() => handleDeleteBets(f)}
                    >
                      {btnLoading["delete_" + f.fancy_id] ? "Deleting..." : "Abundent"}
                    </button>
                  </td>

                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      // value={inputValues[f.fancy_id] || ""}
                      // onChange={(e) => handleInputChange(f.fancy_id, e.target.value)}
                      value={inputValues[f._id] || ""}
                      onChange={(e) =>
                        handleInputChange(f._id, e.target.value)
                      }
                      placeholder="Enter value"
                    />
                  </td>

                  <td style={{ width: "260px" }}>
                    {/* UPDATE RESULT */}
                    {/* <button
                      className="btn btn-success btn-sm me-1"
                      disabled={btnLoading[f.fancy_id]}
                      onClick={() => handleUpdateResult(f)}
                    >
                      {btnLoading[f.fancy_id] ? "..." : "Result"}
                    </button> */}
                    <button
                      className="btn btn-success btn-sm me-1"
                      disabled={btnLoading["settle_" + f.fancy_id]}
                      onClick={() => handleSettle(f)}
                    >
                      {btnLoading["settle_" + f.fancy_id] ? "Processing..." : "Result"}
                    </button>
                    {/* //view// */}
                    <button
                      className="btn btn-info btn-sm me-1"
                      disabled={btnLoading["view_" + f.fancy_id]}
                      onClick={() => handleViewFancy(f)}
                    >
                      {btnLoading["view_" + f.fancy_id] ? "..." : <AiFillEye size={18} />}
                    </button>
                    {/* SETTLE */}
                    {/* <button
                      className="btn btn-info btn-sm me-1"
                      disabled={btnLoading["settle_" + f.fancy_id]}
                      onClick={() => handleSettle(f)}
                    >
                      {btnLoading["settle_" + f.fancy_id] ? "..." : "Settle"}
                    </button> */}

                    {/* ROLLBACK */}
                    {/* <button
                      className="btn btn-warning btn-sm"
                      disabled={btnLoading["rollback_" + f.fancy_id]}
                      onClick={() => handleRollback(f)}
                    >
                      {btnLoading["rollback_" + f.fancy_id] ? "..." : "Rollback"}
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}



      </div>
      {showModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Fancy Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-1">
                <div className="table-responsive">
                  <table className="table fancy-detail-new table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>UserId</th>
                        <th>Phone Number</th>
                        <th>Bet Type</th>
                        <th>Stake</th>
                        <th>Odd</th>
                        {/* <th>Total</th> */}

                      </tr>
                    </thead>

                    <tbody>
                      {viewData.map((x, i) => (
                        <tr key={x._id}>
                          <td>{i + 1}</td>
                          <td>{moment(x.created_at).format("DD-MM-YYYY hh:mm A")}</td>
                          <td>{x.admin_id}</td>
                          <td>{x.mobile}</td>
                          <td>
                            <span
                              className={`badge ${x.bet_on === "lay" ? "bg-danger" : "bg-success"
                                }`}
                            >
                              {x.bet_on === "lay" ? "NO" : "YES"}
                            </span>
                          </td>
                          <td>{x.stake}</td>
                          <td>{x.odd}/{x.total}</td>
                          {/* <td>{x.total}</td> */}

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer p-1">
                <button className="refreshbutton" onClick={() => setShowModal(false)}>Close</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FancyResult;
