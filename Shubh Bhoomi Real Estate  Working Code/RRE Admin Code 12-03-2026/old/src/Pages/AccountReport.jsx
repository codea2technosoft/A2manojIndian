import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUserCheck } from "react-icons/fa";
import { GiProfit } from "react-icons/gi";


import {
  MdSettings,
  MdPendingActions,
  MdAssignmentTurnedIn,
} from "react-icons/md";
import { PiHandDepositBold, PiListNumbersFill } from "react-icons/pi";
import { TbListNumbers } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdClose, IoMdCloseCircleOutline } from "react-icons/io";
import { RiCloseCircleLine, RiPassPendingFill } from "react-icons/ri";
import { GiPodiumWinner, GiTakeMyMoney, GiWallet, GiQueenCrown } from "react-icons/gi";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { GoProjectRoadmap } from "react-icons/go";
import { TfiGift } from "react-icons/tfi";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

const iconMap = {
  GiTakeMyMoney: GiTakeMyMoney,
  FcMoneyTransfer: FcMoneyTransfer,
  GiWallet: GiWallet,
  TfiGift: TfiGift,
  GiQueenCrown: GiQueenCrown,
  FaMoneyBillTransfer: FaMoneyBillTransfer,
  FaUserCircle: FaUserCircle,
  PiHandDepositBold: PiHandDepositBold,
  PiListNumbersFill: PiListNumbersFill,
  TbListNumbers: TbListNumbers,
  AiOutlineClose: AiOutlineClose,
  IoMdClose: IoMdClose,
  MdPendingActions: MdPendingActions,
  IoMdCloseCircleOutline: IoMdCloseCircleOutline,
  RiCloseCircleLine: RiCloseCircleLine,
  RiPassPendingFill: RiPassPendingFill,
  GiPodiumWinner: GiPodiumWinner,
  HiMiniCubeTransparent: HiMiniCubeTransparent,
  FaUserCheck: FaUserCheck,
  MdSettings: MdSettings,
  MdAssignmentTurnedIn: MdAssignmentTurnedIn,
  GoProjectRoadmap: GoProjectRoadmap,
};

