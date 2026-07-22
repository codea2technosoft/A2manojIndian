import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Common/Loader";
import { getProfitLossDetail } from "../../Server/api";

const ProfitLossDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDetailData();
  }, [eventId]);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      const res = await getProfitLossDetail({ event_id: eventId });
      const response = res.data;
      if (response.success) {
        setDetailData(response.data || []);
        setTotalAmount(response.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch detail data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

  // Handle S button click - Navigate to Market Summary page
  const handleMarketSummaryClick = (marketId) => {
    navigate(`/profit-loss-summary-market/${marketId}`);
  };

  // Handle B button click - Navigate to Bet History page
  const handleBetHistoryClick = (marketId) => {
    navigate(`/bet-history/${marketId}`);
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Detail - Event ID: {eventId}</h5>
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>USERNAME</th>
                  <th>MARKET</th>
                  <th className="text-end">COMM IN</th>
                  <th className="text-end">COMM OUT</th>
                  <th className="text-end">AMOUNT</th>
                  <th className="text-end">TOTAL</th>
                  <th className="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <Loader />
                      <p>Loading details...</p>
                    </td>
                  </tr>
                ) : detailData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  detailData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sr_no || index + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.market}</td>
                      <td className="text-end">{formatNumber(item.comm_in)}</td>
                      <td className="text-end">{formatNumber(item.comm_out)}</td>
                      <td className="text-end">{formatNumber(item.amount)}</td>
                      <td className="text-end">{formatNumber(item.total)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          {/* S Button - Market Summary */}
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleMarketSummaryClick(item.market_id)}
                            title="View Market Summary"
                          >
                            S
                          </button>
                          {/* B Button - Bet History */}
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleBetHistoryClick(item.market_id)}
                            title="View Bet History"
                          >
                            B
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="table-warning fw-bold">
                <tr>
                  <td colSpan="6" className="text-end">Total</td>
                  <td className="text-end">{formatNumber(totalAmount)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitLossDetail;