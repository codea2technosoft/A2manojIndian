import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  getAllScanners,
  createScannersetting,
  updateScanner,
  viewScanner,
  changeScannerStatus,
} from "../../Server/api";
import { FaEye } from "react-icons/fa";

const paymentTypeMap = {
  online: "Online",
  qr_code: "QR Code",
  upi: "UPI",
  bank_details: "Bank Details",
};

const Scannersetting = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", status: "", pay_type: "" });
  const [viewData, setViewData] = useState(null);

  /* ================= FETCH LIST ================= */
  const fetchList = async () => {
    try {
      const res = await getAllScanners();
      console.log("API Response:", res.data); // Debug

      if (res.data.success) {
        // API mein "type" hai, isliye "type" use karo
        const updatedList = res.data.data.map((item) => ({
          ...item,
          pay_type: item.pay_type, // "type" ko "pay_type" mein map karo
          status: item.status === "1",
        }));
        setList(updatedList);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch scanners", "error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    setForm({ id: "", name: "", status: "", pay_type: "" });
    setIsEdit(false);
    setModalOpen(true);
  };

  /* ================= VIEW ================= */
  const handleView = (id, pay_type, name) => {
    console.log("Navigating with:", { id, pay_type, name }); // Debug
    // Ab pay_type properly pass ho raha hai
    navigate(`/updatepayin-gateway-settings/${id}/${pay_type}/${encodeURIComponent(name)}`);
  };

  /* ================= CHANGE STATUS ================= */
  const handleStatusChange = async (id) => {
    try {
      const res = await changeScannerStatus(id);
      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");
        setList((prevList) =>
          prevList.map((item) => ({
            ...item,
            status: item._id === id,
          }))
        );

        if (viewData) {
          setViewData((prev) => ({
            ...prev,
            status: prev._id === id,
          }));
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to change status", "error");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.status || !form.pay_type) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    // API "type" expect karta hai, isliye "type" bhejo
    const payload = {
      name: form.name,
      status: form.status,
      type: form.pay_type, // 👈 YAHAN "type" USE KARO, "pay_type" NAHI
    };

    try {
      const res = isEdit
        ? await updateScanner(form.id, payload)
        : await createScannersetting(payload);

      if (res.data.success) {
        Swal.fire("Success", "Saved successfully", "success");
        setModalOpen(false);
        fetchList();
      } else {
        Swal.fire("Error", res.data.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.response?.data?.message || "Request failed", "error");
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white mb-0">Gateway Setting</h3>
          {/* <button className="backbutton" onClick={handleAdd}>
            Add Gateway Setting
          </button> */}
        </div>
      </div>

      <div className="card-body table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr key={item._id}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{paymentTypeMap[item.pay_type] || item.pay_type}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusChange(item._id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => handleView(item._id, item.pay_type, item.name)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewModal && viewData && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Scanner Details</h5>
                <button className="btn-close" onClick={() => setViewModal(false)} />
              </div>
              <div className="modal-body">
                <p><b>Name:</b> {viewData.name}</p>
                <p><b>Payment Type:</b> {paymentTypeMap[viewData.pay_type]}</p>
                <p>
                  <b>Status:</b>{" "}
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={viewData.status}
                      onChange={() => handleStatusChange(viewData._id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </p>
                <p><b>Created:</b> {new Date(viewData.created_at).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => setViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="modal d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEdit ? "Edit" : "Add"} Scanner</h5>
                <button className="btn-close" onClick={() => setModalOpen(false)} />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />

                <select
                  className="form-control mb-2"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="0">Inactive</option>
                  <option value="1">Active</option>
                </select>

                <select
                  className="form-control mb-2"
                  name="pay_type"
                  value={form.pay_type}
                  onChange={handleChange}
                >
                  <option value="">SELECT</option>
                  <option value="online">Online</option>
                  <option value="qr_code">QR Code</option>
                  <option value="upi">UPI</option>
                  <option value="bank_details">Bank Details</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSubmit}>Save</button>
                <button className="btn btn-danger" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scannersetting;