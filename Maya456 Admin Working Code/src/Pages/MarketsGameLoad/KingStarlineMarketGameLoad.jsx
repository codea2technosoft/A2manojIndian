// src/Pages/GamePage.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt } from "react-icons/md";

const MainMarketGameLoad = () => {
  useEffect(() => {
    // Game initialization logic can go here
    fetchMarkets();
    fetchGameLoad();
  }, []);
  const [mainMarkets, setMainMarkets] = useState([]);
  const [PanaGameLoad, setPanaGameLoad] = useState([]);
  const [loader, setLoaders] = useState(false);

  const [SingleDigitGameLoad, setSingleDigitGameLoad] = useState([]);
  const [JodiGameLoad, setJodiGameLoad] = useState([]);
  const [finalResultHalfSangamAGameLoad, setfinalResultHalfSangamAGameLoad] =
    useState([]);
  const [finalResultHalfSangamBGameLoad, setfinalResultHalfSangamBGameLoad] =
    useState([]);
  const [finalResultFullSangamGameLoad, setfinalResultFullSangamGameLoad] =
    useState([]);
  const fetchMarkets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/market-list-gameload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ market_type: "kingstarline" }),
        }
      );
      const data = await res.json();
      const markets = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [data];
      setMainMarkets(markets);
    } catch (err) {
      console.error("Error fetching market list:", err);
    } finally {
    }
  };
  const fetchGameLoad = async () => {};
  const [selectedMarket, setSelectedMarket] = useState("");

  const handleSearch = async () => {
    try {
      setLoaders(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/kingstarline-market-gameLoad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            market_id: selectedMarket,
          }),
        }
      );
      const data = await res.json();
      setLoaders(false);
      if (data.success == "1") {
        setPanaGameLoad(data.pana);
        setSingleDigitGameLoad(data.sigleDigit);
        setJodiGameLoad(data.jodi);
        setfinalResultHalfSangamAGameLoad(data.finalResultHalfSangamA);
        setfinalResultHalfSangamBGameLoad(data.finalResultHalfSangamB);
        setfinalResultFullSangamGameLoad(data.finalResultFullSangam);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (err) {
      console.error("Error fetching market list:", err);
    } finally {
    }
  };
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };
  return (
    <div className="box_number_deisgn mt-3">
      {loader && (
        <div className="loaderdesign ">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/loader.gif`}
            alt="logo"
            className="logo-lg"
            height="100"
          />
        </div>
      )}
      <div className="card ">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">King Starline Game Load</h3>
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {fillter && (
            <div className="d-flex gap-2 p-3 px-0 align-items-center">
              <div className="selectbox w-100">
                {/* <label>Select Game</label> */}
                {/* <select
              name="gamename"
              className="form-select"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
            >
              <option value="">Select Game</option>
              {mainMarkets.map((game, index) => (
                <option key={index} value={game.market_id}>
                  {game.market_name}
                </option>
              ))}
            </select> */}
                <select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Game</option>
                  {mainMarkets.map((game, index) => (
                    <option key={index} value={game.market_id}>
                      {game.market_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="selectbox">
            <select
              name="gamename"
              id=""
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="game">Select Game</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div> */}
              <div className="search_design">
                <button className="search_button" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          )}
          <div className="card">
            <div className="card-header header_design">
              <div className="d-flex justify-content-between align-items-center">
                <div className="card-title text-white">Digit</div>
              </div>
            </div>
            <div className="card-body">
              <div className="box_flex">
                {Array.isArray(SingleDigitGameLoad) &&
                SingleDigitGameLoad.length > 0 ? (
                  SingleDigitGameLoad.map((item, index) => (
                    <div key={index} className="box_design">
                      <div
                        className={` ${
                          item.amount > 0 ? "green_border" : "box_number"
                        }`}
                      >
                        {item.bet_key}
                        <span> {item.amount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No data found</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header header_design">
              <div className="d-flex justify-content-between align-items-center">
                <div className="card-title text-white">Pana</div>
              </div>
            </div>
            <div className="card-body">
              <div className="box_flex">
                {Array.isArray(PanaGameLoad) && PanaGameLoad.length > 0 ? (
                  PanaGameLoad.map((item, index) => (
                    <div key={index} className="box_design">
                      <div
                        className={` ${
                          item.amount > 0 ? "green_border" : "box_number"
                        }`}
                      >
                        {item.bet_key}
                        <span> {item.amount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No data found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMarketGameLoad;
