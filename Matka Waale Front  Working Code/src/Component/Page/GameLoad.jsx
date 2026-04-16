import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function GameLoad() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameLoadUrl, setGameLoadUrl] = useState("");
  const { market_id, user_id } = useParams();

  useEffect(() => {
    if (market_id && user_id) {
      const url = `https://admin.matkawaale.com/gameload-userwise-front/${market_id}/${user_id}`;
      setGameLoadUrl(url);
    } else {
      setIsLoading(false);
    }
  }, [market_id, user_id]);

  return (
    <div className="mt-5" style={{ position: "relative" }}>
      
      {/* ✅ Loader (always on top) */}
      {isLoading && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}

      {/* ✅ Always render iframe */}
      {gameLoadUrl && (
        <iframe
          src={gameLoadUrl}
          style={{
            width: "100%",
            height: "100vh",
            border: "none",
            visibility: isLoading ? "hidden" : "visible", // 👈 hide until loaded
          }}
          onLoad={() => {
            console.log("✅ Iframe fully loaded");
            setIsLoading(false);
          }}
          title={`Game - ${market_id}`}
        />
      )}

      {/* ❌ Error case */}
      {!gameLoadUrl && !isLoading && (
        <div style={{ textAlign: "center", color: "red", padding: "50px" }}>
          <h3>Error loading game</h3>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      )}
    </div>
  );
}