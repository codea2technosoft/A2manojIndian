import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  getFancySetteledList,
  getFancyResultList,
  rollbackFancyNow
} from "../../Server/api";
import Swal from "sweetalert2";
import { Navigate } from "react-router";
function FancyResultList() {
  const [fancyResultList, setfancyResultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
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

        const pages = Math.ceil(
          res.data.totalRecords / res.data.limit
        );
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
        Swal.fire(
          "Success ",
          res.data?.uamount,
          "success"
        );
      } else {
        Swal.fire(
          res.data?.uamount,
        );
      }
    } catch (err) {
  Swal.fire(
    "Error",
    err?.response?.data?.uamount,
    
  );
}
finally {
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
  console.log("item",item.event_id)
};

  const handlePageClick = (pageNo) => {
    setPage(pageNo);
  };

  return (
    <div className="marketname">
      <div className="card">
        <div className="card-body">
          <div className="card mt-3">
            <div className="card-header bg-color-black">
              <h5 className="card-title text-white mb-0">
                 Fancy Result List
              </h5>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead>
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
                      <td colSpan="8" className="text-center">Loading...</td>
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
                            className="btn btn-warning btn-sm"
                            onClick={() => handelView(item)}
                          >
                            {btnLoading[item._id] ? "Processing..." : "view"}
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
                      className={`paginationnumber ${pageNo === page ? "active" : ""
                        }`}
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

export default FancyResultList;