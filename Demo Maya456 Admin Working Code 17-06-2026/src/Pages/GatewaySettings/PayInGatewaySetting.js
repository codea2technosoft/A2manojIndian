import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
const PayInSetting = () => {
  const [settings, setSettings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // ya 10, jitna per page chahiye

  const ucwords = (str) =>
    str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    id: "",
    name: "",
    min: "",
    max: "",
    status: "",
    type: "",
    upi_id: "",
    file: null,
    account_number: "",
    ifsc_code: "",
    bank_name: "",
  });
  // ✅ Fetch List
  const fetchSettings = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}payinSetting-list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        setSettings(result.data || []);
      } else {
        alert("Failed to fetch settings.");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }
    if (name === "min" || name === "max") {
      if (/^\d{0,6}$/.test(value)) {
        if (parseInt(value) === 0) {
          alert(`${name === "min" ? "Min" : "Max"} must be greater than 0`);
          return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
      } else {
        alert(`${name === "min" ? "Min" : "Max"} must be max 6 digit number`);
      }
      return;
    }
    if (name === "bank_name") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      } else {
        alert("Bank Name should contain only alphabets");
      }
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddClick = () => {
    setForm({
      id: "",
      name: "",
      min: "",
      max: "",
      status: "",
      type: "",
      upi_id: "",
      file: null,
      account_number: "",
      ifsc_code: "",
      bank_name: "",
    });
    setIsEditMode(false);
    setModalOpen(true);
  };
  // ✅ Edit Modal
  const handleEditClick = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}payinSetting-edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await res.json();
      if (result.success && result.data) {
        const d = result.data;
        setForm({
          id: d._id,
          name: d.name,
          min: d.min,
          max: d.max,
          status: d.status,
          type: d.type,
          upi_id: d.upi_id || "",
          file: null,
          account_number: d.account_number || "",
          ifsc_code: d.ifsc_code || "",
          bank_name: d.bank_name || "",
          image: d.image || "",
        });
        setIsEditMode(true);
        setModalOpen(true);
      } else {
        alert("Failed to fetch setting.");
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    }
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!String(form.name).trim()) {
      alert("Name is required");
      return;
    }
    if (
      !String(form.min).trim() ||
      isNaN(form.min) ||
      parseInt(form.min) <= 0 ||
      String(form.min).length > 6
    ) {
      alert("Min should be a positive number (max 6 digits)");
      return;
    }
    if (
      !String(form.max).trim() ||
      isNaN(form.max) ||
      parseInt(form.max) <= 0 ||
      String(form.max).length > 6
    ) {
      alert("Max should be a positive number (max 6 digits)");
      return;
    }
    if (!String(form.status).trim()) {
      alert("Status is required");
      return;
    }
    if (!String(form.type).trim()) {
      alert("Type is required.");
      return;
    }
    if (form.type === "qr_code") {
      if (!String(form.upi_id).trim()) {
        alert("UPI ID is required.");
        return;
      }
      if (!isEditMode && !form.file) {
        alert("QR image is required.");
        return;
      }
    }
    if (form.type === "bank_acc_no") {
      if (!String(form.account_number).trim()) {
        alert("Account number is required.");
        return;
      }
      if (!String(form.ifsc_code).trim()) {
        alert("IFSC code is required.");
        return;
      }
      if (
        !String(form.bank_name).trim() ||
        !/^[a-zA-Z\s]+$/.test(form.bank_name)
      ) {
        alert("Bank name is required and must contain only letters.");
        return;
      }
    }

    const url = isEditMode
      ? `${process.env.REACT_APP_API_URL}/payinSetting-update`
      : `${process.env.REACT_APP_API_URL}/payinSetting-store`;

    const formData = new FormData();

    if (isEditMode) {
      formData.append("id", form.id);
    }

    formData.append("name", form.name.trim());
    formData.append("min", form.min);
    formData.append("max", form.max);
    formData.append("status", form.status);
    formData.append("type", form.type);
    if (form.type === "qr_code") {
      formData.append("upi_id", form.upi_id.trim());
      if (form.file) {
        formData.append("file", form.file);
      }
    }

    if (form.type === "bank_acc_no") {
      formData.append("account_number", form.account_number.trim());
      formData.append("ifsc_code", form.ifsc_code.trim());
      formData.append("bank_name", form.bank_name.trim());
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: isEditMode
            ? "PayIn Setting Updated Successfully!"
            : "PayIn Setting Added Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        setModalOpen(false);
        fetchSettings();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Operation failed.",
        });
      }
    } catch (error) {
      console.error("Error submitting:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/payinSetting-status-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: userId, status: newStatus }), // ✅ Corrected key
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `User status updated to ${newStatus}`,
        });
        fetchSettings();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  // ✅ Filtered Search
  const filteredSettings = settings.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.min?.toString().includes(query) ||
      item.max?.toString().includes(query)
    );
  });
  ///////////////pagination
  const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSettings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">Gateway Settings</h3>
          <div className="d-flex gap-2">
            <div>
              <input
                className="form-control"
                placeholder="Search by name / min / max"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
              <button className="btn btn-primary" onClick={handleAddClick}>
                Add Setting
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
                <th>Min</th>
                <th>Max</th>
                <th>QR Image / Bank Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirstItem + index + 1}.</td>
                    <td>{ucwords(item.name)}</td>
                    <td>{item.min}</td>
                    <td>{item.max}</td>
                    <td>
                      {item.image ? (
                        <div>
                          <img
                            src={`${process.env.REACT_APP_ImageAdmin_URL}/${item.image}`}
                            alt="QR"
                            style={{
                              width: 150,
                              height: 100,
                              objectFit: "contain",
                            }}
                          />
                          <div>
                            <span className="d-block">
                              <b>UPI ID</b>&nbsp;:&nbsp;{item.upi_id}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="d-block">
                            <b>A/C</b>&nbsp;:&nbsp;{item.account_number}
                          </span>
                          <span className="d-block">
                            <b>Bank Name</b>&nbsp;:&nbsp;
                            {ucwords(item.bank_name)}
                          </span>
                          <span className="d-block">
                            <b>IFSC Code</b>&nbsp;:&nbsp;{item.ifsc_code}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* <td>
                  <span
                    className={`badge ${
                      item.status === "active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td> */}

                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`userSwitch-${item._id}`}
                          checked={item.status === "active"}
                          onChange={() =>
                            handleToggleStatus(item._id, item.status)
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`userSwitch-${item._id}`}
                          style={{
                            marginLeft: "10px",
                            fontWeight: "bold",
                            color: item.status === "active" ? "green" : "red",
                          }}
                        >
                          {item.status === "active" ? "ON" : "OFF"}
                        </label>
                      </div>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEditClick(item._id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Modal */}
        {modalOpen && (
          <div className="modal d-block" style={{ background: "#00000080" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditMode ? "Edit" : "Add"} PayIn Setting
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Name */}
                  <label className="form-label">
                    Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                  {/* Min */}
                  <label className="form-label">
                    Min <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="min"
                    className="form-control mb-2"
                    placeholder="Min"
                    value={form.min}
                    min="1"
                    max="999999"
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", ".", " "].includes(e.key) &&
                      e.preventDefault()
                    }
                    onChange={handleChange}
                  />

                  {/* Max */}
                  <label className="form-label">
                    Max <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="max"
                    className="form-control mb-2"
                    placeholder="Max"
                    value={form.max}
                    min="1"
                    max="999999"
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", ".", " "].includes(e.key) &&
                      e.preventDefault()
                    }
                    onChange={handleChange}
                  />

                  {/* Status */}
                  <label className="form-label">
                    Status <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control mb-2"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      Select Status
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  {/* Type */}
                  <label className="form-label">
                    Type <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control mb-2"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      Select Type
                    </option>
                    <option value="qr_code">QR Code</option>
                    <option value="bank_acc_no">Bank Account Number</option>
                  </select>

                  {/* QR Code Fields */}
                  {form.type === "qr_code" && (
                    <>
                      <label className="form-label">UPI ID</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="UPI ID"
                        name="upi_id"
                        value={form.upi_id}
                        onChange={handleChange}
                      />
                      <label className="form-label">QR Image</label>
                      <input
                        type="file"
                        className="form-control mb-2"
                        name="file"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {isEditMode && form.image && (
                        <div className="mb-2 mt-2">
                          <img
                            src={`${process.env.REACT_APP_Image_URL}/${form.image}`}
                            alt="QR"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {/* Bank Account Fields */}
                  {form.type === "bank_acc_no" && (
                    <>
                      <label className="form-label">Account Number</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Account Number"
                        name="account_number"
                        value={form.account_number}
                        onChange={handleChange}
                      />
                      <label className="form-label">IFSC Code</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="IFSC Code"
                        name="ifsc_code"
                        value={form.ifsc_code}
                        onChange={handleChange}
                      />
                      <label className="form-label">Bank Name</label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Bank Name"
                        name="bank_name"
                        value={form.bank_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setForm((prev) => ({
                              ...prev,
                              bank_name: value,
                            }));
                          }
                        }}
                      />
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleSubmit}>
                    {isEditMode ? "Update" : "Submit"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="paginationbutton"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="alllistnumber">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="paginationbutton"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayInSetting;
