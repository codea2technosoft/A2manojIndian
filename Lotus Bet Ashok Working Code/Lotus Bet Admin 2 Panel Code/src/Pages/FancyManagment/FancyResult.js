import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFancyList,
  manageFancyResult,
  settledFancyNow,
  rollbackFancyNow,
} from "../../Server/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const FancyResult = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [fancies, setFancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState({});
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    if (eventId) fetchFancyList();
  }, [eventId]);

  // Fetch Fancy List
  const fetchFancyList = async () => {
    try {
      setLoading(true);
      const res = await getFancyList(eventId);

      if (res.data.success) {
        setFancies(res.data.data);
      } else {
        toast.error("No fancy list found");
      }
    } catch (err) {
      toast.error("Error fetching fancies");
    } finally {
      setLoading(false);
    }
  };

  // Badge for Fancy Status
  const getStatusBadge = (f) => {
    if (f.is_rollback) return <span className="badge bg-danger">Rollback</span>;
    // if (f.is_settled) return <span className="badge bg-primary">Settled</span>;
    // if (f.result_val) return <span className="badge bg-success">Result Declared</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  const handleInputChange = (id, value) =>
    setInputValues((prev) => ({ ...prev, [id]: value }));

  // Update Button Loader
  const setBtnLoader = (id, val) => {
    setBtnLoading((prev) => ({ ...prev, [id]: val }));
  };

  // Confirm Popup
  const confirmAction = async (title, text) => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed",
    });
  };

  // UPDATE RESULT
  const handleUpdateResult = async (f) => {
    const result_val = inputValues[f.fancy_id];
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
  // const handleSettle = async (f) => {
  //   const value = inputValues[f.fancy_id];
  //   if (!value) return toast.warning("Enter value before settling!");

  //   const ok = await confirmAction(
  //     "Settle This Fancy?",
  //     `This will settle all bets for Fancy: ${f.team}`
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
  //       toast.success("Fancy Settled Successfully");
  //       fetchFancyList();
  //     } else toast.error(res.data.message);
  //   } catch {
  //     toast.error("Error settling fancy");
  //   } finally {
  //     setBtnLoader("settle_" + f.fancy_id, false);
  //   }
  // };

  // // ROLLBACK
  // const handleRollback = async (f) => {
  //   const ok = await confirmAction(
  //     "Rollback Settlement?",
  //     `Fancy: ${f.team} (ID: ${f.fancy_id})`
  //   );
  //   if (!ok.isConfirmed) return;

  //   try {
  //     setBtnLoader("rollback_" + f.fancy_id, true);
  //     const res = await rollbackFancyNow({
  //       id: f.fancy_id,
  //       fancy_id: f.fancy_id,
  //       event_id: f.event_id,
  //     });

  //     if (res.data.status_code === 1) {
  //       toast.success("Rollback Successful");
  //       fetchFancyList();
  //     } else toast.error(res.data.message);
  //   } catch {
  //     toast.error("Error performing rollback");
  //   } finally {
  //     setBtnLoader("rollback_" + f.fancy_id, false);
  //   }
  // };

  return (
    <div className="card mt-3">
      <div className="card-header bg-dark text-white d-flex justify-content-between">
        <h5 className="mb-0">Fancy Result Management</h5>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="card-body">
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
                <th>ID</th>
                <th>Stake</th>
                <th>Odd</th>
                <th>Status</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {fancies.map((f, i) => (
                <tr key={f._id}>
                  <td>{i + 1}</td>
                  <td>{f.team}</td>
                  <td>{f.fancy_id}</td>
                  <td>{f.stake}</td>
                  <td>{f.odd}</td>

                  <td>{getStatusBadge(f)}</td>

                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={inputValues[f.fancy_id] || ""}
                      onChange={(e) => handleInputChange(f.fancy_id, e.target.value)}
                      placeholder="Enter value"
                    />
                  </td>

                  <td style={{ width: "260px" }}>
                    {/* UPDATE RESULT */}
                    <button
                      className="btn btn-success btn-sm me-1"
                      disabled={btnLoading[f.fancy_id]}
                      onClick={() => handleUpdateResult(f)}
                    >
                      {btnLoading[f.fancy_id] ? "..." : "Result"}
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
    </div>
  );
};

export default FancyResult;
