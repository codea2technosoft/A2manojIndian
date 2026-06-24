import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

function NoticeBoardManagement() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null); // ✅ NEW STATE
  const baseUrl = process.env.REACT_APP_Image_URL;

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => {
    setShow(true);
    setIsEditMode(false);
  };

  const handleShowEdit = (item) => {
    setShow(true);
    setIsEditMode(true);
    setCurrentEditId(item._id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setDate(item.date || "");
    setCurrentItem(item); // ✅ Store current item
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setDate("");
    setIsEditMode(false);
    setCurrentEditId(null);
    setCurrentItem(null); // ✅ Reset current item
  };

  // ✅ Fetch Notifications
  const fetchList = async () => {
    try {
      setLoadingNotifications(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}noticeboard-list?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data?.success === "1" && Array.isArray(data.data)) {
        setList(data.data);
        setTotalItems(data.totalcount || 0);
      } else {
        Swal.fire("Error", "Invalid notification response", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Fetch error", "error");
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [currentPage]);

  // ✅ Delete Notification
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.REACT_APP_API_URL}noticeboard-delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: id }),
        });
        const data = await res.json();
        if (data?.success === "1") {
          Swal.fire("Deleted!", "Notification deleted successfully.", "success");
          fetchList();
        } else {
          Swal.fire("Error", data?.message || "Something went wrong", "error");
        }
      } catch (error) {
        Swal.fire("Error", error.message || "Delete error", "error");
      }
    }
  };

  // ✅ Handle File Upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // ✅ Submit/Update Notice
  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire("Validation", "Please enter a title", "info");
      return;
    }
    if (!description.trim()) {
      Swal.fire("Validation", "Please enter a description", "info");
      return;
    }
    if (!date) {
      Swal.fire("Validation", "Please select a date", "info");
      return;
    }

    try {
      setLoadingSubmit(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);

      if (file) {
        formData.append('file', file);
      }

      let url = `${process.env.REACT_APP_API_URL}noticeboard-store`;

      if (isEditMode && currentEditId) {
        url = `${process.env.REACT_APP_API_URL}noticeboard-update`;
        formData.append('id', currentEditId);
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data?.success === "1") {
        Swal.fire(
          "Success",
          isEditMode ? "Notice updated successfully." : "Notice submitted successfully.",
          "success"
        );
        fetchList();
        resetForm();
        handleClose();
      } else {
        Swal.fire("Error", data?.message || "Submission failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Submit error", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="betlists mt-3 position-relative">
      {(loadingNotifications || loadingSubmit) && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="card">
        {/* <div className="card-header bg-color-black d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">Notice Boards</h3>
          <Button variant="primary" onClick={handleShow}>
            Add New Notice
          </Button>
        </div> */}

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  {/* <th>Sr.</th> */}
                  {/* <th>Title</th> */}
                  <th>Notice Board Details</th>
                  {/* <th>Date</th> 
                  <th>File</th>  */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingNotifications ? (
                  <tr>
                    <td className="text-center">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td className="text-center text-danger fw-bold">
                      No notices found.
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item._id || index}>
                      {/* <td>{(currentPage - 1) * limit + index + 1}</td> */}
                      {/* <td>{item.title || "N/A"}</td>  */}
                      <td>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.description || "N/A" }}
                          style={{
                            /* 📄 A4 WIDTH ONLY (height auto rahegi) */
                            width: "210mm",
                            margin: "20px auto",
                            padding: "25mm",

                            /* 🧾 text flow fix */
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",

                            /* 👀 readability */
                            textAlign: "justify",
                            fontSize: "17px",
                            lineHeight: "1.8",
                            letterSpacing: "0.3px",
                            wordSpacing: "1px",
                            fontFamily: "Georgia, 'Times New Roman', serif",

                            /* 🎨 paper look */
                            background: "#ffffff",
                            color: "#111",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            borderRadius: "6px"
                          }}
                        />
                      </td>





                      {/* <td>{item.date || "N/A"}</td> */}
                      {/* <td>
                        {item.file ? (
                          <a href={`${baseUrl}/uploads/notice_board/${item.file}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
                            View File
                          </a>
                        ) : (
                          "No File"
                        )}
                      </td>  */}
                      <td>
                        {/* EDIT BUTTON - ENABLED */}
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleShowEdit(item)}
                        >
                          Update
                        </button>
                        {/* <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Add/Edit */}
          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? "Update New Notice Board" : "Add New Notice"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <div className="mb-3">
                <label className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notice title"
                  required
                />
              </div> */}

              <div className="mb-3">
                <label className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter notice description"
                  required
                />
                <small className="text-muted">
                  You can use basic HTML tags: &lt;b&gt;, &lt;i&gt;, &lt;u&gt;, &lt;br&gt;, &lt;p&gt;
                </small>
              </div>

              {/* <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div> */}

                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Upload File (Optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                  />

                  {isEditMode && currentItem?.file && (
                    <div className="mt-2">
                      <small className="text-muted d-block">
                        Current File:
                        <a
                          href={`${baseUrl}/${currentItem.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ms-1"
                        >
                          View File
                        </a>
                      </small>
                      <small className="text-muted d-block">
                        New file upload will replace existing file
                      </small>
                    </div>
                  )}

                  <small className="text-muted">
                    {file ? `Selected: ${file.name}` : "No file chosen"}
                  </small>
                </div> 
              </div>*/}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loadingSubmit}
              >
                {loadingSubmit ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  isEditMode ? "Update" : "Submit"
                )}
              </Button>
              <Button variant="danger" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default NoticeBoardManagement;