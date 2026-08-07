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
  getFancyByList,
  deleteFancy
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



  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to cancel this bet?, this action cannot be revert.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) return;

      const res = await deleteFancy({ _id: id });

      if (res?.data?.status_code === 1) {
        Swal.fire({
          title: "Deleted!",
          text: "Record deleted successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        // UI से remove
        setViewData((prev) =>
          prev.filter((item) => item._id !== id)
        );

      } else {
        Swal.fire({
          title: "success",
          text: res?.data?.message || "Delete failed",
          icon: "success",
        });
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);    // setViewData()
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire({
        title: "success",
        text: "Something went wrong",
        icon: "success",
      });
    }
  };

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
    } finally {
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
    if (f.result_val)
      return <span className="badge bg-success">Result Declared</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  const handleDeleteBets = async (f) => {
    const ok = await confirmAction(
      "Delete All Bets?",
      `All bets will be deleted for Fancy: ${f.name}`,
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
    setInputValues((prev) => ({
      ...prev,
      [fancyId]: value,
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
      html: htmlMessage, // HTML now renders
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
      `Fancy: ${f.team} (ID: ${f.fancy_id})`,
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
  // const handleSettle = async (f) => {
  //   // const value = inputValues[f.fancy_id];
  //   const value = inputValues[f._id];

  //   if (!value) return toast.warning("Enter value before settling!");

  //   const ok = await confirmAction(
  //     `${f.name}`,
  //     `<b>Result Value:</b> ${value}`,
  //   );
  //   if (!ok.isConfirmed) return;

  //   try {
  //     setBtnLoader("settle_" + f.fancy_id, true);
  //     const res = await settledFancyNow({
  //       id: f.fancy_id,
  //       fancy_id: f.fancy_id,
  //       event_id: f.event_id,
  //       value,
  //     });
  //     if (res.data.status_code === 1) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Result Declared ✅",
  //         html: `
  //     <b>Fancy:</b> ${f.team || f.name}<br/>
  //     <b>Result Value:</b> ${value}
  //   `,
  //         confirmButtonText: "OK",
  //       });

  //       fetchFancyList();
  //       return;
  //     }

  //     if (res.data.status_code === 0) {
  //       Swal.fire({
  //         title: "Oops!",
  //         text: res.data.message,
  //       });
  //       fetchFancyList(); // 👈 Refresh Fancy List (Fail)

  //       return;
  //     }
  //   } catch (err) {
  //     toast.error(err.res.data.message);
  //   } finally {
  //     setBtnLoader("settle_" + f.fancy_id, false);
  //   }
  // };

  const handleSettle = async (f) => {
    const value = inputValues[f._id];

    if (!value || value.trim() === "") {
      toast.warning("⚠️ Please enter a result value first!");
      return;
    }

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
        value: value.trim(),
      });

      // Safety checks
      if (!res) {
        toast.error("❌ No response from server");
        return;
      }

      if (!res.data) {
        toast.error("❌ Invalid response from server");
        return;
      }

      // Success
      if (res.data.status_code === 1) {
        Swal.fire({
          icon: "success",
          title: "✅ Result Declared Successfully!",
          html: `
          <b>Fancy:</b> ${f.team || f.name}<br/>
          <b>Result Value:</b> <span style="color: #28a745; font-weight: bold;">${value}</span>
        `,
          confirmButtonText: "OK",
        });
        setInputValues((prev) => {
          const copy = { ...prev };
          delete copy[f._id];
          return copy;
        });
        fetchFancyList();
        return;
      }

      // ✅ EXACT RESPONSE DIKHAO - Status code 0
      if (res.data.status_code === 0) {
        Swal.fire({
          icon: "error",
          title: "❌ Settlement Failed",
          html: `
          <div style="text-align: left; padding: 10px;">
            <p style="color: #dc3545; font-weight: bold;">${res.data.message || "Error"}</p>
            
            <!-- ✅ EXACT JSON RESPONSE -->
            <div style="background: #1e1e1e; padding: 12px; border-radius: 6px; margin: 10px 0; overflow-x: auto;">
              <pre style="color: #d4d4d4; margin: 0; font-size: 13px; font-family: 'Courier New', monospace;">
            {
              status_code: ${res.data.status_code},
              message: "${res.data.message}",
              error: "${res.data.error || 'N/A'}"
            }
              </pre>
            </div>
            
            <hr/>
            <p style="font-size: 14px; color: #6c757d;">
              <b>Fancy:</b> ${f.team || f.name}<br/>
              <b>Value:</b> ${value}
            </p>
            
            <p style="font-size: 12px; color: #6c757d; margin-top: 10px; background: #fff3cd; padding: 8px; border-radius: 4px;">
              💡 <b>Admin ko bhejein:</b><br/>
              <code style="font-size: 12px; word-break: break-all;">
                Error: ${res.data.error || 'N/A'}
              </code>
            </p>
          </div>
        `,
          confirmButtonText: "OK",
          confirmButtonColor: "#dc3545",
        });

        fetchFancyList();
        return;
      }

    } catch (err) {
      // ✅ CATCH ERROR - Exact response dikhao
      console.error("🔥 Error:", err);

      let errorMessage = "Something went wrong!";
      let statusCode = 0;
      let errorDetail = "";

      if (err.response?.data) {
        statusCode = err.response.data.status_code || 0;
        errorMessage = err.response.data.message || "Server error";
        errorDetail = err.response.data.error || "";
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        icon: "error",
        title: `❌ Error ${statusCode ? `(${statusCode})` : ''}`,
        html: `
        <div style="text-align: left; padding: 10px;">
          <p style="color: #dc3545; font-weight: bold;">${errorMessage}</p>
          
          ${errorDetail ? `
            <div style="background: #1e1e1e; padding: 12px; border-radius: 6px; margin: 10px 0; overflow-x: auto;">
              <pre style="color: #d4d4d4; margin: 0; font-size: 13px; font-family: 'Courier New', monospace;">
            {
              status_code: ${statusCode},
              message: "${errorMessage}",
              error: "${errorDetail}"
            }
              </pre>
            </div>
          ` : ''}
          
          <hr/>
          <p style="font-size: 14px; color: #6c757d;">
            <b>Fancy:</b> ${f.team || f.name}<br/>
            <b>Value:</b> ${value}
          </p>
        </div>
      `,
        confirmButtonText: "OK",
      });

      toast.error(`❌ ${errorMessage}${errorDetail ? `: ${errorDetail}` : ''}`);

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
    if (e.key === "Enter") {
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
      `Fancy: ${f.team} (ID: ${f.fancy_id})`,
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
    <div className="card">
      <div className="card-header d-flex align-items-md-center gap-2 flex-wrap-mobile justify-content-between">
        <h3 className="card-title">Fancy Result Management</h3>
        <div className="gap-2 d-flex">
          <button
            className="btn btn-light"
            onClick={() => (window.location.href = window.location.href)}
          >
            <MdRefresh size={20} />
          </button>

          <button className="btn btn-light" onClick={() => navigate(-1)}>
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
                    className="btn btn-outline-success"
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
                {/* <th>Status</th> */}
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
                  {/* <td>
                    <button
                      className="btn btn-danger btn-sm mt-1"
                      disabled={btnLoading["delete_" + f.fancy_id]}
                      onClick={() => handleDeleteBets(f)}
                    >
                      {btnLoading["delete_" + f.fancy_id]
                        ? "Deleting..."
                        : "Abundent"}
                    </button>
                  </td> */}

                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      // value={inputValues[f.fancy_id] || ""}
                      // onChange={(e) => handleInputChange(f.fancy_id, e.target.value)}
                      value={inputValues[f._id] || ""}
                      onChange={(e) => handleInputChange(f._id, e.target.value)}
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
                      {btnLoading["settle_" + f.fancy_id]
                        ? "Processing..."
                        : "Result"}
                    </button>
                    {/* //view// */}
                    <button
                      className="btn btn-info btn-sm me-1"
                      disabled={btnLoading["view_" + f.fancy_id]}
                      onClick={() => handleViewFancy(f)}
                    >
                      {btnLoading["view_" + f.fancy_id] ? (
                        "..."
                      ) : (
                        <AiFillEye size={18} />
                      )}
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
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Fancy Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
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
                        <th>Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {viewData.map((x, i) => (
                        <tr key={x._id}>
                          <td>{i + 1}</td>
                          <td>
                            {moment(x.created_at).format("DD-MM-YYYY hh:mm A")}
                          </td>
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
                          <td>
                            {x.odd}/{x.total}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(x._id)}
                            >
                              Delete
                            </button>
                          </td>                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer p-1">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FancyResult;
