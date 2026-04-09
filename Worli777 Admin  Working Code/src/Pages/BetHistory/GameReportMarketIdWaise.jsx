import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";

const GameReportMarketIdWaise = () => {
  const { marketId } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const markettypedata = searchParams.get("markettype");

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [marketTypeFilter, setMarketTypeFilter] = useState("");

  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const perPage = 10;

  const [date, setDate] = useState(
    dateParam ? moment(dateParam, "DD-MM-YYYY").toDate() : null
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    return moment(dateStr).format("DD-MM-YYYY");
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchData(currentPage);
    fetchMarketlist(markettypedata);
  }, [currentPage]);
  const [AllMarketList, setAllMarketList] = useState([]);
  const [FilterMarketname, setFilterMarketname] = useState("");
  const handleChangeMarketName = (e) => {
    const value = e.target.value;
    // alert(value);
    setFilterMarketname(value);
  };
  const handleFilter = (e) => {
    fetchData();
  };
  const fetchData = async () => {
    // alert(markettypedata);
    if (!date || !markettypedata) return;
    setLoading(true);
    try {
      const body = {
        page: currentPage,
        date: moment(date).format("DD-MM-YYYY"),
        market_type: markettypedata,
        FilterMarketname: FilterMarketname,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}game-report-marketIdwaise`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();
      if (result.success === "1") {
        setData(result.data || []);
        setFilteredData(result.data || []);
        const total = Number(result.totalRecords || 0);
        setTotalRecords(total);
        // setTotalPages(Math.ceil(total / perPage));
        setTotalPages(Number(data.totalNumberPage) || 1);
      } else {
        setData([]);
        setFilteredData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("API Error:", error);
      setData([]);
      setFilteredData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  const fetchMarketlist = async (value) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/market-list-all?market_type=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const betsData = data.data || [];
        setAllMarketList(betsData);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex align-items-center justify-content-between w-100">
          <h3 className="card-title text-white">
            Game Report Market Name Wise
          </h3>

          <div className="button_design withdraw_pending d-flex gap-2">
            <div className="d-flex gap-2 justify-content-end align-items-center">
              <div className="searchdeteails">
                <select
                  name="user_name"
                  className="form-control"
                  value={FilterMarketname}
                  onChange={handleChangeMarketName}
                >
                  <option value="">Market</option>
                  {AllMarketList.map((user, index) => (
                    <option key={index} value={user.market_id}>
                      {user.market_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="searchdeteails align-self-end">
                <button className="btn btn-primary" onClick={handleFilter}>
                  Apply Filter
                </button>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card-body">
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Total Win Amount</th>
                <th>Total Win Count</th>
                <th>Total Loss Amount</th>
                <th>Total Loss Count</th>
                <th>P&L</th>
                <th>Market ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * perPage + index + 1}</td>
                    <td>₹{item.winTotalAmount}</td>
                    <td>{item.winTotalCount}</td>
                    <td>₹{item.lossTotalAmount}</td>
                    <td>{item.lossTotalCount}</td>
                    <td
                      style={{
                        color: item.profitLoss <= 0 ? "red" : "green",
                      }}
                    >
                      {item.profitLoss}
                    </td>
                    <td>{item?.market_id}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        // onClick={() =>
                        //   navigate(
                        //     `/game-report-marketIdAndMarketTypeAll/date=${dateParam}?market_type=${markettypedata}&marketid=${item.market_id}`
                        //   )
                        // }

                        onClick={() =>
                          navigate(
                            `/game_report_marketIdAndMarketTypeAll?date=${dateParam}&market_type=${markettypedata}&marketid=${item.market_id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredData.length > 0 && totalPages > 0 && (
            <ul className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
              <li
                className="paginationbutton btn btn-secondary"
                onClick={handlePrev}
                style={{
                  cursor: "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </li>
              <span className="alllistnumber">
                Page {currentPage} of {totalPages}
              </span>
              <li
                className="paginationbutton btn btn-secondary"
                onClick={handleNext}
                style={{
                  cursor: "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameReportMarketIdWaise;
