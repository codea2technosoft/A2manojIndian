import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import Toast from "../../User/Toast";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  getFancySecondList,
  changeFancyStatusNew,
  manageFancyResult,
  getFancyStatusList

} from "../../Server/api";

function FancyList() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [fancies, setFancies] = useState([]);
    const [fancyStatusMap, setFancyStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: "", type: "" });
  const [resultModal, setResultModal] = useState({ show: false, fancy: null, result_val: "" });

  const fetchFancyList = async () => {
    try {
      setLoading(true);
      const response = await getFancySecondList(eventId);

      if (response.data.success && Array.isArray(response.data.data)) {


        setFancies(response.data.fancy_data);
      } else {
        showToast("No fancy list found", "error");
      }
    } catch (error) {
      console.error("Error fetching fancy list:", error);
      showToast("Server error while fetching fancy list", error);
    } finally {
      setLoading(false);
    }
  };

const fetchFancyStatus = async () => {
  try {
    const response = await getFancyStatusList(eventId);

    if (response.data.success) {
 const statusData = response.data.data || [];

 const statusMap = {};
        statusData.forEach(item => {
          statusMap[item.fancy_id] = {
            status: item.status,
            fc_status: item.fc_status || "INACTIVE"
          };
        });

     setFancyStatusMap(statusMap);
       setFancies(prevFancies => 
          prevFancies.map(fancy => {
            const statusInfo = statusMap[fancy.SelectionId];
            if (statusInfo) {
              return {
                ...fancy,
                status: parseInt(statusInfo.status),
                GameStatus: statusInfo.fc_status
              };
            }
            return fancy;
          })
        );
        
      showToast(response.data.message, "success");

    } else {
      showToast(response.data.message, "error");
    }
  } catch (error) {
    console.error("Fancy status fetch error:", error);
    showToast("Server error while fetching fancy status", "error");
  }
};


  // useEffect(() => {
  //   fetchFancyList();
  //   fetchFancyStatus();
  // }, [eventId]);
  useEffect(() => {
    // यह ब्लॉक बदलें
    const loadData = async () => {
      await fetchFancyList();
      await fetchFancyStatus();
    };
    loadData();
  }, [eventId]);
  const handleFancyStatusChange = async (item) => {
    try {
      const currentStatus = item.GameStatus === "ACTIVE" ? 1 : 0;
      const newStatus = currentStatus === 1 ? 0 : 1;
      const payload = {
        status: newStatus,
        SelectionId: item.SelectionId,
        RunnerName: item.RunnerName,
        LayPrice1: item.LayPrice1,
        LaySize1: item.LaySize1,
        BackPrice1: item.BackPrice1,
        BackSize1: item.BackSize1,
        GameStatus: newStatus === 1 ? "ACTIVE" : "INACTIVE",
        event_id: eventId,
      };
      const response = await changeFancyStatusNew(payload);
      if (response.data.success) {
        showToast(response.data.message);

        setFancies((prev) =>
          prev.map((f) =>
            f.SelectionId === item.SelectionId ? {
              ...f,
               status: newStatus,
              GameStatus: newStatus === 1 ? "ACTIVE" : "INACTIVE"
            } : f
          )
        );
         fetchFancyStatus();
      } else {
        showToast(response.data.message);
      }
    } catch (error) {
      console.error("Error updating fancy status:", error);
      showToast("Server error while updating status", error);
    }
  };

  const handleSetResult = (fancy) => {
    setResultModal({
      show: true,
      fancy: fancy,
      result_val: ""
    });
  };

  const handleSubmitResult = async () => {
    try {
      const { fancy, result_val } = resultModal;
      if (!result_val) {
        showToast("Please enter result value", "error");
        return;
      }

      const payload = {
        fancy_id: fancy.SelectionId,
        event_id: eventId,
        result_val: result_val,
        runner_name: fancy.RunnerName
      };
      const response = await manageFancyResult(payload);
      if (response.data.success) {
        showToast("Result updated successfully");
        setResultModal({ show: false, fancy: null, result_val: "" });
        fetchFancyList();
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.error("Error updating fancy result:", error);
      showToast("Server error while updating result", "error");
    }
  };

  const getStatusBadge = (status) => {
    const isActive = status === 1;
    return (
      <span
        className={`fw-bold ${isActive ? "text-success" : "text-danger"} me-2`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };
  const handleRefresh = async () => {
    await fetchFancyList();
    await fetchFancyStatus();
  };


  if (loading)
    return (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading fancy list...</p>
      </div>
    );

  return (
    <div className="mt-3">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      {resultModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Set Fancy Result</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setResultModal({ show: false, fancy: null, result_val: "" })}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Fancy Name:</strong> {resultModal.fancy?.RunnerName}</p>
                <div className="mb-3">
                  <label className="form-label">Result Value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={resultModal.result_val}
                    onChange={(e) => setResultModal({ ...resultModal, result_val: e.target.value })}
                    placeholder="Enter result"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setResultModal({ show: false, fancy: null, result_val: "" })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitResult}
                >
                  Submit Result
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-dark text-white d-flex  justify-content-between align-items-center">
          <h3 className="card-title mb-0">Fancy Status Management</h3>
          <div className="d-flex  gap-2">


             <button
    className="btn btn-outline-light"
    onClick={handleRefresh}  // fetchFancyList की जगह handleRefresh
  >
    <MdFilterListAlt /> Refresh All
  </button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sr</th>
                <th>Fancy Name</th>
                {/* <th>Back / Lay</th> */}
                {/* <th>Game Status</th> */}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fancies.length > 0 ? (
                fancies.map((item, index) => (
                  <tr key={item.SelectionId || index}>
                    <td>{index + 1}</td>
                    <td>{item.RunnerName}</td>
                    {/* <td>
                      B: {item.BackPrice1} ({item.BackSize1}) | L:{" "}
                      {item.LayPrice1} ({item.LaySize1})
                    </td> */}
                    {/* <td>{item.GameStatus}</td> */}
                    <td>{getStatusBadge(item.GameStatus === "ACTIVE" ? 1 : 0)}</td>
                    <td>
                      <button
                        className={`btn ${item.GameStatus === "ACTIVE" ? "btn-danger" : "btn-success"}`}
                        onClick={() => handleFancyStatusChange(item)}
                      >
                        {item.GameStatus === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No fancies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FancyList;
