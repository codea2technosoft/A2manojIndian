import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import {
  getFancySetteledList,
  getFancyResultList,
  rollbackFancyNow,
} from "../../Server/api";
import Swal from "sweetalert2";
import { Navigate } from "react-router";
import Loader from "../../Common/Loader";

function FancyResultList() {
  const [fancyResultList, setfancyResultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [btnLoading, setBtnLoading] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetcfancyResultList(page);
  }, [page]);
  const setBtnLoader = (id, val) => {
    setBtnLoading((prev) => ({ ...prev, [id]: val }));
  };

  const fetcfancyResultList = async () => {
    try {
      setLoading(true);

      const res = await getFancySetteledList({
        page,
        limit,
      });
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

  const handleRollback = async (item) => {
    const confirm = await Swal.fire({
      title: "Rollback Result?",
      text: item.full_team_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Rollback",
    });

    if (!confirm.isConfirmed) return;

    try {
      setBtnLoader(item._id, true);

      const res = await rollbackFancyNow({
        fancy_id: item.fancy_id,
        event_id: item.event_id,
      });
      if (res.data?.status_code === 1) {
        Swal.fire("Success ", res.data?.uamount, "success");
      } else {
        Swal.fire(res.data?.uamount);
      }
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.uamount);
    } finally {
      setBtnLoader(item._id, false);
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
  const handelView = (item) => {
    navigate(`/view-fancy-result-list/${item.event_id}`);
    console.log("item", item.event_id);
  };

  const handlePageClick = (pageNo) => {
    setPage(pageNo);
  };

  return (
    <div className="marketname">
      <div className="card">
        <div className="card-header bg-primary-yellow">
          <h3 className="card-title mb-0">Fancy Result List</h3>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Sr.No.</th>
                {/* <th>Date&Time</th> */}
                {/* <th>Match Name</th> */}
                <th>Market Name</th>
                {/* <th>Status</th> */}
                {/* <th>Result</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="table_loader">
                    <div className="py-5 text-center">
                    <Loader />
                    </div>
                  </td>
                </tr>
              ) : fancyResultList.length > 0 ? (
                fancyResultList.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    {/* <td>{moment(item.created_at).format("DD-MM-YYYY HH:mm")}</td> */}
                    <td>{item.event_name || "-"}</td>
                    {/* <td>{item.name}</td> */}
                    {/* <td>
                          {item.is_settled === 1 ? (
                            <span className="text-success">Settled</span>
                          ) : (
                            <span className="text-warning">Pending</span>
                          )}
                        </td> */}
                    {/* <td>{item.result_val || "-"}</td> */}
                    <td>
                      {/* <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleRollback(item)}
                          >
                            {btnLoading[item._id] ? "Processing..." : "Rollback"}
                          </button> */}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handelView(item)}
                      >
                        {btnLoading[item._id] ? "Processing..." : "view"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 0 && (
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="paginationall d-flex align-items-center gap-1">
              <button disabled={currentPage === 1} onClick={handlePrev}>
                <MdKeyboardDoubleArrowLeft /> Previous
              </button>

              <div className="d-flex gap-1">
                {getPageNumbers().map((page) => (
                  <div
                    key={page}
                    className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </div>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                Next <MdKeyboardDoubleArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FancyResultList;
