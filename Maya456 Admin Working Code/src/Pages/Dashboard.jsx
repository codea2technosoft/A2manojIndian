import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUserCheck } from "react-icons/fa";
import { MdSettings, MdPendingActions } from "react-icons/md";
import { PiHandDepositBold, PiListNumbersFill } from "react-icons/pi";
import { TbListNumbers } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdClose, IoMdCloseCircleOutline } from "react-icons/io";
import { RiCloseCircleLine, RiPassPendingFill } from "react-icons/ri";
import { GiPodiumWinner } from "react-icons/gi";
import { HiMiniCubeTransparent } from "react-icons/hi2";

const iconMap = {
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
};

const Dashboard = ({ }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [userType, setUserType] = useState("");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard-list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.success && result.data) {
        setDashboardData(result.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const fetchPermissions = async (token, role, userId) => {
    try {
      if (role === "tech_admin") {
        setPermissions(["*"]);
      } else {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin-permissions-list`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );
        const result = await res.json();
        console.log("Permission API Response", result);

        if (
          result.success === "1" &&
          Array.isArray(result.data) &&
          result.data.length > 0 &&
          Array.isArray(result.data[0].permissions)
        ) {
          const activePermissions = [];
          result.data[0].permissions.forEach((perm) => {
            // child permission check
            if (Array.isArray(perm.children)) {
              perm.children.forEach((child) => {
                if (child.checked) {
                  activePermissions.push(child.id);
                }
              });
            }
            if (perm.checked) {
              activePermissions.push(perm.id);
            }
          });

          console.log("Flattened Permissions List:", activePermissions);
          setPermissions(activePermissions);
        } else {
          console.warn("Invalid permissions format or empty");
          setPermissions([]);
        }
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions([]);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await res.json();
        if (result.success == "1" && result.data) {
          const role = result.data.roles;
          const userId = result.data._id;
          fetchPermissions(token, role, userId);
          fetchDashboardData();
        } else {
          console.warn("Profile fetch failed. Logging out.");
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, []);

  // const hasPermission = (key) => {
  //   return (
  //     userType === "tech_admin" ||
  //     permissions.includes("*") ||
  //     permissions.includes(key)
  //   );
  // };
  const hasPermission = (id) => {
    return permissions.includes("*") || permissions.includes(id);
  };

  const tiles = [

    {
      key: "users_today",
      icon: "FaUserCircle",
      label: "Today Users",
      points: dashboardData.users_today || 0,
    },

    {
      key: "users_Yestarday",
      icon: "FaUserCircle",
      label: "Yesterday Users",
      points: dashboardData.users_Yestarday || 0,
    },


    {
      key: "total_users",
      icon: "FaUserCircle",
      label: "Total App Users",
      points: dashboardData.users_total || 0,
    },
    {
      key: "withdrawal_pending",
      icon: "PiHandDepositBold",
      label: "Pending Withdrawal",
      points: dashboardData.withdrawals_all_pending?.amount || 0,
    },
    {
      key: "withdrawal_success",
      icon: "FaUserCheck",
      label: "Complete Withdrawal",
      points: dashboardData.withdrawals_all_success?.amount || 0,
    },
    {
      key: "withdrawal_reject",
      icon: "IoMdClose",
      label: "Reject Withdrawal",
      points: dashboardData.withdrawals_all_reject?.amount || 0,
    },
    {
      key: "active_users",
      icon: "MdPendingActions",
      label: "Active Users",
      points: dashboardData.users_totalActive || 0,
    },
    {
      key: "winners_today",
      icon: "GiPodiumWinner",
      label: "Winners Today",
      points: dashboardData.bets_today_won?.count || 0,
    },
    {
      key: "running_games",
      icon: "HiMiniCubeTransparent",
      label: "Running Games",
      points: dashboardData.bets_today_pending?.count || 0,
    },
    {
      key: "withdrawals_today_pending",
      icon: "RiPassPendingFill",
      label: "Withdrawals Today Pending",
      points: dashboardData.withdrawals_today_pending?.amount || 0,
    },
    {
      key: "change_rates",
      icon: "TbListNumbers",
      label: "Change Rates",
      points: dashboardData.bets_all_won?.amount || 0,
    },
    {
      key: "main_market_lost",
      icon: "RiCloseCircleLine",
      label: "Main Market Lost",
      points: dashboardData.bets_today_lost?.count || 0,
    },
  ];

  const handleBoxClick = (path) => {
    navigate(path);
  };
  return (
    <div className="dashboard mt-3">
      <div className="row">
        <h2>Users</h2>
        {/* {hasPermission("users_today") && (
          <>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users?todayuser=yes")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.users_today || 0}</h3>
                  <p>Users Today</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users?yestardayuser=yes")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.users_Yestarday || 0}</h3>
                  <p>Users Yestarday</p>
                </div>
              </div>
            </div>
          </>
        )} */}

        {hasPermission("all_users") && (
          <>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users?todayuser=yes")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.users_today || 0}</h3>
                  <p>Users Today</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users?yestardayuser=yes")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.users_Yestarday || 0}</h3>
                  <p>Users Yesterday</p>
                </div>
              </div>
            </div>
          </>
        )}
        {hasPermission("all_users") && (
          <>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.users_total || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.users_wallet_balancetotal || 0}</h3>
                  <p>Total Users Wallet Balance</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/all_users?zerobalance=yes")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <FaUserCircle />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.zerpWalletBalanceUsers || 0}</h3>
                  <p>Total Users Zero Wallet Balance</p>
                </div>
              </div>
            </div>
          </>
        )}
        {hasPermission("active_users") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/active_users")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/totalwinamount.png`}
                  alt="Users Today"
                  style={{ maxWidth: 50 }}
                />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.users_totalActive || 0}</h3>
                <p>Total Active Users</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("inactive_users") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/inactive_users")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <FaUserCheck />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.users_totalInactive || 0}</h3>
                <p>Total Inactive Users</p>
              </div>
            </div>
          </div>
        )}
        <h2>Deposit</h2>
        {hasPermission("deposite_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }} // 👈 shows pointer on hover
            >
              <div className="icon_money">
                <PiHandDepositBold />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_today_pending?.amount || 0}</h3>
                <p>Today Deposit Pending</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_complete") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <FaUserCheck />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_today_success?.amount || 0}</h3>
                <p>Today Deposit Success</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("deposite_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <IoMdClose />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_today_reject?.amount || 0}</h3>
                <p>Today Deposit Reject</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("deposite_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_today_pending?.count || 0}</h3>
                <p>Today Deposit Pending Count</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("deposite_complete") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <PiListNumbersFill />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_today_success?.count || 0}</h3>
                <p>Today Deposit Success Count</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("deposite_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <AiOutlineClose />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_today_reject?.count || 0}</h3>
                <p>Today Deposit Reject Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_Total_pending?.amount || 0}</h3>
                <p>Total Pending Deposit</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_all_pending?.count || 0}</h3>
                <p>Total Pending Deposit Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_complete") && (
          <>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/deposite_complete")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <PiListNumbersFill />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.deposits_all_success?.amount || 0}</h3>
                  <p>Total Success Deposit</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() =>
                  handleBoxClick("/admin_deposite_report_datewise")
                }
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <PiListNumbersFill />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.todayAdminDeposit}</h3>
                  <p>Total Success Deposit By Admin</p>
                </div>
              </div>
            </div>
          </>
        )}
        {hasPermission("deposite_complete") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <PiListNumbersFill />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_all_success?.count || 0}</h3>
                <p>Total Success Deposit Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <RiCloseCircleLine />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_all_reject?.amount || 0}</h3>
                <p>Total Reject Deposit</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/deposite_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <RiCloseCircleLine />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.deposits_all_reject?.count || 0}</h3>
                <p>Total Reject Deposit Count</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("deposite_pending") && (
          <div className="col-md-3 col-6">
            <div
              //onClick={() => handleBoxClick("/deposite_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }} // 👈 shows pointer on hover
            >
              <div className="icon_money">
                <PiHandDepositBold />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.todayUserBonus || 0}</h3>
                <p>Today User Bonus</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("deposite_complete") && (
          <div className="col-md-3 col-6">
            <div
              // onClick={() => handleBoxClick("/deposite_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <FaUserCheck />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.totalUserBonus || 0}</h3>
                <p>Total User Bonus</p>
              </div>
            </div>
          </div>
        )}



        <h2>Withdraw</h2>
        {hasPermission("withdrawal_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <MdPendingActions />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_today_pending?.amount || 0}</h3>
                <p>Today Withdraw Pending</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("withdrawal_complete") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <RiCloseCircleLine />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_today_success?.amount || 0}</h3>
                <p>Today Withdraw Success</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("withdrawal_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <MdPendingActions />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_today_reject?.amount || 0}</h3>
                <p>Today Withdraw Reject</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_today_pending?.count || 0}</h3>
                <p>Today Withdraw Pending Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_complete") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <PiListNumbersFill />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_today_success?.count || 0}</h3>
                <p>Today Withdraw Success Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <IoMdClose />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_today_reject?.count || 0}</h3>
                <p>Today Withdraw Reject Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <MdPendingActions />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_all_pending?.amount || 0}</h3>
                <p>Total Withdraw Pending</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_all_pending?.count || 0}</h3>
                <p>Total Withdraw Pending Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_complete") && (
          <>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/withdrawal_complete")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <IoMdCloseCircleOutline />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.withdrawals_all_success?.amount || 0}</h3>
                  <p>Total Withdraw Success</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() =>
                  handleBoxClick("/admin_withdrawal_report_datewise")
                }
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <IoMdCloseCircleOutline />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.todayAdminwithdraw}</h3>
                  <p>Total Withdraw Success Manual</p>
                </div>
              </div>
            </div>
          </>
        )}
        {hasPermission("withdrawal_complete") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_complete")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <PiListNumbersFill />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_all_success?.count || 0}</h3>
                <p>Total Withdraw Success Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <MdPendingActions />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_all_reject?.amount || 0}</h3>
                <p>Total Withdraw Reject</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("withdrawal_reject") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/withdrawal_reject")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <MdPendingActions />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.withdrawals_all_reject?.count || 0}</h3>
                <p>Total Withdraw Reject Count</p>
              </div>
            </div>
          </div>
        )}

        <h2>Games</h2>
        {hasPermission("bet_history_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_today_pending?.amount || 0}</h3>
                <p>Today Pending Bet</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("bet_history_success") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_success")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <GiPodiumWinner />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_today_won?.amount || 0}</h3>
                <p>Today Won Bet</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("game_load_bet_loss_lists") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/game_load_bet_loss_lists")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <HiMiniCubeTransparent />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_today_lost?.amount || 0}</h3>
                <p>Today Loss Bet</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("bet_history_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_today_pending?.count || 0}</h3>
                <p>Today Pending Bet Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("bet_history_success") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_success")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <GiPodiumWinner />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_today_won?.count || 0}</h3>
                <p>Today Won Bet Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("game_load_bet_loss_lists") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/game_load_bet_loss_lists")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <HiMiniCubeTransparent />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_today_lost?.count || 0}</h3>
                <p>Today Lost Bet Count</p>
              </div>
            </div>
          </div>
        )}

        {hasPermission("bet_history_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <MdPendingActions />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_all_pending?.amount || 0}</h3>
                <p>Total Bets Pending</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("bet_history_pending") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_pending")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <TbListNumbers />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_all_pending?.count || 0}</h3>
                <p>Total Bets Pending Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("bet_history_success") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_success")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <GiPodiumWinner />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_all_won?.amount || 0}</h3>
                <p>Total Bets Won</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("bet_history_success") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/bet_history_success")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <GiPodiumWinner />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_all_won?.count || 0}</h3>
                <p>Total Bets Won Count</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("game_load_bet_loss_lists") && (
          <div className="col-md-3 col-6">
            <div
              onClick={() => handleBoxClick("/game_load_bet_loss_lists")}
              className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
              style={{ cursor: "pointer" }}
            >
              <div className="icon_money">
                <RiPassPendingFill />
              </div>
              <div className="played_amount">
                <h3>{dashboardData.bets_all_lost?.amount || 0}</h3>
                <p>Total Bets Lost</p>
              </div>
            </div>
          </div>
        )}
        {hasPermission("game_load_bet_loss_lists") && (
          <>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/game_load_bet_loss_lists")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <RiPassPendingFill />
                </div>
                <div className="played_amount">
                  <h3>{dashboardData.bets_all_lost?.count || 0}</h3>
                  <p>Total Bets Lost Count</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/game_report_datewise")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <RiPassPendingFill />
                </div>
                <div className="played_amount">
                  <h3>
                    {dashboardData.bets_today_lost?.amount -
                      dashboardData.bets_today_won?.amount}
                  </h3>
                  <p>Today P/L</p>
                </div>
              </div>
            </div>



            <div className="col-md-3 col-6">
              <div
                onClick={() => handleBoxClick("/game_report_datewise")}
                className="padding_15 bg-white d-flex gap-2 align-items-center mb-3"
                style={{ cursor: "pointer" }}
              >
                <div className="icon_money">
                  <RiPassPendingFill />
                </div>
                <div className="played_amount">
                  <h3>
                    {dashboardData.bets_all_lost?.amount -
                      dashboardData.bets_all_won?.amount}
                  </h3>
                  <p>Total P/L</p>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
      <div className="row color_differnt"></div>
    </div>
  );
};

export default Dashboard;
