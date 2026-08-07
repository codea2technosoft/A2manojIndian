import React, { useEffect, useState } from "react";
import {
  FaFootballBall,
  FaDice,
  FaTableTennis,
  FaHorse,
  FaChessKnight,
  FaDragon,
} from "react-icons/fa";
import Loader from "../../Common/Loader";

function Multimarket() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API Call Example
    setTimeout(() => {
      setMarkets([
        {
          id: 1,
          title: "Cricket Betting",
          icon: <FaFootballBall />,
          totalMatch: 24,
          activeUsers: 1456,
          status: "Live",
        },
        {
          id: 2,
          title: "Casino Games",
          icon: <FaDice />,
          totalMatch: 18,
          activeUsers: 896,
          status: "Popular",
        },
        {
          id: 3,
          title: "Tennis Market",
          icon: <FaTableTennis />,
          totalMatch: 12,
          activeUsers: 542,
          status: "Live",
        },
        {
          id: 4,
          title: "Horse Racing",
          icon: <FaHorse />,
          totalMatch: 8,
          activeUsers: 315,
          status: "Upcoming",
        },
      ]);

      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="market-grid">
          {/* {markets.map((item) => (
        <div className="market-card" key={item.id}>
          <div className="market-top">
            <div className="market-icon">{item.icon}</div>
            <span className={`status ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </div>

          <h4>{item.title}</h4>

          <div className="market-info">
            <div>
              <span>Markets</span>
              <strong>{item.totalMatch}</strong>
            </div>

            <div>
              <span>Players</span>
              <strong>{item.activeUsers}</strong>
            </div>
          </div>

          <button>Open Market</button>
        </div>
      ))} */}
        </div>
      </div>
    </div>
  );
}

export default Multimarket;
