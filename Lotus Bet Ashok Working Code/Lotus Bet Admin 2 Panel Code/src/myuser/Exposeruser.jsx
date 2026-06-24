import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Exposeruser = () => {
  const [exposureData, setExposureData] = useState([]);
  const [loading, setLoading] = useState(false);

  // match_status mapping
  const getMatchStatusText = (status) => {
    switch (status) {
      case "1":
        return "Upcoming";
      case "2":
        return "In Play";
      case "3":
        return "Finished";
      default:
        return "-";
    }
  };

  // date formatter
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("exposer_user_id");
    if (!userId) return;

    setLoading(true);

    axios
      .post(
        // "http://192.168.1.4:9002/api/admin/get-user-exposure",
        `${process.env.REACT_APP_API_URL}/get-user-exposure`,
        { user_id: userId },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        if (res.data.status_code === 1) {
          setExposureData(res.data.data || []);
        }
      })
      .catch((err) => {
        console.error("Exposure API Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-3">
 <div
  className="d-flex align-items-center mb-3"
  style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}
>
  <h4 className="mb-0" style={{ fontWeight: 600 }}>
    User Exposure
  </h4>

  {/* Back ko end me push karne ke liye */}
  <h4
    className="mb-0 text-primary"
    style={{
      marginLeft: "auto",   // 🔥 yahi magic hai
      cursor: "pointer",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }}
    onClick={() => navigate(-1)}
  >
    ⬅ Back
  </h4>
</div>


      {loading && <p>Loading...</p>}

      {!loading && exposureData.length === 0 && (
        <p>No exposure data found</p>
      )}

      {!loading && exposureData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-sm text-center">
            <thead className="table-dark">
              <tr>
                {/* <th>Event</th> */}
                {/* <th>Market ID</th> */}
                <th>Team</th>
                <th>Bet On</th>
                <th>Odd</th>
                <th>Amount</th>
                <th>Liability</th>
                <th>Bet Type</th>
                <th>Match Status</th>
                <th>Created At</th>
              </tr>
            </thead>

         <tbody>
  {exposureData.map((item) => {
    const liability =
      item.bet_on === "lay"
        ? -item.fancy_withdraw
        : item.fancy_deposit;

    return (
      <tr key={item._id}>
        {/* Event / Fancy */}
        <td>{item.team}</td>

        {/* Bet On */}
        <td className={item.bet_on === "back" ? "text-success" : "text-danger"}>
          {item.bet_on === "back" ? "Yes" : "No"}
        </td>

        {/* Odd / Total */}
        <td>{item.odd} / {item.total}</td>

        {/* Stake */}
        <td>{item.stake}</td>

        {/* Liability */}
        <td className={liability < 0 ? "text-danger" : "text-success"}>
          {liability}
        </td>

        {/* Bet Type */}
        <td>{item.bet_type}</td>

        {/* Match Status */}
        <td>{getMatchStatusText(item.match_status)}</td>

        {/* Created At */}
        <td>{formatDate(item.created_at)}</td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Exposeruser;
