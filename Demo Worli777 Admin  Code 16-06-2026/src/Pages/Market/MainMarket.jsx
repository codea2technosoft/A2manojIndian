import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { MdFilterListAlt } from "react-icons/md";

export default function MainMarket() {
  const [formData, setFormData] = useState({
    market_type: "mainmarket",
    market_name: "",
    open_time: "",
    close_time: "",
    open_result_time: "",
    close_result_time: "",
    close_before_minute: "",
    show_in_app: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [mainMarkets, setMainMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [showModal, setShowModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [market, setmarket] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  useEffect(() => {
    fetchMarkets(currentPage);
  }, [currentPage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const resetForm = () => {
    setFormData({
      market_type: "mainmarket",
      market_name: "",
      open_time: "",
      close_time: "",
      open_result_time: "",
      close_result_time: "",
      close_before_minute: "",
      show_in_app: "",
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "market_name",
      "open_time",
      "close_time",
      "open_result_time",
      "close_result_time",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill in all required fields.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/add-market`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create market");

      await res.json();

      Swal.fire({
        icon: "success",
        title: "Market Added",
        text: "The market has been successfully added!",
        customClass: {
          popup: "custom-swal-popup",
        },
        timer: 10000,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      // resetForm();
      window.location.reload();
      fetchMarkets();
    } catch (err) {
      console.error("Submit Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save market.",
      });
    }
  };

  const handleViewEdit = async (market, mode) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/market-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: market._id }),
      });

      const result = await res.json();
      const marketDataArray = Array.isArray(result?.data)
        ? result.data
        : [result.data];
      const marketData = marketDataArray[0];
      if (!marketData) throw new Error("No data returned");
      const defaultStructure = {
        _id: marketData._id,
        open_time: "",
        market_name: "",
        close_time: "",
        open_result_time: "",
        close_result_time: "",
        close_before_minute: "",
        show_in_app: "",
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
      const filledData = {
        ...defaultStructure,
        ...marketData,
        id: marketData._id || market._id,
      };

      console.log("Filled Data for Modal:", filledData);
      setSelectedMarket(filledData);
      setEditFormData(filledData);
      setModalMode(mode);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching market view:", err);
      alert("Failed to fetch market.");
    }
  };
  const saveEditedMarket = async () => {
    try {
      const token = localStorage.getItem("token");
      const { _id, ...payload } = editFormData;
      const bodyPayload = {
        id: _id,
        // market_name: payload.market_name || "",
        open_time: payload.open_time || "",
        close_time: payload.close_time || "",
        open_result_time: payload.open_result_time || "",
        close_result_time: payload.close_result_time || "",
        close_before_minute: payload.close_before_minute || "",
        show_in_app: payload.show_in_app || "",
        monday: payload.monday || false,
        tuesday: payload.tuesday || false,
        wednesday: payload.wednesday || false,
        thursday: payload.thursday || false,
        friday: payload.friday || false,
        saturday: payload.saturday || false,
        sunday: payload.sunday || false,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/market-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyPayload),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      Swal.fire({
        icon: "success",
        title: "Market Updated",
        text: "The market has been updated successfully",
        customClass: {
          popup: "custom-swal-popup",
        },
        timer: 10000,
        timerProgressBar: true,
        showConfirmButton: true,
      });
      closeModal();
      window.location.reload();
      fetchMarkets();
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating the market.",
      });
    }
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedMarket(null);
    setEditFormData({});
    setModalMode("view");
  };
  const formatTo12Hour = (time) => {
    if (!time) return "-";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterMarketname, setFilterMarketname] = useState("");
  // Search handler

  const handleSearchChangeMarketname = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMarketname(value);
  };

  const handleFilter = (e) => {
    fetchMarkets();
  };
  const fetchMarkets = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/market-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          market_type: "mainmarket",
          marketname: FilterMarketname,
          page,
        }),
      });
      const data = await res.json();
      if (data.message == "Not Found") {
        setMainMarkets([]);
        setTotalPages(0)
      } else {
        const markets = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [data];
        setMainMarkets(markets);
        setTotalPages(Number(data.pagination.totalPages) || 1);
      }

    } catch (err) {
      console.error("Error fetching market list:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-3">
      <div className="row gy-2">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white">Create Main Market</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <label>Market Type *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="market_type"
                        value={formData.market_type}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <label>Market Name</label>
                      <input
                        type="text"
                        name="market_name"
                        placeholder="Enter Market Name"
                        value={formData.market_name}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label>Open Time</label>
                    <input
                      type="time"
                      name="open_time"
                      value={formData.open_time}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Close Time</label>
                    <input
                      type="time"
                      name="close_time"
                      value={formData.close_time}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Open Result Time</label>
                    <input
                      type="time"
                      name="open_result_time"
                      value={formData.open_result_time}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Close Result Time</label>
                    <input
                      type="time"
                      name="close_result_time"
                      value={formData.close_result_time}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="mt-2">
                      <label>Close Before Minute</label>
                      {/* <input
                        type="text"
                        name="close_before_minute"
                        value={formData.close_before_minute}
                        onChange={handleChange}
                        className="form-control"
                        required
                      /> */}

                      <input
                        type="text"
                        name="close_before_minute"
                        value={formData.close_before_minute}
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        onKeyDown={(e) => {
                          const blockedKeys = [
                            "e",
                            "E",
                            "+",
                            "-",
                            ".",
                            ",",
                            "*",
                            "/",
                            "\\",
                            "=",
                            "(",
                            ")",
                            "[",
                            "]",
                            "{",
                            "}",
                            "~",
                            "`",
                            "!",
                            "@",
                            "#",
                            "$",
                            "%",
                            "^",
                            "&",
                            "_",
                            "|",
                            "<",
                            ">",
                            "?",
                          ];
                          if (blockedKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="form-control"
                        required
                        placeholder="Enter close minutes"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mt-2">
                      <label>Show In App</label>
                      <select
                        name="show_in_app"
                        value={formData.show_in_app}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <h6>Days</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <label key={day} className="form-check form-switch">
                        <input
                          type="checkbox"
                          name={day}
                          checked={formData[day]}
                          onChange={handleChange}
                          className="form-check-input"
                        />
                        <span className="ms-1 text-capitalize">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2 button_all_align">
                  <button className="btn btn-success" type="submit">
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">

              Main Market List
              <div className="buttonlist">
                <div className="fillterbutton" onClick={fillterdata}>
                  <MdFilterListAlt /> Filter
                </div>
              </div>
            </div>
            {fillter && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                      <div className="form_latest_design w-100">
                        <div className="label">
                          <label htmlFor="">Market Name</label>
                        </div>
                        <input
                          type="text"
                          name="user_name"
                          className="form-control"
                          value={FilterMarketname}
                          onChange={handleSearchChangeMarketname}
                        />
                      </div>

                      <div className="form_latest_design">
                        <button
                          className="btn btn-info text-white"
                          onClick={handleFilter} // Or any function you want to trigger
                        >
                          Filter
                        </button>
                      </div>
                      {/* <di className="form_latest_design"v>
                  <button className="btn btn-secondary">helo</button>
                </di> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="card-body table-responsive">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Market Name</th>
                          <th>Market ID</th>
                          <th>Open</th>
                          <th>Close</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mainMarkets.length > 0 ? (
                          mainMarkets.map((mkt, i) => (
                            <tr key={mkt._id}>
                              {/* Serial Number */}
                              <td>{(currentPage - 1) * limit + i + 1}</td>

                              <td>
                                {mkt.market_name
                                  ? mkt.market_name.charAt(0).toUpperCase() +
                                  mkt.market_name.slice(1).toLowerCase()
                                  : "-"}
                              </td>
                              <td>{mkt.market_id || "-"}</td>
                              <td>{mkt.open_time || "-"}</td>
                              <td>{mkt.close_time || "-"}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning me-2"
                                  onClick={() => handleViewEdit(mkt, "edit")}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => handleViewEdit(mkt, "view")}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">
                              No markets available.
                            </td>
                          </tr>
                        )}
                      </tbody>

                    </table>
                  </div>
                  {/* Pagination Controls */}
                  <nav>
                    <ul className="pagination d-flex justify-content-between">
                      <li
                        className={`pagination ${currentPage === 1 ? "disabled" : ""
                          }`}
                      >
                        <span onClick={goPrev}>Previous</span>
                      </li>

                      <li>
                        <div className="d-flex gap-2 alllistnumber">
                          Page
                          {[...Array(totalPages)].map((_, idx) => (
                            <div key={idx}>
                              <div
                                className={` ${currentPage === idx + 1 ? "active" : ""
                                  }`}
                              >
                                <div onClick={() => goToPage(idx + 1)}>
                                  {idx + 1}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </li>
                      <li
                        className={`pagination ${currentPage === totalPages ? "disabled" : ""
                          }`}
                      >
                        <span onClick={goNext}>Next</span>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMarket && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "edit" ? "Update Main Market" : "View Main Market"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Market Name</label>
                      <input
                        className="form-control"
                        name="market_name"
                        placeholder="Market Name"
                        value={
                          editFormData.market_name
                            ? editFormData.market_name.charAt(0).toUpperCase() +
                            editFormData.market_name.slice(1).toLowerCase()
                            : ""
                        }
                        onChange={handleEditChange}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Open</label>
                      <input
                        type="time"
                        className="form-control"
                        name="open_time"
                        value={editFormData.open_time}
                        onChange={handleEditChange}
                        disabled={modalMode === "view"}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Close</label>
                      <input
                        type="time"
                        className="form-control"
                        name="close_time"
                        value={editFormData.close_time}
                        onChange={handleEditChange}
                        disabled={modalMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Open Result Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="open_result_time"
                        value={editFormData.open_result_time}
                        onChange={handleEditChange}
                        disabled={modalMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Close Result Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="close_result_time"
                        value={editFormData.close_result_time}
                        onChange={handleEditChange}
                        disabled={modalMode === "view"}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Close Before Minute</label>
                      <input
                        type="text"
                        className="form-control"
                        name="close_before_minute"
                        value={editFormData.close_before_minute}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,2}$/.test(value)) {
                            handleEditChange(e);
                          }
                        }}
                        onKeyDown={(e) => {
                          const blockedKeys = [
                            "e",
                            "E",
                            "+",
                            "-",
                            ".",
                            ",",
                            "*",
                            "/",
                            "\\",
                            "=",
                            "(",
                            ")",
                            "[",
                            "]",
                            "{",
                            "}",
                            "~",
                            "`",
                            "!",
                            "@",
                            "#",
                            "$",
                            "%",
                            "^",
                            "&",
                            "_",
                            "|",
                            "<",
                            ">",
                            "?",
                          ];
                          if (blockedKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        disabled={modalMode === "view"}
                        placeholder="0–99 only"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Show in App</label>
                      <select
                        className="form-control"
                        name="show_in_app"
                        value={editFormData.show_in_app}
                        onChange={handleEditChange}
                        disabled={modalMode === "view"}
                      >
                        <option value="">Choose</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-2"></div>
                <div className="mt-3">
                  <h6>Days</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <label key={day} className="form-check form-switch">
                        <input
                          type="checkbox"
                          name={day}
                          checked={!!editFormData[day]}
                          onChange={handleEditChange}
                          disabled={modalMode === "view"}
                          className="form-check-input"
                        />
                        <span className="ms-1 text-capitalize">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {modalMode === "edit" ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={saveEditedMarket}
                    >
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={closeModal}>
                      Cancel
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
