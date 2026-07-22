import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { getUserSettledBets } from "../Server/api";

function MatchMarketBets() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  // const fetchBets = async (page = pagination.page) => {
  //   if (!userId) {
  //     Swal.fire("Error", "User ID not found", "error");
  //     navigate(-1);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await getUserSettledBets({
  //       user_id: userId,
  //       page: page,
  //       limit: pagination.limit
  //     });

  //     if (response.data.status_code === 1) {
  //       setBets(response.data.data);
  //       setPagination(prev => ({
  //         ...prev,
  //         page: page,
  //       }));
  //     } else {
  //       Swal.fire("Error", response.data.message || "Failed to fetch bets", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bets:", error);
  //     Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchBets();
  // }, [userId]);

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1) {
  //     fetchBets(newPage);
  //   }
  // };

  // Calculate summary statistics
  const calculateSummary = () => {
    let totalStake = 0;
    let totalCommission = 0;
    let settledCount = 0;
    let pendingCount = 0;

    bets.forEach(bet => {
      totalStake += bet.stake || 0;
      totalCommission += bet.comissionAmount || 0;
      if (bet.is_settled === 1) {
        settledCount++;
      } else {
        pendingCount++;
      }
    });

    return { totalStake, totalCommission, settledCount, pendingCount };
  };

  const { totalStake, totalCommission, settledCount, pendingCount } = calculateSummary();

  return (
    <>
      <section className="main-inner-outer py-4">
        <section className="account-table">
          <div className="container-fluid">
            <div className="db-sec d-flex justify-content-between align-items-center mb-2">
              <h2 className="common-heading">Show Bets</h2>

              <button type="button" className="green-btn btn btn-primary">
                Close
              </button>
            </div>

            <div className="responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Sports</th>
                    <th scope="col">Match Name</th>
                    <th scope="col">Client</th>
                    <th scope="col">Type</th>
                    <th scope="col">Selection</th>
                    <th scope="col">Odds</th>
                    <th scope="col">Stake</th>
                    <th scope="col">Place Time</th>
                    <th scope="col">IP</th>
                    <th scope="col">PnL</th>
                    <th scope="col">Bet Type</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="text-start">cricket</td>
                    <td>Northamptonshire v Gloucestershire</td>
                    <td>shaik</td>
                    <td>lay</td>
                    <td>Northamptonshire</td>
                    <td>0.16</td>
                    <td>15000</td>
                    <td>7/15/2026, 11:15:16 PM</td>
                    <td>106.202.106.206</td>
                    <td className="text-end">
                      <span className="text-danger">-(2400)</span>
                    </td>
                    <td>lay</td>
                  </tr>

                  <tr>
                    <td className="text-start">cricket</td>
                    <td>Northamptonshire v Gloucestershire</td>
                    <td>shaik</td>
                    <td>lay</td>
                    <td>Northamptonshire</td>
                    <td>0.16</td>
                    <td>8000</td>
                    <td>7/15/2026, 11:15:26 PM</td>
                    <td>106.202.106.206</td>
                    <td className="text-end">
                      <span className="text-danger">-(1280)</span>
                    </td>
                    <td>lay</td>
                  </tr>

                  <tr>
                    <td className="text-start">cricket</td>
                    <td>Northamptonshire v Gloucestershire</td>
                    <td>shaik</td>
                    <td>back</td>
                    <td>Northamptonshire</td>
                    <td>0.18</td>
                    <td>3000</td>
                    <td>7/15/2026, 11:20:57 PM</td>
                    <td>106.202.106.206</td>
                    <td className="text-end">
                      <span className="text-danger">-(3000)</span>
                    </td>
                    <td>back</td>
                  </tr>

                  {/* Isi tarah baaki saari rows bhi paste kar dijiye */}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default MatchMarketBets;