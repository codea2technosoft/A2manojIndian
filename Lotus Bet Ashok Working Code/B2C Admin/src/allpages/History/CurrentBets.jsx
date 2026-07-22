import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import {
  getAdminProfile,
  changeMasterPassword,
  getBetListLiveUserWais,  // ✅ API import
} from "../../Server/api";

const CurrentBets = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Exchange');
  const [betData, setBetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get agent_id from URL
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");

  // Define tabs configuration
  const tabs = [
    { key: 'Exchange', label: 'Exchange' },
    { key: 'FancyBet', label: 'FancyBet' },
    { key: 'BookMaker', label: 'BookMaker' },
    { key: 'casino', label: 'Casino' },
    { key: 'Toss', label: 'Toss' },
    { key: 'Tie', label: 'Tie' },
    { key: 'lottery', label: 'Lottery' },
  ];

  // ✅ Get tab specific params
  const getTabParams = (tabKey) => {
    const paramsMap = {
      'Exchange': { sport: '', market_type: '', bet_status: '' },
      'FancyBet': { sport: '4', market_type: 'fancy', bet_status: 'pending' },
      'BookMaker': { sport: '', market_type: 'bookmaker', bet_status: 'pending' },
      'casino': { sport: '', market_type: 'casino', bet_status: 'pending' },
      'Toss': { sport: '', market_type: 'toss', bet_status: 'pending' },
      'Tie': { sport: '', market_type: 'tie', bet_status: 'pending' },
      'lottery': { sport: '', market_type: 'lottery', bet_status: 'pending' },
    };

    return paramsMap[tabKey] || { sport: '', market_type: '', bet_status: 'pending' };
  };

  // ✅ Fetch bets data based on tab
  const fetchBets = async (tabKey) => {
    if (!adminId) {
      console.error("No admin_id found");
      setError("No admin ID found");
      return;
    }

    const { sport, market_type, bet_status } = getTabParams(tabKey);

    setLoading(true);
    setError(null);

    try {
      const params = {
        agent_id: adminId,
        // sport: sport,
        market_type: market_type,
        bet_status: bet_status,
        from_date: '',
        to_date: '',
        bet_on: '',
        team: '',
        keyword: '',
        order_by: 'time',
        order_direction: 'desc',
        page: 1,
        limit: 50,
      };

      console.log(`📡 Fetching bets for ${tabKey} with params:`, params);

      const response = await getBetListLiveUserWais(params);
      console.log("✅ API Response:", response);

      // Handle different response structures
      let bets = [];
      if (response?.data?.data) {
        bets = response.data.data;
      } else if (response?.data) {
        bets = response.data;
      } else if (Array.isArray(response)) {
        bets = response;
      } else {
        bets = [];
      }

      // If response has nested structure
      if (bets?.bets) {
        bets = bets.bets;
      } else if (bets?.results) {
        bets = bets.results;
      }

      setBetData(Array.isArray(bets) ? bets : []);

      if (Array.isArray(bets) && bets.length === 0) {
        console.log(`ℹ️ No bets found for ${tabKey}`);
      }

    } catch (error) {
      console.error("❌ Error fetching bets:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to fetch bets");
      setBetData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on tab change
  useEffect(() => {
    if (adminId) {
      fetchBets(activeTab);
    }
  }, [activeTab, adminId]);

  // ✅ Render table rows based on data
  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="10" className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="10" className="text-center text-danger">
            <span>Error: {error}</span>
          </td>
        </tr>
      );
    }

    if (!betData || betData.length === 0) {
      return (
        <tr>
          <td colSpan="10"><span>You have no bets in this time period.</span></td>
        </tr>
      );
    }

    switch (activeTab) {
      case 'lottery':
        return betData.map((bet, index) => (
          <tr key={bet.bet_id || index}>
            <td>{bet.pl_id || bet.player_id || '-'}</td>
            <td>{bet.bet_id || '-'}</td>
            <td>{bet.bet_placed || bet.created_at || '-'}</td>
            <td>{bet.match || bet.match_name || '-'}</td>
            <td>{bet.lottery_type || bet.game_type || '-'}</td>
            <td>{bet.bhav || bet.odds || '-'}</td>
            <td>{bet.total_bet_amount || bet.stake || 0}</td>
          </tr>
        ));

      case 'casino':
        return betData.map((bet, index) => (
          <tr key={bet.bet_id || index}>
            <td>{bet.bet_id || '-'}</td>
            <td>{bet.pl_id || bet.player_id || '-'}</td>
            <td>{bet.market || bet.game_name || '-'}</td>
            <td>{bet.bet_placed || bet.created_at || '-'}</td>
            <td>{bet.stake || bet.amount || 0}</td>
            <td
              className={`${Number(bet.profit_loss ?? bet.pl ?? 0) >= 0 ? "text-success" : "text-danger"
                }`}
            >
              {Number(bet.profit_loss ?? bet.pl ?? 0).toFixed(2)}
            </td>
          </tr>
        ));

      case 'Toss':
      case 'BookMaker':
      default:
        return betData.map((bet, index) => (
          <tr key={bet.bet_id || index}>
            <td>{bet.pl_id || bet.player_id || '-'}</td>
            <td>{bet.bet_id || '-'}</td>
            <td>{bet.bet_placed || bet.created_at || '-'}</td>
            <td>{bet.ip_address || bet.ip || '-'}</td>
            <td>
              {bet.market
                ? `${bet.market} - ${bet.selection || ""}`
                : (bet.selection || "-")}
            </td>
            <td>{bet.selection || '-'}</td>
            <td>
              {bet.bet_type === "fancy"
                ? (bet.type === "back" ? "Yes" : "No")
                : (bet.type === "back" ? "Back" : "Lay")}
            </td>
            <td>{bet.odds_req || '-'}</td>
            <td>{bet.stake || 0}</td>
            <td
              className={`${Number(bet.profit_loss ?? bet.pl ?? 0) >= 0 ? "text-success" : "text-danger"
                }`}
            >
              {Number(bet.profit_loss ?? bet.pl ?? 0).toFixed(2)}
            </td>
          </tr>
        ));
    }
  };

  // Render table content for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'lottery':
        return (
          <div className="common-container">
            <div className="account-table batting-table profit_loss_table w-100">
              <div className="responsive">
                <table className="all-bets-dialog-tabel table">
                  <thead>
                    <tr>
                      <th scope="col">PL ID</th>
                      <th scope="col">Bet ID</th>
                      <th scope="col">Bet placed</th>
                      <th scope="col">Match</th>
                      <th scope="col">Lottery Type</th>
                      <th scope="col">Bhav</th>
                      <th scope="col">Total Bet Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'casino':
        return (
          <div className="account-table batting-table profit_loss_table w-100">
            <div className="responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Bet ID</th>
                    <th scope="col">PL ID</th>
                    <th scope="col">Market</th>
                    <th scope="col">Bet Placed</th>
                    <th scope="col">Stake</th>
                    <th scope="col">Profit / Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                </tbody>
              </table>
              <div className="bottom-pagination">
                <ul role="navigation" aria-label="Pagination">
                  <li className="previous disabled">
                    <a className=" " tabIndex="-1" role="button" aria-disabled="true" aria-label="Previous page" rel="prev">&lt; </a>
                  </li>
                  <li className="next">
                    <a className="" tabIndex="0" role="button" aria-disabled="false" aria-label="Next page" rel="next"> &gt;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'Toss':
        return (
          <div className="common-container">
            <div className="account-table batting-table profit_loss_table w-100">
              <div className="responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">PL ID</th>
                      <th scope="col">Bet ID</th>
                      <th scope="col">Bet placed</th>
                      <th scope="col">IP Address</th>
                      <th scope="col">Market</th>
                      <th scope="col">Selection</th>
                      <th scope="col">Type</th>
                      <th scope="col">Odds req.</th>
                      <th scope="col">Stake</th>
                      <th scope="col">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows()}
                  </tbody>
                </table>
                <div className="bottom-pagination">
                  <ul role="navigation" aria-label="Pagination">
                    <li className="previous disabled">
                      <a className=" " tabIndex="-1" role="button" aria-disabled="true" aria-label="Previous page" rel="prev">&lt; </a>
                    </li>
                    <li className="next">
                      <a className="" tabIndex="0" role="button" aria-disabled="false" aria-label="Next page" rel="next"> &gt;</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'BookMaker':
        return (
          <div className="common-container">
            <div className="account-table batting-table profit_loss_table w-100">
              <div className="responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">PL ID</th>
                      <th scope="col">Bet ID</th>
                      <th scope="col">Bet placed</th>
                      <th scope="col">IP Address</th>
                      <th scope="col">Market</th>
                      <th scope="col">Selection</th>
                      <th scope="col">Type</th>
                      <th scope="col">Odds req.</th>
                      <th scope="col">Stake</th>
                      <th scope="col">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows()}
                  </tbody>
                </table>
                <div className="bottom-pagination">
                  <ul role="navigation" aria-label="Pagination">
                    <li className="previous disabled">
                      <a className=" " tabIndex="-1" role="button" aria-disabled="true" aria-label="Previous page" rel="prev">&lt; </a>
                    </li>
                    <li className="next">
                      <a className="" tabIndex="0" role="button" aria-disabled="false" aria-label="Next page" rel="next"> &gt;</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      // Placeholder for other tabs (Exchange, FancyBet, Tie)
      default:
        return (
          <div className="common-container">
            <div className="account-table batting-table profit_loss_table w-100">
              <div className="responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">PL ID</th>
                      <th scope="col">Bet ID</th>
                      <th scope="col">Bet placed</th>
                      <th scope="col">IP Address</th>
                      <th scope="col">Market</th>
                      <th scope="col">Selection</th>
                      <th scope="col">Type</th>
                      <th scope="col">Odds req.</th>
                      <th scope="col">Stake</th>
                      <th scope="col">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTableRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout activeItem="current-bets">
      <div className="right_side">
        <div className="inner-wrapper">
          <h2 className="common-heading">Bet List Live</h2>
          <div className="common-tab">
            {/* Tab Navigation */}
            <ul className="nav nav-tabs" id="controlled-tab-example" role="tablist">
              {tabs.map((tab) => (
                <li className="nav-item" role="presentation" key={tab.key}>
                  <button
                    type="button"
                    id={`controlled-tab-example-tab-${tab.key}`}
                    role="tab"
                    data-rr-ui-event-key={tab.key}
                    aria-controls={`controlled-tab-example-tabpane-${tab.key}`}
                    aria-selected={activeTab === tab.key}
                    className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  role="tabpanel"
                  id={`controlled-tab-example-tabpane-${tab.key}`}
                  aria-labelledby={`controlled-tab-example-tab-${tab.key}`}
                  className={`fade tab-pane ${activeTab === tab.key ? 'active show' : ''}`}
                >
                  {activeTab === tab.key && renderTabContent()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CurrentBets;