const AccountReport = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [rawData, setRawData] = useState({});
  const [finalAmount, setFinalAmount] = useState(0);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    }).format(amount);
  };

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const token = getAuthToken();
  //       if (!token) {
  //         showCustomMessageModal(
  //           "Authentication Error",
  //           "Authentication token not found. Please log in.",
  //           "error"
  //         );
  //         return;
  //       }

  //       const response = await fetch(`${API_URL}/expence-summary-count`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         if (response.status === 401) {
  //           showCustomMessageModal(
  //             "Authorization Error",
  //             "Unauthorized: Please log in again.",
  //             "error"
  //           );
  //         } else {
  //           const errorData = await response.json();
  //           showCustomMessageModal(
  //             "Error",
  //             errorData.message || "Failed to fetch dashboard data.",
  //             "error"
  //           );
  //         }
  //         throw new Error(response.statusText);
  //       }

  //       const result = await response.json();

  //       if (result.status !== "1") {
  //         showCustomMessageModal(
  //           "Error",
  //           result.message || "Failed to fetch data",
  //           "error"
  //         );
  //         return;
  //       }

  //       const apiData = result.data;

  //       // SET THE RAW DATA TO STATE
  //       setRawData(apiData);

  //       // Calculate final amount
  //       const creditAmount = apiData.cr_total?.total_amount || 0;
  //       const debitAmount = apiData.dr_total?.total_amount || 0;
  //       const afterDebit = creditAmount - debitAmount;
  //       const walletTotal = (apiData.wallet_balance || 0) + (apiData.pending_wallet_balance || 0);
  //       const afterWallet = afterDebit - walletTotal;
  //       const tdsAmount = apiData.tds_balance || 0;
  //       const calculatedFinalAmount = afterWallet - tdsAmount;
  //       setFinalAmount(calculatedFinalAmount);

  //       // Helper function to format currency
  //       const formatCurrency = (amount) => {
  //         const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  //         return new Intl.NumberFormat('en-IN', {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2
  //         }).format(numAmount || 0);
  //       };

  //       // Calculate balance amounts
  //       const cashBalance = (apiData.cr_cash?.total_amount || 0) - (apiData.dr_cash?.total_amount || 0);
  //       const onlineBalance = (apiData.cr_online?.total_amount || 0) - (apiData.dr_online?.total_amount || 0);
  //       const totalBalance = (apiData.cr_total?.total_amount || 0) - (apiData.dr_total?.total_amount || 0);

  //       // Transform data according to the new API response structure
  //       const transformedData = [
  //         // Credit Section (Row 1)
  //         {
  //           title: "Credit (Cash)",
  //           value: formatCurrency(apiData.cr_cash?.total_amount || 0),
  //           numericValue: apiData.cr_cash?.total_amount || 0,
  //           count: apiData.cr_cash?.transaction_count || 0,
  //           icon: "GiTakeMyMoney",
  //           color: "primary",
  //           link: "/cash-credit-list",
  //           type: "credit"
  //         },
  //         {
  //           title: "Credit (Online)",
  //           value: formatCurrency(apiData.cr_online?.total_amount || 0),
  //           numericValue: apiData.cr_online?.total_amount || 0,
  //           count: apiData.cr_online?.transaction_count || 0,
  //           icon: "GiTakeMyMoney",
  //           color: "info",
  //           link: "/online-credit-list",
  //           type: "credit"
  //         },
  //         {
  //           title: "Total Credit (Cash + Online)",
  //           value: formatCurrency(apiData.cr_total?.total_amount || 0),
  //           numericValue: apiData.cr_total?.total_amount || 0,
  //           count: apiData.cr_total?.transaction_count || 0,
  //           icon: "GiTakeMyMoney",
  //           color: "success",
  //           link: "/total-credit-list",
  //           type: "credit"
  //         },

  //         // Debit Section (Row 2)
  //         {
  //           title: "Debit (Cash)",
  //           value: formatCurrency(apiData.dr_cash?.total_amount || 0),
  //           numericValue: apiData.dr_cash?.total_amount || 0,
  //           count: apiData.dr_cash?.transaction_count || 0,
  //           icon: "FcMoneyTransfer",
  //           color: "primary",
  //           link: "/cash-debit-list",
  //           type: "debit"
  //         },
  //         {
  //           title: "Debit (Online)",
  //           value: formatCurrency(apiData.dr_online?.total_amount || 0),
  //           numericValue: apiData.dr_online?.total_amount || 0,
  //           count: apiData.dr_online?.transaction_count || 0,
  //           icon: "FcMoneyTransfer",
  //           color: "info",
  //           link: "/online-debit-list",
  //           type: "debit"
  //         },
  //         {
  //           title: "Total Debit (Cash + Online)",
  //           value: formatCurrency(apiData.dr_total?.total_amount || 0),
  //           numericValue: apiData.dr_total?.total_amount || 0,
  //           count: apiData.dr_total?.transaction_count || 0,
  //           icon: "FcMoneyTransfer",
  //           color: "success",
  //           link: "/total-debit-list",
  //           type: "debit"
  //         },

  //         // Balance Section (Row 3)
  //         {
  //           title: "Balance (Cash)",
  //           value: formatCurrency(cashBalance),
  //           numericValue: cashBalance,
  //           count: (apiData.cr_cash?.transaction_count || 0) + (apiData.dr_cash?.transaction_count || 0),
  //           icon: "FaMoneyBillTransfer",
  //           color: "primary",
  //           link: "/cash-balance-list",
  //           type: "balance"
  //         },
  //         {
  //           title: "Balance (Online)",
  //           value: formatCurrency(onlineBalance),
  //           numericValue: onlineBalance,
  //           count: (apiData.cr_online?.transaction_count || 0) + (apiData.dr_online?.transaction_count || 0),
  //           icon: "FaMoneyBillTransfer",
  //           color: "info",
  //           link: "/online-balance-list",
  //           type: "balance"
  //         },
  //         {
  //           title: "Total Balance (Cash + Online)",
  //           value: formatCurrency(totalBalance),
  //           numericValue: totalBalance,
  //           count: (apiData.cr_total?.transaction_count || 0) + (apiData.dr_total?.transaction_count || 0),
  //           icon: "FaMoneyBillTransfer",
  //           color: "success",
  //           link: "/total-balance-list",
  //           type: "balance"
  //         },

  //         // New Wallet Balances from API
  //         {
  //           title: "Wallet Balance (Without Withdrawal Request)",
  //           value: formatCurrency(apiData.wallet_balance || 0),
  //           numericValue: apiData.wallet_balance || 0,
  //           icon: "GiWallet",
  //           color: "primary",
  //           link: "/wallet-balance",
  //           type: "wallet"
  //         },
  //         {
  //           title: "Wallet Balance (After Withdrawal Request)",
  //           value: formatCurrency(apiData.pending_wallet_balance || 0),
  //           numericValue: apiData.pending_wallet_balance || 0,
  //           icon: "GiWallet",
  //           color: "warning",
  //           link: "/withdrawal-wallet-balance",
  //           type: "wallet"
  //         },
  //         {
  //           title: "Total Wallet Balance (After Withdrawal Request & Without Withdrawal Request)",
  //           value: formatCurrency(apiData.wallet_balance + apiData.pending_wallet_balance),
  //           numericValue: apiData.wallet_balance + apiData.pending_wallet_balance || 0,
  //           icon: "GiWallet",
  //           color: "success",
  //           link: "/success-wallet-balance",
  //           type: "wallet"
  //         },
  //         {
  //           title: "TDS Balance",
  //           value: formatCurrency(apiData.tds_balance || 0),
  //           numericValue: apiData.tds_balance || 0,
  //           icon: "MdAssignmentTurnedIn",
  //           color: "info",
  //           link: "/tds-balance",
  //           type: "tds"
  //         },

  //         // New Reward and Royalty Balances from API
  //         {
  //           title: "Monthly Reward Balance",
  //           value: formatCurrency(apiData.monthly_reward_balance || 0),
  //           numericValue: apiData.monthly_reward_balance || 0,
  //           icon: "TfiGift",
  //           color: "danger",
  //           link: "#",
  //           type: "reward"
  //         },
  //         {
  //           title: "Lifetime Reward Balance",
  //           value: formatCurrency(apiData.lifetime_reward_total || 0),
  //           numericValue: apiData.lifetime_reward_total || 0,
  //           icon: "TfiGift",
  //           color: "success",
  //           link: "#",
  //           type: "reward"
  //         },
  //         {
  //           title: "Royalty Balance",
  //           value: formatCurrency(apiData.royalty_balance || 0),
  //           numericValue: apiData.royalty_balance || 0,
  //           icon: "GiQueenCrown",
  //           color: "success",
  //           link: "#",
  //           type: "royalty"
  //         },
  //       ];

  //       setDashboardData(transformedData);
  //     } catch (err) {
  //       console.error("Fetch dashboard data error:", err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  // ... existing code remains same until the useEffect ...

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal(
            "Authentication Error",
            "Authentication token not found. Please log in.",
            "error"
          );
          return;
        }

        const response = await fetch(`${API_URL}/expence-summary-count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            showCustomMessageModal(
              "Authorization Error",
              "Unauthorized: Please log in again.",
              "error"
            );
          } else {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch dashboard data.",
              "error"
            );
          }
          throw new Error(response.statusText);
        }

        const result = await response.json();

        if (result.status !== "1") {
          showCustomMessageModal(
            "Error",
            result.message || "Failed to fetch data",
            "error"
          );
          return;
        }

        const apiData = result.data;

        // SET THE RAW DATA TO STATE
        setRawData(apiData);

        // Calculate final amount WITH ALL DEDUCTIONS
        const creditAmount = apiData.cr_total?.total_amount || 0;
        const debitAmount = apiData.dr_total?.total_amount || 0;
        const afterDebit = creditAmount - debitAmount;
        const walletTotal = (apiData.wallet_balance || 0) + (apiData.pending_wallet_balance || 0);
        const afterWallet = afterDebit - walletTotal;
        const tdsAmount = apiData.tds_balance || 0;
        const afterTds = afterWallet - tdsAmount;

        // Additional deductions: Monthly Reward, Lifetime Reward, and Royalty
        const monthlyReward = apiData.monthly_reward_balance || 0;
        const lifetimeReward = apiData.lifetime_reward_total || 0;
        const royaltyAmount = apiData.royalty_balance || 0;

        const calculatedFinalAmount = afterTds - monthlyReward - lifetimeReward - royaltyAmount;
        setFinalAmount(calculatedFinalAmount);

        // Helper function to format currency
        const formatCurrency = (amount) => {
          const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
          return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(numAmount || 0);
        };

        // Calculate balance amounts
        const cashBalance = (apiData.cr_cash?.total_amount || 0) - (apiData.dr_cash?.total_amount || 0);
        const onlineBalance = (apiData.cr_online?.total_amount || 0) - (apiData.dr_online?.total_amount || 0);
        const totalBalance = (apiData.cr_total?.total_amount || 0) - (apiData.dr_total?.total_amount || 0);

        // Transform data according to the new API response structure
        const transformedData = [
          // Credit Section (Row 1)
          {
            title: "Credit (Cash)",
            value: formatCurrency(apiData.cr_cash?.total_amount || 0),
            numericValue: apiData.cr_cash?.total_amount || 0,
            count: apiData.cr_cash?.transaction_count || 0,
            icon: "GiTakeMyMoney",
            color: "primary",
            link: "/cash-credit-list",
            type: "credit"
          },
          {
            title: "Credit (Online)",
            value: formatCurrency(apiData.cr_online?.total_amount || 0),
            numericValue: apiData.cr_online?.total_amount || 0,
            count: apiData.cr_online?.transaction_count || 0,
            icon: "GiTakeMyMoney",
            color: "info",
            link: "/online-credit-list",
            type: "credit"
          },
          {
            title: "Total Credit (Cash + Online)",
            value: formatCurrency(apiData.cr_total?.total_amount || 0),
            numericValue: apiData.cr_total?.total_amount || 0,
            count: apiData.cr_total?.transaction_count || 0,
            icon: "GiTakeMyMoney",
            color: "success",
            link: "/total-credit-list",
            type: "credit"
          },

          // Debit Section (Row 2)
          {
            title: "Debit (Cash)",
            value: formatCurrency(apiData.dr_cash?.total_amount || 0),
            numericValue: apiData.dr_cash?.total_amount || 0,
            count: apiData.dr_cash?.transaction_count || 0,
            icon: "FcMoneyTransfer",
            color: "primary",
            link: "/cash-debit-list",
            type: "debit"
          },
          {
            title: "Debit (Online)",
            value: formatCurrency(apiData.dr_online?.total_amount || 0),
            numericValue: apiData.dr_online?.total_amount || 0,
            count: apiData.dr_online?.transaction_count || 0,
            icon: "FcMoneyTransfer",
            color: "info",
            link: "/online-debit-list",
            type: "debit"
          },
          {
            title: "Total Debit (Cash + Online)",
            value: formatCurrency(apiData.dr_total?.total_amount || 0),
            numericValue: apiData.dr_total?.total_amount || 0,
            count: apiData.dr_total?.transaction_count || 0,
            icon: "FcMoneyTransfer",
            color: "success",
            link: "/total-debit-list",
            type: "debit"
          },

          // Balance Section (Row 3)
          {
            title: "Balance (Cash)",
            value: formatCurrency(cashBalance),
            numericValue: cashBalance,
            count: (apiData.cr_cash?.transaction_count || 0) + (apiData.dr_cash?.transaction_count || 0),
            icon: "FaMoneyBillTransfer",
            color: "primary",
            link: "/cash-balance-list",
            type: "balance"
          },
          {
            title: "Balance (Online)",
            value: formatCurrency(onlineBalance),
            numericValue: onlineBalance,
            count: (apiData.cr_online?.transaction_count || 0) + (apiData.dr_online?.transaction_count || 0),
            icon: "FaMoneyBillTransfer",
            color: "info",
            link: "/online-balance-list",
            type: "balance"
          },
          {
            title: "Total Balance (Cash + Online)",
            value: formatCurrency(totalBalance),
            numericValue: totalBalance,
            count: (apiData.cr_total?.transaction_count || 0) + (apiData.dr_total?.transaction_count || 0),
            icon: "FaMoneyBillTransfer",
            color: "success",
            link: "/total-balance-list",
            type: "balance"
          },

          // New Wallet Balances from API
          {
            title: "Wallet Balance (Without Withdrawal Request)",
            value: formatCurrency(apiData.wallet_balance || 0),
            numericValue: apiData.wallet_balance || 0,
            icon: "GiWallet",
            color: "primary",
            link: "/wallet-balance",
            type: "wallet"
          },
          {
            title: "Wallet Balance (After Withdrawal Request)",
            value: formatCurrency(apiData.pending_wallet_balance || 0),
            numericValue: apiData.pending_wallet_balance || 0,
            icon: "GiWallet",
            color: "warning",
            link: "/withdrawal-wallet-balance",
            type: "wallet"
          },
          {
            title: "Total Wallet Balance (After Withdrawal Request & Without Withdrawal Request)",
            value: formatCurrency(apiData.wallet_balance + apiData.pending_wallet_balance),
            numericValue: apiData.wallet_balance + apiData.pending_wallet_balance || 0,
            icon: "GiWallet",
            color: "success",
            link: "/success-wallet-balance",
            type: "wallet"
          },

          {
            title: "TDS Balance DR",
            value: formatCurrency(apiData.dr_tds.total_amount || 0),
            numericValue: apiData.dr_tds.total_amount || 0,
            icon: "MdAssignmentTurnedIn",
            color: "info",
            link: "/tds-dr-report",
            type: "tds"
          },

          {
            title: "TDS Balance CR",
            value: formatCurrency(apiData.cr_tds.total_amount || 0),
            numericValue: apiData.cr_tds.total_amount || 0,
            icon: "MdAssignmentTurnedIn",
            color: "info",
            link: "/tds-cr-report",
            type: "tds"
          },

          // New Reward and Royalty Balances from API
          {
            title: "Monthly Reward Balance",
            value: formatCurrency(apiData.monthly_reward_balance || 0),
            numericValue: apiData.monthly_reward_balance || 0,
            icon: "TfiGift",
            color: "danger",
            link: "#",
            type: "reward"
          },
          {
            title: "Lifetime Reward Balance",
            value: formatCurrency(apiData.lifetime_reward_total || 0),
            numericValue: apiData.lifetime_reward_total || 0,
            icon: "TfiGift",
            color: "success",
            link: "#",
            type: "reward"
          },
          {
            title: "Royalty Balance",
            value: formatCurrency(apiData.royalty_balance || 0),
            numericValue: apiData.royalty_balance || 0,
            icon: "GiQueenCrown",
            color: "success",
            link: "#",
            type: "royalty"
          },
        ];

        setDashboardData(transformedData);
      } catch (err) {
        console.error("Fetch dashboard data error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ... rest of the code remains same until the Final P&L Report section ...

  {/* -------- FINAL P&L REPORT -------- */ }
  <Row className="g-4 mt-4">
    <div className="card mt-2 border-0">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="titlepage">
            <h3>Final P&L Report</h3>
          </div>
        </div>
      </div>
    </div>

    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
      <div className="card bg_card_design">
        <div className="card-body d-flex align-items-center gap-3">
          <div className="icon_dashboard">
            <GiProfit size={50} className="text-white" />
          </div>

          <div>
            <div className="card-title text-dark">
              Final Profit / Loss
            </div>

            <div
              className={`fw-bold h4 ${finalAmount < 0 ? "text-danger" : "text-success"
                }`}
            >
              {finalAmount < 0
                ? `-${formatCurrency(Math.abs(finalAmount))}`
                : formatCurrency(finalAmount)}
            </div>

            <small className="text-muted">
              Credit − Debit − Wallet − TDS − Monthly Reward − Lifetime Reward − Royalty
            </small>
          </div>
        </div>
      </div>
    </div>
  </Row>

  // ... rest of the code remains same ...
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="padding_15">
      <div className="dashboard">
        {/* -------- CREDIT SECTION -------- */}
        <Row className="g-4">
          <div className="card mt-2 border-0 mt-4">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Credit Report</h3>
                </div>
              </div>
            </div>
          </div>
          {dashboardData.filter(item => item.type === "credit").map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div
                  className={`card bg_card_design clickable-card`}
                  onClick={() => item.link && navigate(item.link)}
                  style={{ cursor: item.link ? "pointer" : "default" }}
                >
                  <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                    {IconComponent && (
                      <div className="icon_dashboard">
                        <IconComponent size={50} className="text-white" />
                      </div>
                    )}
                    <div>
                      <div className="card-title text-dark">{item.title}</div>
                      <div className="card-text fw-bold h4">{item.value}</div>
                      <small className="text-muted">Transactions: {item.count}</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Row>

        {/* -------- DEBIT SECTION -------- */}
        <Row className="g-4 mt-4">
          <div className="card mt-2 border-0">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Debit Report</h3>
                </div>
              </div>
            </div>
          </div>
          {dashboardData.filter(item => item.type === "debit").map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div
                  className={`card bg_card_design clickable-card`}
                  onClick={() => item.link && navigate(item.link)}
                  style={{ cursor: item.link ? "pointer" : "default" }}
                >
                  <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                    {IconComponent && (
                      <div className="icon_dashboard">
                        <IconComponent size={50} className="text-white" />
                      </div>
                    )}
                    <div>
                      <div className="card-title text-dark">{item.title}</div>
                      <div className="card-text fw-bold h4">{item.value}</div>
                      <small className="text-muted">Transactions: {item.count}</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Row>

        {/* -------- BALANCE SECTION -------- */}
        <Row className="g-4 mt-4">
          <div className="card mt-2 border-0">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Balance Report</h3>
                </div>
              </div>
            </div>
          </div>
          {dashboardData.filter(item => item.type === "balance").map((item, index) => {
            const IconComponent = iconMap[item.icon];
            const isNegativeOrZero = item.numericValue < 0 || item.numericValue === 0;

            return (
              <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div
                  className={`card bg_card_design clickable-card`}
                  onClick={() => item.link && navigate(item.link)}
                  style={{ cursor: item.link ? "pointer" : "default" }}
                >
                  <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                    {IconComponent && (
                      <div className="icon_dashboard">
                        <IconComponent size={50} className="text-white" />
                      </div>
                    )}
                    <div>
                      <div className="card-title text-dark">{item.title}</div>
                      <div className={`card-text fw-bold h4 ${isNegativeOrZero ? 'text-danger' : ''}`}>
                        {item.value}
                      </div>
                      <small className="text-muted">Total Transactions: {item.count}</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Row>

        {/* -------- WALLET & TDS BALANCES SECTION -------- */}
        <Row className="g-4 mt-4">
          <div className="card mt-2 border-0">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Wallet & TDS Balances</h3>
                </div>
              </div>
            </div>
          </div>
          {dashboardData.filter(item =>
            ["wallet", "tds"].includes(item.type)
          ).map((item, index) => {
            const IconComponent = iconMap[item.icon];
            const isNegativeOrZero = item.numericValue < 0 || item.numericValue === 0;

            return (
              <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className={`card bg_card_design clickable-card h-100`}
                  onClick={() => item.link && navigate(item.link)}
                  style={{ cursor: item.link ? "pointer" : "default" }}
                >
                  <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                    {IconComponent && (
                      <div className="icon_dashboard">
                        <IconComponent size={50} className="text-white" />
                      </div>
                    )}
                    <div>
                      <div className="card-title text-dark">{item.title}</div>
                      <div className={`card-text fw-bold h4 ${isNegativeOrZero ? 'text-danger' : ''}`}>
                        {item.value}
                      </div>
                      {item.type === "wallet" && (
                        <small className="text-muted">
                          {item.title.includes("Pending") ? "Pending Withdrawals" : "Available Balance"}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Row>

        {/* -------- REWARDS & ROYALTY SECTION -------- */}
        <Row className="g-4 mt-4">
          <div className="card mt-2 border-0">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Rewards & Royalty Balances</h3>
                </div>
              </div>
            </div>
          </div>
          {dashboardData.filter(item =>
            ["reward", "royalty"].includes(item.type)
          ).map((item, index) => {
            const IconComponent = iconMap[item.icon];
            const isNegativeOrZero = item.numericValue < 0 || item.numericValue === 0;

            return (
              <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div
                  className={`card bg_card_design clickable-card`}
                  onClick={() => item.link && navigate(item.link)}
                  style={{ cursor: item.link ? "pointer" : "default" }}
                >
                  <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                    {IconComponent && (
                      <div className="icon_dashboard">
                        <IconComponent size={50} className="text-white" />
                      </div>
                    )}
                    <div>
                      <div className="card-title text-dark">{item.title}</div>
                      <div className={`card-text fw-bold h4 ${isNegativeOrZero ? 'text-danger' : ''}`}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Row>

        {/* -------- FINAL P&L REPORT -------- */}
        {/* <Row className="g-4 mt-4">
          <div className="card mt-2 border-0">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Final P&L Report</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <div className="card bg_card_design">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="icon_dashboard">
                  <GiProfit size={50} className="text-white" />
                </div>

                <div>
                  <div className="card-title text-dark">
                    Final Profit / Loss
                  </div>

                  <div
                    className={`fw-bold h4 ${finalAmount < 0 ? "text-danger" : "text-success"
                      }`}
                  >
                    {finalAmount < 0
                      ? `-${formatCurrency(Math.abs(finalAmount))}`
                      : formatCurrency(finalAmount)}
                  </div>

                  <small className="text-muted">
                    Credit − Debit − Wallet − TDS - Monthly Reward Balance - Lifetime Reward Balance - Royalty Balance
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Row> */}

        <Row className="g-4 mt-4">
          <div className="card mt-2 border-0">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Final P&L Report</h3>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-4"
            onClick={() => navigate("/final-pl-report-details-lists")}
            style={{ cursor: "pointer" }}
          >
            <div className="card bg_card_design">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="icon_dashboard">
                  <GiProfit size={50} className="text-white" />
                </div>

                <div>
                  <div className="card-title text-dark">
                    Final Profit / Loss
                  </div>

                  <div
                    className={`fw-bold h4 ${finalAmount < 0 ? "text-danger" : "text-success"
                      }`}
                  >
                    {finalAmount < 0
                      ? `-${formatCurrency(Math.abs(finalAmount))}`
                      : formatCurrency(finalAmount)}
                  </div>

                  <small className="text-muted">
                    Credit − Debit − Wallet − TDS - Monthly Reward Balance - Lifetime Reward Balance - Royalty Balance
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Row>


        {/* Custom Modal */}
        {showMessageModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between align-items-center">
                  <h5
                    className={`modal-title ${messageModalContent.type === "error" ? "text-danger" : ""
                      }`}
                  >
                    {messageModalContent.title}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeCustomMessageModal}
                  ></button>
                </div>
                <div className="modal-body text-secondary">
                  <p>{messageModalContent.text}</p>
                </div>
                <div className="modal-footer justify-content-center">
                  <Button variant="primary" onClick={closeCustomMessageModal}>
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountReport;