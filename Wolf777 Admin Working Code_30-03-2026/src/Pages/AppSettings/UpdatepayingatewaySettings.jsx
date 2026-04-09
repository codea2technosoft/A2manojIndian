import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAllPayingatewaySettings,
  createPayingatewaySettings,
  updatePayingatewaySettings,
  changePayingatewaySettingsStatus,
  viewScanner
} from "../../Server/api";
import { FaEdit, FaEye } from "react-icons/fa";

const paymentTypeMap = {
  online: "Online",
  qr_code: "QR Code",
  upi: "UPI",
  bank_details: "Bank Details",
};

const UpdatepayingatewaySettings = () => {
  const navigate = useNavigate();
  const { id, pay_type, name } = useParams();

  const [scannerName, setScannerName] = useState(name || "");
  const [payinList, setPayinList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form state
  const [form, setForm] = useState({
    id: "",
    name: "",
    scanner_id: id || "",
    scanner_name: name || "",
    type: pay_type || "",
    min_amount: "",
    max_amount: "",
    status: "1",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    upi_id: "",
    qr_data: "",
  });

  /* ================= FETCH SCANNER DETAILS ================= */
  const fetchScannerDetails = async () => {
    try {
      const res = await viewScanner(id);
      if (res.data.success) {
        setScannerName(res.data.data.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= FETCH PAYIN GATEWAY SETTINGS ================= */
  const fetchPayinSettings = async () => {
    try {
      console.log("Fetching with pay_type:", pay_type);

      const res = await getAllPayingatewaySettings(pay_type);

      console.log("API Response:", res);

      if (res.data.success) {
        const updatedList = res.data.data.map((item) => ({
          ...item,
          status: item.status === "1",
        }));
        setPayinList(updatedList);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Error", "Failed to fetch payin settings", "error");
    }
  };

  useEffect(() => {
    if (pay_type) {
      fetchPayinSettings();
    }
  }, [pay_type]);

  useEffect(() => {
    if (id) {
      fetchScannerDetails();
    }
  }, [id]);

  /* ================= HANDLE FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= HANDLE FILE CHANGE ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  /* ================= VIEW DETAILS ================= */
  const handleView = (item) => {
    setViewData(item);
    setViewModalOpen(true);
  };

  /* ================= ADD NEW ================= */
  const handleAdd = () => {
    setForm({
      id: "",
      name: "",
      scanner_id: id,
      scanner_name: scannerName,
      type: pay_type,
      min_amount: "",
      max_amount: "",
      status: "1",
      account_number: "",
      ifsc_code: "",
      bank_name: "",
      upi_id: "",
      qr_data: "",
    });
    setSelectedFile(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    console.log("Editing item:", item);

    setForm({
      id: item._id,
      name: item.name,
      scanner_id: item.scanner_id,
      scanner_name: item.scanner_name,
      type: item.type,
      min_amount: item.min,
      max_amount: item.max,
      status: item.status ? "1" : "0",
      account_number: item.account_number || "",
      ifsc_code: item.ifsc_code || "",
      bank_name: item.bank_name || "",
      upi_id: item.upi_id || "",
      qr_data: item.qr_data || "",
    });
    setSelectedFile(null);
    setIsEdit(true);
    setModalOpen(true);
  };

  /* ================= CHANGE STATUS ================= */
  const handleStatusChange = async (item) => {
    try {
      const newStatus = item.status ? "0" : "1";

      console.log("Changing status for ID:", item._id, "from", item.status, "to", newStatus);

      const res = await changePayingatewaySettingsStatus(item._id, newStatus);

      console.log("Status change response:", res);

      if (res.data.success) {
        Swal.fire("Success", "Status updated successfully", "success");
        fetchPayinSettings();
      } else {
        Swal.fire("Error", res.data.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error("Status change error:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to change status", "error");
    }
  };

  /* ================= SUBMIT FORM ================= */
  const handleSubmit = async () => {
    // Basic Validation
    if (!form.name || !form.min_amount || !form.max_amount || !form.status) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    if (parseFloat(form.min_amount) >= parseFloat(form.max_amount)) {
      return Swal.fire("Error", "Max amount must be greater than min amount", "error");
    }

    // Type-specific validation
    if (pay_type === "bank_details") {
      if (!form.account_number || !form.ifsc_code || !form.bank_name) {
        return Swal.fire("Error", "All bank details are required", "error");
      }
    }

    if (pay_type === "upi" && !form.upi_id) {
      return Swal.fire("Error", "UPI ID is required", "error");
    }

    if (pay_type === "qr_code" && !form.qr_data && !selectedFile) {
      return Swal.fire("Error", "QR Code data or image is required", "error");
    }

    // Create FormData
    const formData = new FormData();

    // Add ID to FormData (important for update)
    formData.append("id", isEdit ? form.id : id);
    formData.append("min", form.min_amount);
    formData.append("max", form.max_amount);
    formData.append("status", form.status);
    formData.append("type", pay_type);
    formData.append("name", form.name);
    formData.append("scanner_id", id);
    formData.append("scanner_name", scannerName);

    // Add type-specific fields
    if (pay_type === "bank_details") {
      formData.append("account_number", form.account_number);
      formData.append("ifsc_code", form.ifsc_code);
      formData.append("bank_name", form.bank_name);
    } else if (pay_type === "upi") {
      formData.append("upi_id", form.upi_id);
    } else if (pay_type === "qr_code") {
      if (form.qr_data) {
        formData.append("upi_id", form.qr_data);
      }
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
    }

    // Debug FormData
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      let res;

      if (isEdit) {
        console.log("Updating with ID:", form.id);
        res = await updatePayingatewaySettings(formData);
      } else {
        console.log("Creating new...");
        res = await createPayingatewaySettings(formData);
      }

      console.log("API Response:", res);

      if (res.data.success) {
        Swal.fire("Success", `Payin Gateway Settings ${isEdit ? "updated" : "created"} successfully`, "success");
        setModalOpen(false);
        setSelectedFile(null);
        fetchPayinSettings();
      } else {
        Swal.fire("Error", res.data.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error", error.response?.data?.message || "Request failed", "error");
    }
  };

  /* ================= RENDER DYNAMIC FIELDS ================= */
  const renderDynamicFields = () => {
    switch (pay_type) {
      case "online":
        return null;

      case "bank_details":
        return (
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Account Number *</label>
              <input
                className="form-control mb-3"
                placeholder="Enter Account Number"
                name="account_number"
                value={form.account_number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">IFSC Code *</label>
              <input
                className="form-control mb-3"
                placeholder="Enter IFSC Code"
                name="ifsc_code"
                value={form.ifsc_code}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Bank Name *</label>
              <input
                className="form-control mb-3"
                placeholder="Enter Bank Name"
                name="bank_name"
                value={form.bank_name}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">UPI ID *</label>
              <input
                className="form-control mb-3"
                placeholder="Enter UPI ID (e.g., example@okhdfcbank)"
                name="upi_id"
                value={form.upi_id}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case "qr_code":
        return (
          <>
            <div className="row">
              <div className="col-md-12">
                <label className="form-label">UPI ID</label>
                <input
                  className="form-control mb-3"
                  placeholder="Enter QR Code URL or Data"
                  name="qr_data"
                  value={form.qr_data}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <label className="form-label">OR Upload QR Code Image</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  name="qr_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <small className="text-success d-block mt-1">
                    Selected: {selectedFile.name}
                  </small>
                )}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  /* ================= RENDER VIEW DETAILS ================= */
  const renderViewDetails = () => {
    if (!viewData) return null;

    return (
      <div className="row">
        <div className="col-md-12">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ width: "200px" }}>ID</th>
                <td>{viewData._id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{viewData.name}</td>
              </tr>
              <tr>
                <th>Payment Type</th>
                <td>{paymentTypeMap[viewData.type] || viewData.type}</td>
              </tr>
              <tr>
                <th>Min Amount</th>
                <td>₹{viewData.min}</td>
              </tr>
              <tr>
                <th>Max Amount</th>
                <td>₹{viewData.max}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <span className={`badge ${viewData.status ? 'bg-success' : 'bg-danger'}`}>
                    {viewData.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>

              {/* Type-specific fields */}
              {viewData.type === "bank_details" && (
                <>
                  <tr>
                    <th>Account Number</th>
                    <td>{viewData.account_number || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>IFSC Code</th>
                    <td>{viewData.ifsc_code || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Bank Name</th>
                    <td>{viewData.bank_name || 'N/A'}</td>
                  </tr>
                </>
              )}

              {viewData.type === "upi" && (
                <tr>
                  <th>UPI ID</th>
                  <td>{viewData.upi_id || 'N/A'}</td>
                </tr>
              )}

              {viewData.type === "qr_code" && (
                <>
                  <tr>
                    <th>QR Code Data</th>
                    <td>{viewData.qr_data || 'N/A'}</td>
                  </tr>
                  {viewData.image && (
                    <tr>
                      <th>QR Code Image</th>
                      <td>
                        <img
                          src={viewData.image}
                          alt="QR Code"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      </td>
                    </tr>
                  )}
                </>
              )}

              <tr>
                <th>Created At</th>
                <td>{new Date(viewData.created_at).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>{new Date(viewData.updated_at).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="card-title text-white mb-0 px-0">
              Payin Gateway Settings - {scannerName}
            </h3>
            <small className="text-white-50">
              Payment Type: {paymentTypeMap[pay_type] || pay_type}
            </small>
          </div>
          <div>
            <button className="backbutton me-2" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="backbutton" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Payment Type</th>
                <th>Min Amount</th>
                <th>Max Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payinList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{paymentTypeMap[item.type] || item.type}</td>
                  <td>₹{item.min}</td>
                  <td>₹{item.max}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={() => handleStatusChange(item)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <div className="gap-2 d-flex">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={(e) => handleView(item)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>

                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
              {payinList.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Payin Gateway Settings found. Click "Add Payin Gateway Settings" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="modal d-block" style={{ background: "#00000080", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  {isEdit ? "Edit" : "Add"} Payin Gateway Settings
                  <small className="text-muted ms-2">
                    ({paymentTypeMap[pay_type]})
                  </small>
                </h5>
                <button className="btn-close" onClick={() => setModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Name *</label>
                    <input
                      className="form-control mb-3"
                      placeholder="Enter gateway name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Payment Type</label>
                    <input
                      className="form-control mb-3"
                      value={paymentTypeMap[pay_type] || pay_type}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Min Amount (₹) *</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      placeholder="Min Amount"
                      name="min_amount"
                      value={form.min_amount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Max Amount (₹) *</label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      placeholder="Max Amount"
                      name="max_amount"
                      value={form.max_amount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-control mb-3"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>

                {renderDynamicFields()}
              </div>
              <div className="modal-footer">
                <button className="btn btn-success border border-1" onClick={handleSubmit}>
                  {isEdit ? "Update" : "Save"}
                </button>
                <button className="btn btn-danger" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewModalOpen && viewData && (
        <div className="modal d-block" style={{ background: "#00000080", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  View Payin Gateway Details
                  <small className="text-muted ms-2">
                    ({paymentTypeMap[viewData.type] || viewData.type})
                  </small>
                </h5>
                <button className="btn-close" onClick={() => setViewModalOpen(false)} />
              </div>
              <div className="modal-body">
                {renderViewDetails()}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary me-2"
                  onClick={() => {
                    setViewModalOpen(false);
                    handleEdit(viewData);
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => setViewModalOpen(false)}>
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

export default UpdatepayingatewaySettings;