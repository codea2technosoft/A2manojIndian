import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function VideoList() {
  const [videoList, setVideoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: "", link: "", title: "" }); // Added title
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔍 Filtered video list based on search term
  const filteredVideos = videoList.filter(
    (video) =>
      // video.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Added title to search
      video.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchVideoList();
  }, []);
  const fetchVideoList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}video-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setVideoList(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: false,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}video-delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: id }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setVideoList((prev) => prev.filter((video) => video._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Video deleted successfully!",
            confirmButtonColor: "#28a745",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: data.message || "Failed to delete video!",
          });
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong while deleting.",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      // Include title in the payload
      const payload = {
        // type: formData.type,
        link: formData.link,
        title: formData.title // Added title to payload
      };
      
      const res = await fetch(`${process.env.REACT_APP_API_URL}video-store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Video added successfully!",
          confirmButtonColor: "#28a745",
        });
        setShowModal(false);
        setFormData({ type: "", link: "", title: "" }); // Reset with title
        fetchVideoList();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: data.message || "Something went wrong!",
        });
      }
    } catch (err) {
      console.error("Add error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
      });
    }
  };

  ////Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  return (
    <div>
      <div className="card mt-3">
        <div className="card-header bg-color-black">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title text-white">Created Videos List</h3>
            <div className="d-flex justify-content-end gap-2 align-items-center" >
              <input
                type="text"
                className="form-control"
                placeholder="Search by Type, Title & Link"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-success"
              >
                <FaPlus /> Add
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* 🔍 Search input below Add button */}

          {/* 🔹 Video Table */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.</th>
                  {/* <th>Type</th> */}
                  <th>Title</th>
                  <th className="w-75">Link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((video, index) => (
                    <tr key={video._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      {/* <td>
                        {video.type.charAt(0).toUpperCase() +
                          video.type.slice(1)}
                      </td> */}
                      <td>
                        {video.title}
                      </td>
                      <td className="w-75">
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {video.link}
                        </a>
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete</Tooltip>}
                        >
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(video._id)}
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No videos found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
        {/* Previous Button */}
        <button
          className="paginationbutton"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Centered Page Info */}
        <div className="d-flex justify-content-between gap-2 align-items-center alllistnumber">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </div>

        {/* Next Button */}
        <button
          className="paginationbutton"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
        </div>
      </div>

      {/* 🔹 Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Video</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* <div className="mb-3">
                    <label>Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="kannada">Kannada</option>
                      <option value="telugu">Telugu</option>
                    </select>
                  </div> */}
                  <div className="mb-3">
                    <label>Video Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter video title"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoList;