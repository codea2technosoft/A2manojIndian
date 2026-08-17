import React, { useState } from 'react';

function Casinocontrol() {
    const casinoProviders = [
        {
            id: "EVOLUTION",
            name: "Evolution",
            games: [
                { id: "EVOLUTION-LIVE-001", name: "Baccarat" },
                { id: "EVOLUTION-LIVE-002", name: "Roulette" },
                { id: "EVOLUTION-LIVE-003", name: "Blackjack" },
                { id: "EVOLUTION-LIVE-004", name: "Dream Catcher" },
                { id: "EVOLUTION-LIVE-005", name: "Baccarat Squeeze" },
                { id: "EVOLUTION-LIVE-006", name: "Super Sic Bo" },
                { id: "EVOLUTION-LIVE-007", name: "First Person Baccarat" }
            ]
        },
        {
            id: "PRAGMATIC",
            name: "Pragmatic Play",
            games: [
                { id: "PRAGMATIC-LIVE-001", name: "Speed Baccarat" },
                { id: "PRAGMATIC-LIVE-002", name: "Mega Roulette" },
                { id: "PRAGMATIC-LIVE-003", name: "Blackjack Azure" }
            ]
        },
        {
            id: "EZUGI",
            name: "Ezugi",
            games: [
                { id: "EZUGI-LIVE-001", name: "Andar Bahar" },
                { id: "EZUGI-LIVE-002", name: "Teen Patti" }
            ]
        }
    ];
    const [activeProvider, setActiveProvider] = useState(null);
    const [selectedGame, setSelectedGame] = useState('');

    // PLUS ICON
    const plusIcon = (
       <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg"  style={{ marginRight: 10 }}><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>
    );

    // MINUS ICON
    const minusIcon = (
       <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 10 }}><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM92 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H92z"></path></svg>
    );
    const cross = (
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M 5 5 L 5 27 L 27 27 L 27 5 Z M 7 7 L 25 7 L 25 25 L 7 25 Z M 11.6875 10.3125 L 10.28125 11.71875 L 14.5625 16 L 10.21875 20.34375 L 11.625 21.75 L 15.96875 17.40625 L 20.28125 21.71875 L 21.6875 20.3125 L 17.375 16 L 21.625 11.75 L 20.21875 10.34375 L 15.96875 14.59375 Z"></path></svg>
    );
    // Toggle handler
    const toggleProvider = (providerId) => {
        setActiveProvider(activeProvider === providerId ? null : providerId);
    };

    // Game selection handler
    const handleGameSelect = (gameId) => {
        setSelectedGame(gameId);
        console.log('Selected game:', gameId);
    };


    return (
        <main className='allcommon'>
            <section className="find-member-sec">
                <div className="container-fluid">
                    <div className="mb-md-0 mb-3 p-3 row">
                        <div className="casino-control-outer">
                            <p>Providers -</p>
                            <div className="casino-control">
                                <div>
                                    <span>Indian Poker</span>
                                    <input name="Indian Poker" type="radio" />
                                </div>
                                <div>
                                    <span>Evolution</span>
                                    <input name="Evolution" type="radio" />
                                </div>
                                <div>
                                    <span>Fastspin</span>
                                    <input name="Fastspin" type="radio" />
                                </div>
                                <div>
                                    <span>FC</span>
                                    <input name="FC" type="radio" />
                                </div>
                                <div>
                                    <span>GTF</span>
                                    <input name="GTF" type="radio" />
                                </div>
                                <div>
                                    <span>HorseBook</span>
                                    <input name="HorseBook" type="radio" />
                                </div>
                                <div>
                                    <span>I LOVE U</span>
                                    <input name="I LOVE U" type="radio" />
                                </div>
                                <div>
                                    <span>JDB</span>
                                    <input name="JDB" type="radio" />
                                </div>
                                <div>
                                    <span>Jili</span>
                                    <input name="Jili" type="radio" />
                                </div>
                                <div>
                                    <span>Joker</span>
                                    <input name="Joker" type="radio" />
                                </div>
                                <div>
                                    <span>KINGMAKER</span>
                                    <input name="KINGMAKER" type="radio" />
                                </div>
                                <div>
                                    <span>Sexy</span>
                                    <input name="Sexy" type="radio" />
                                </div>
                                <div>
                                    <span>PP</span>
                                    <input name="PP" type="radio" />
                                </div>
                                <div>
                                    <span>PT</span>
                                    <input name="PT" type="radio" />
                                </div>
                                <div>
                                    <span>Spade</span>
                                    <input name="Spade" type="radio" />
                                </div>
                                <div>
                                    <span>Spribe</span>
                                    <input name="Spribe" type="radio" />
                                </div>
                                <div>
                                    <span>Egame</span>
                                    <input name="Egame" type="radio" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-md-0 mb-3 p-3 row">
                        <div className="casino-control-outer">
                            <p>Casino Control -</p>
                            {casinoProviders.map((provider) => (
                                <div key={provider.id} className="casino-control-bottom-outer">
                                    {/* Provider Header - Clickable */}
                                    <div
                                        className="casino-control-bottom"
                                        onClick={() => toggleProvider(provider.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {activeProvider === provider.id ? minusIcon : plusIcon}
                                        <span>{provider.name}</span>
                                    </div>

                                    {/* Games List - Toggle Show/Hide */}
                                    {activeProvider === provider.id && (
                                        <div className="casino-control-bottom-detail">
                                            {provider.games.map((game) => (
                                                <div key={game.id}>
                                                 
                                                        {cross}
                                                    
                                                    <span>{game.name}</span>
                                                    <input
                                                        name={game.id}
                                                        type="radio"
                                                        checked={selectedGame === game.id}
                                                        onChange={() => handleGameSelect(game.id)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <button type="button" className="green-btn btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}

export default Casinocontrol
