import React from "react";
import "./CasinoPage.css";

const games = [
  {
    title: "Aviator",
    img: "http://files.worldcasinoonline.com/Document/Game/Aviator_1697879631441.088.png",
    provider: "SPRIBE",
  },
  {
    title: "Dice",
    img: "http://files.worldcasinoonline.com/Document/Game/Dice_1697884484520.5564.png",
    provider: "SPRIBE",
  },
  {
    title: "Goal",
    img: "http://files.worldcasinoonline.com/Document/Game/Goal_1697884517643.9062.png",
    provider: "SPRIBE",
  },
  {
    title: "Hilo",
    img: "http://files.worldcasinoonline.com/Document/Game/Hilo_1697885689406.6013.png",
    provider: "SPRIBE",
  },
  {
    title: "Hotline",
    img: "http://files.worldcasinoonline.com/Document/Game/Hotline_1697885801970.04.png",
    provider: "SPRIBE",
  },
  {
    title: "Keno",
    img: "http://files.worldcasinoonline.com/Document/Game/Keno_1697886431028.6714.png",
    provider: "SPRIBE",
  },
  {
    title: "Mi",
    img: "http://files.worldcasinoonline.com/Document/Game/Keno_1697886431028.6714.png",
    provider: "SPRIBE",
  },
  {
    title: "Mr",
    img: "http://files.worldcasinoonline.com/Document/Game/Mines_1697884616802.6836.png",
    provider: "SPRIBE",
  },
  {
    title: "Pi",
    img: "http://files.worldcasinoonline.com/Document/Game/Plinko_1697884548678.8052.png",
    provider: "SPRIBE",
  },
];

function Livecasino() {
  return (
    <div className="casino-wrapper">
      <div className="game-grid">
        {games.map((game, index) => (
          <div className="game-card" key={index}>
            <img src={game.img} alt={game.title} />

            <div className="game-overlay">
              <h4>{game.title}</h4>
              <span className="provider">{game.provider}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Livecasino;
