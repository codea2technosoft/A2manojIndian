import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

function IdeaSubmitList() {
  const [videoList, setVideoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchVideoList(currentPage);
  }, [currentPage]);

  const fetchVideoList = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}idea-submit-list?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data.success === "1") {
        setVideoList(data.data);
        setTotalPages(Number(data.pagination.totalPages) || 1);
      } else {
        setVideoList([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleShow = (fullIdea) => {
    setSelectedIdea(fullIdea);
    setShow(true);
  };

  const handleClose = () => setShow(false);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}idea-submit-delete?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.success === "1") {
          // alert("Deleted successfully");
          // Refresh list
          fetchVideoList(currentPage);
        } else {
          alert("Failed to delete");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <>
      <div className="card mt-3">
        <div className="card-header bg-color-black">
          <h3 className="card-title text-white">Idea Submit List</h3>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Name</th>
                  <th>Idea</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {videoList.length > 0 ? (
                  videoList.map((video, index) => (
                    <tr key={video._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{video.username}</td>
                      <td style={{ textAlign: "start" }}>
                        {video.idea.length > 10 ? (
                          <>
                            {video.idea.slice(0, 10)}...
                            <span
                              style={{
                                color: "blue",
                                cursor: "pointer",
                                marginLeft: "5px",
                              }}
                              onClick={() => handleShow(video.idea)}
                            >
                              Read More
                            </span>
                          </>
                        ) : (
                          video.idea
                        )}
                      </td>
                      <td>
                        <button
                          class="btn btn-primary"
                          onClick={() => handleDelete(video._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No videos found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {videoList.length > 0 && totalPages > 0 && (
            <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
              <button
                className="paginationbutton"
                disabled={currentPage === 1}
                onClick={handlePrev}
              >
                Previous
              </button>
              <span className="alllistnumber">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="paginationbutton"
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}

      {/* Popup */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Full Idea</Modal.Title>
        </Modal.Header>
        <Modal.Body>{selectedIdea}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default IdeaSubmitList;
