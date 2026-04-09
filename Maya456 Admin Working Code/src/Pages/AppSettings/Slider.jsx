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
    file: null,
  });
  // ✅ Fetch List
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}slider-list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        // console.warn(result.data);
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
  };
  const handleAddClick = () => {
    setForm({
      file: null,
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
  const handleDeleteClick = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}slider-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Delete Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchSettings();
      } else {
        alert("Failed to fetch setting.");
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    }
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!isEditMode && !form.file) {
      alert("Slider image is required.");
      return;
    }

    const url = isEditMode
      ? `${process.env.REACT_APP_API_URL}/payinSetting-update`
      : `${process.env.REACT_APP_API_URL}/slider-store`;

    const formData = new FormData();

    if (form.file) {
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const fileExtension = form.file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only PNG, JPG, and JPEG files are allowed.");
        return;
      }
      formData.append("file", form.file);
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
          <h3 className="card-title text-white">Slider Setting</h3>
          <div>
            <button className="btn btn-primary" onClick={handleAddClick}>
              Add Slider
            </button>
          </div>
        </div>

        {/* <div className="d-flex gap-2">
          <div>
            <input
              className="form-control"
              placeholder="Search by name / min / max"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Slider Image</th>
                {/* <th>Status</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.length > 0 ? (
                settings.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirstItem + index + 1}.</td>
                    <td>
                      <div>
                        <img
                          src={`${process.env.REACT_APP_Image_URL}/${item.image}`}
                          alt="QR"
                          style={{
                            width: 150,
                            height: 100,
                            objectFit: "contain",
                          }}
                        />
                        <div></div>
                      </div>
                    </td>

                    {/* <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`userSwitch-${item._id}`}
                      checked={item.status === "active"}
                      onChange={() => handleToggleStatus(item._id, item.status)}
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
                </td> */}

                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        Delete
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
                    {isEditMode ? "Edit" : "Add"} Slider Image
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Status */}
                  {/* <label className="form-label">
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
                </select> */}

                  {/* QR Code Fields */}

                  <label className="form-label">Image (JPG JPEG PNG)</label>
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
                  {/* Bank Account Fields */}
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
        {/* <div className="d-flex justify-content-between align-items-center mt-3">
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
      </div> */}
      </div>
    </div>
  );
};

export default PayInSetting;
