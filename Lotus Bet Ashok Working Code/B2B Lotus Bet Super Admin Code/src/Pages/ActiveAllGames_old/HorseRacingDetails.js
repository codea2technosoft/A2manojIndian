import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Common/Loader";
import { Col, Row } from "react-bootstrap";

const HorseRacingDetails = () => {
  const navigate = useNavigate();
  const { eventId, marketId } = useParams();
  const location = useLocation();
  const navigationPayload = location.state?.payload || {};

  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [userBets, setUserBets] = useState([]);

  useEffect(() => {
    if (eventId && marketId) {
      fetchMarketDetails();
    }
  }, [eventId, marketId]);

  const fetchMarketDetails = async () => {
    try {
      setLoading(true);
      // ✅ Replace with actual API call
      // const response = await getHorseRacingMarketDetails({
      //   event_id: eventId,
      //   market_id: marketId,
      //   sport_id: "7",
      // });
      // if (response.data && response.data.success) {
      //   setMarketData(response.data.data);
      //   setUserBets(response.data.user_bets || []);
      // } else {
      //   toast.error(response.data?.message || "Failed to fetch market details");
      // }

      // ⚠️ DUMMY DATA (remove when API ready)
      setTimeout(() => {
        setMarketData({
          event_name: "Yarmouth",
          date: "8th Jul",
          time: "08/07/2026 06:45 PM",
          in_play: false,
          race_name: "1M NOV STKS",
          runners: [
            { name: "RANEEM", back: 1.83, lay: 1.86 },
            { name: "STARLIGHT LASS", back: 18.09, lay: 29.13 },
            { name: "SAKURA IMPACT", back: 2.2, lay: 2.24 },
            { name: "DREAM VEGA", back: 7.74, lay: 12.92 },
          ],
        });
        setUserBets([]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching market details:", error);
      toast.error("Failed to fetch market details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-body text-center">
        <Loader />
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">No data found for this race</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card event_detail">
        <div className="card-body">
          <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0">
              {marketData.event_name} {marketData.date}
              {marketData.in_play && (
                <span className="badge bg-danger ms-2">In Play</span>
              )}
            </h4>
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>

          {/* {marketData.time && (
            <div className="mb-2 text-muted small">{marketData.time}</div>
          )}

          {marketData.race_name && (
            <h5 className="mb-3">{marketData.race_name}</h5>
          )} */}

          <Row className="mt-2">
            <Col md={6}>
              <div className="table-responsive">
                <table className="table bet_table">
                  <thead className="table-dark">
                    <tr>
                      <th className="fw-bold" style={{ width: "60%" }}>
                        6f Claim
                      </th>
                      <th className="text-center" style={{ width: "20%" }}>
                        BACK
                      </th>
                      <th className="text-center" style={{ width: "20%" }}>
                        LAY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.runners && marketData.runners.length > 0 ? (
                      marketData.runners.map((runner, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{runner.name}</strong>
                          </td>
                          <td className="text-center back_bet">
                            {runner.back}
                          </td>
                          <td className="text-center lay_bet">{runner.lay}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No runners available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>

            <Col md={6}>
              {/* <h5 className="mb-3">User Bets</h5> */}
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>User Name</th>
                      <th>Selection</th>
                      <th>Rate</th>
                      <th>User Stake</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBets && userBets.length > 0 ? (
                      userBets.map((bet, idx) => (
                        <tr key={idx}>
                          <td>{bet.user || "-"}</td>
                          <td>{bet.selection || "-"}</td>
                          <td>{bet.rate || "-"}</td>
                          <td>{bet.stake || "-"}</td>
                          <td>{bet.time || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <h6 className="py-5">No Data Found</h6>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HorseRacingDetails;
