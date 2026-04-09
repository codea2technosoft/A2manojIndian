import React, { useState, useEffect } from "react";
import moment from "moment";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFancyResultList, rollbackFancyNow1 } from "../../Server/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
function ViewfancyResultList() {
  const navigate = useNavigate();
  const { event_id } = useParams();
  const [btnLoading, setBtnLoading] = useState({});
  const [fancyResultList, setfancyResultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    if (event_id) {
      fetcfancyResultList();
    }
  }, [page, event_id]);

  const fetcfancyResultList = async () => {
    try {
      setLoading(true);
      const payload = { event_id, page, limit };

      const res = await getFancyResultList(payload);

      if (res.data.status_code === 1) {
        setfancyResultList(res.data.data || []);
        setTotal(res.data.totalRecords || 0);
        const pages = Math.ceil(res.data.totalRecords / res.data.limit);
        setTotalPages(pages);
      }

    } catch (err) {
      console.error("Fancy result list error", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async (title, htmlMessage) => {
    return await Swal.fire({
      title: title,
      html: htmlMessage,   // HTML now renders
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed",
      cancelButtonText: "Cancel",
    });
  };


const handleRollback = async (f) => {
  const ok = await confirmAction(
    "Rollback Settlement?",
    `Fancy Name: <b>${f.name || "-"}</b><br/>Fancy ID: <b>${f.fancy_id}</b>`
  );
  if (!ok.isConfirmed) return;

  try {
    setBtnLoading((prev) => ({
      ...prev,
      ["rollback_" + f.fancy_id]: true,
    }));

    const payload = {
      fancy_id: f.fancy_id,
      event_id: event_id,
    };

    const res = await rollbackFancyNow1(payload);

    // -----------------------------
    // 👉 Status Code Handling
    // -----------------------------
  if (res.data?.success === true) {

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
        confirmButtonColor: "#3085d6",
      });

      fetcfancyResultList();
    }
    else if (res.data?.success === false) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        html: res.data.message,
        confirmButtonColor: "#d33",
      });
    } 
    else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error("Error performing rollback");
  } finally {
    setBtnLoading((prev) => ({
      ...prev,
      ["rollback_" + f.fancy_id]: false,
    }));
  }
};



  const getPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageClick = (pageNo) => {
    setPage(pageNo);
  };

  return (
    <div className="marketname">
      <div className="card">
        <div className="card-body">
          <div className="card mt-3">
            <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0">Fancy Result List</h3>
              <div>
                <button
                  className="refeshbutton"
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </button>
                {/* <button className="btn btn-outline-light" onClick={() => setFilter(prev => !prev)}>
              <MdFilterListAlt /> Filter
            </button> */}
              </div>
            </div>







            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    {/* <th>Date&Time</th> */}
                    {/* <th>Match Name</th> */}
                    <th>Market Name</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Action</th>

                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center">Loading...</td>
                    </tr>
                  ) : fancyResultList.length > 0 ? (
                    fancyResultList.map((item, index) => (
                      <tr key={item._id}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        {/* <td>{moment(item.created_at).format("DD-MM-YYYY HH:mm")}</td> */}

                        {/* UPDATED FIELD */}
                        <td>{item.team || "-"}</td>
                        <td>
                          {item.is_settled === 1 ? (
                            <span className="text-success">Settled</span>
                          ) : (
                            <span className="text-warning">Pending</span>
                          )}
                        </td>
                        <td>{item.result_val || "-"}</td>


                        <td style={{ width: "260px" }}>


                          <button
                            className="btn btn-warning btn-sm"
                            disabled={btnLoading["rollback_" + item.fancy_id]}
                            onClick={() => handleRollback(item)}
                          >
                            {btnLoading["rollback_" + item.fancy_id] ? "..." : "Rollback"}
                          </button>


                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">No Data Found</td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">

              <div className="sohwingallentries">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total}
              </div>

              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={handlePrev}
                  className="d-flex justify-content-center align-items-center"
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((pageNo) => (
                    <div
                      key={pageNo}
                      className={`paginationnumber ${pageNo === page ? "active" : ""}`}
                      onClick={() => handlePageClick(pageNo)}
                    >
                      {pageNo}
                    </div>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={handleNext}
                  className="d-flex justify-content-center align-items-center"
                >
                  <MdOutlineKeyboardArrowRight />
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ViewfancyResultList;
