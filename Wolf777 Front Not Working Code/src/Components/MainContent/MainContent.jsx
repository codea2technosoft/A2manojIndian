// src/components/MainContent/MainContent.js
import React from 'react';
import './MainContent.scss';

const MainContent = ({ activeTab, setSelectedEvent }) => {
  // Sample events data
  const events = {
    sports: [
      { id: 1, teams: 'Manchester United vs Liverpool', time: 'Today, 15:00', odds: { home: 2.5, draw: 3.2, away: 2.8 } },
      { id: 2, teams: 'Arsenal vs Chelsea', time: 'Today, 17:30', odds: { home: 2.1, draw: 3.4, away: 3.1 } },
      { id: 3, teams: 'Barcelona vs Real Madrid', time: 'Tomorrow, 20:00', odds: { home: 2.3, draw: 3.5, away: 2.7 } }
    ],
    live: [
      { id: 4, teams: 'Man City vs Tottenham', time: '65\'', score: '2-1', odds: { home: 1.8, draw: 3.6, away: 4.2 } },
      { id: 5, teams: 'Lakers vs Celtics', time: 'Q3', score: '78-75', odds: { home: 1.9, draw: null, away: 1.9 } }
    ],
    casino: [
      { id: 6, game: 'Roulette', provider: 'Evolution Gaming', minBet: 1 },
      { id: 7, game: 'Blackjack', provider: 'NetEnt', minBet: 5 },
      { id: 8, game: 'Slots: Mega Fortune', provider: 'NetEnt', jackpot: '€4.5M' }
    ]
  };

  const renderSportsEvents = () => (
    <div className="events-container">
      {events.sports.map(event => (
        <div key={event.id} className="event-card" onClick={() => setSelectedEvent(event)}>
          <div className="event-header">
            <span className="event-teams">{event.teams}</span>
            <span className="event-time">{event.time}</span>
          </div>
          <div className="odds-container">
            <div className="odd-box">
              <span>1</span>
              <span className="odd-value">{event.odds.home}</span>
            </div>
            <div className="odd-box">
              <span>X</span>
              <span className="odd-value">{event.odds.draw}</span>
            </div>
            <div className="odd-box">
              <span>2</span>
              <span className="odd-value">{event.odds.away}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLiveEvents = () => (
    <div className="events-container">
      {events.live.map(event => (
        <div key={event.id} className="event-card live" onClick={() => setSelectedEvent(event)}>
          <div className="event-header">
            <span className="event-teams">{event.teams}</span>
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span className="event-time">{event.time}</span>
            </div>
          </div>
          <div className="score">{event.score}</div>
          <div className="odds-container">
            <div className="odd-box">
              <span>1</span>
              <span className="odd-value">{event.odds.home}</span>
            </div>
            {event.odds.draw && (
              <div className="odd-box">
                <span>X</span>
                <span className="odd-value">{event.odds.draw}</span>
              </div>
            )}
            <div className="odd-box">
              <span>2</span>
              <span className="odd-value">{event.odds.away}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCasinoGames = () => (
    <div className="casino-container">
      {events.casino.map(game => (
        <div key={game.id} className="casino-card">
          <h4>{game.game}</h4>
          <p>{game.provider}</p>
          {game.minBet && <p>Min Bet: ${game.minBet}</p>}
          {game.jackpot && <p className="jackpot">Jackpot: {game.jackpot}</p>}
          <button className="play-btn">Play Now</button>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'sports':
        return renderSportsEvents();
      case 'live':
        return renderLiveEvents();
      case 'casino':
        return renderCasinoGames();
      case 'poker':
        return <div className="tab-content"><h2>Poker Tournaments</h2><p>Poker content coming soon...</p></div>;
      case 'promotions':
        return <div className="tab-content"><h2>Special Promotions</h2><p>Check out our latest offers!</p></div>;
      default:
        return renderSportsEvents();
    }
  };

  return (
    <div className="main-content">
      <h2>{activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1)}</h2>
      {renderContent()}
    </div>
  );
};

export default MainContent;