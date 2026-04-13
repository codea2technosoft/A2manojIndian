import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Often useful for dashboards
import { FaUserCircle, FaUserCheck } from "react-icons/fa";
import { MdSettings, MdPendingActions, MdAssignmentTurnedIn } from "react-icons/md";
import { PiHandDepositBold, PiListNumbersFill } from "react-icons/pi";
import { TbListNumbers } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdClose, IoMdCloseCircleOutline } from "react-icons/io";
import { RiCloseCircleLine, RiPassPendingFill } from "react-icons/ri";
import { GiPodiumWinner } from "react-icons/gi";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { GoProjectRoadmap } from "react-icons/go";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

// Map string names to actual React Icon components
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
  MdAssignmentTurnedIn: MdAssignmentTurnedIn,
  GoProjectRoadmap: GoProjectRoadmap,
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // States for custom message modal (reused from previous components)
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  // Custom modal for messages
  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  // Helper function to get the authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
          // Optionally redirect to login page
          // navigate('/login');
          return;
        }

        const response = await fetch(`${API_URL}/dashboard-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
            // Optionally redirect to login page
            // navigate('/login');
          } else {
            const errorData = await response.json();
            showCustomMessageModal("Error", errorData.message || "Failed to fetch dashboard data.", "error");
          }
          throw new Error(response.statusText);
        }

        const rawData = await response.json();


        const transformedData = [
          { title: "Today Associates", value: rawData.todayAssociate?.[0]?.total || 0, icon: "FaUserCircle", color: "primary", link: "/today-associate-list" },
          { title: "Today Channels Partner", value: rawData.todayChannel?.[0]?.total || 0, icon: "FaUserCheck", color: "info", link:"/today-channel-list" },
          // { title: "Today Users", value: rawData.todayuser?.[0]?.total || 0, icon: "MdSettings", color: "success" },
          // { title: "Today Projects", value: rawData.todayProject?.[0]?.total || 0, icon: "MdAssignmentTurnedIn", color: "warning", link:"/all-project" },
          // { title: "Today Blocks", value: rawData.todayblock?.[0]?.total || 0, icon: "HiMiniCubeTransparent", color: "danger", link:"/all-block-list" },
          // { title: "Today Plots", value: rawData.todayPlot?.[0]?.total || 0, icon: "PiListNumbersFill", color: "secondary", link:"/all-plot" },

          { title: "Total Associates", value: rawData.AllAssociate?.[0]?.total || 0, icon: "FaUserCircle", color: "primary", link: "/all-associate-list" },
          { title: "Active Associates", value: rawData.ActiveAssociate?.[0]?.total || 0, icon: "FaUserCheck", color: "success", link:"/all-associate-active-list" },
          { title: "Inactive Associates", value: rawData.InactiveAssociate?.[0]?.total || 0, icon: "RiCloseCircleLine", color: "danger", link:"/all-associate-inactive-list" },

          { title: "Total Channels Partner", value: rawData.AllChannel?.[0]?.total || 0, icon: "FaUserCheck", color: "info", link:"/all-channel-list" },
          { title: "Active Channels Partner", value: rawData.ActiveChannel?.[0]?.total || 0, icon: "FaUserCheck", color: "success", link:"/all-channel-active-list" },
          { title: "Inactive Channels Partner", value: rawData.InactiveChannel?.[0]?.total || 0, icon: "RiCloseCircleLine", color: "danger", link:"/all-channel-inactive-list" },

          // { title: "Total Users", value: rawData.Alluser?.[0]?.total || 0, icon: "MdSettings", color: "primary" },
          // { title: "Active Users", value: rawData.Activeuser?.[0]?.total || 0, icon: "MdSettings", color: "success" },
          // { title: "Inactive Users", value: rawData.Inactiveuser?.[0]?.total || 0, icon: "RiCloseCircleLine", color: "danger" },

          { title: "Total Projects", value: rawData.AllProject?.[0]?.total || 0, icon: "MdAssignmentTurnedIn", color: "primary", link:"/all-project" },
          // { title: "Active Projects", value: rawData.ActiveProject?.[0]?.total || 0, icon: "MdAssignmentTurnedIn", color: "success", link:"/active-project" },
          // { title: "Inactive Projects", value: rawData.InactiveProject?.[0]?.total || 0, icon: "RiCloseCircleLine", color: "danger", link:"/inactive-project" },

          // { title: "Total Blocks", value: rawData.Allblock?.[0]?.total || 0, icon: "HiMiniCubeTransparent", color: "primary", link:"/all-block-list" },
          // { title: "Active Blocks", value: rawData.Activeblock?.[0]?.total || 0, icon: "HiMiniCubeTransparent", color: "success", link:"/active-block-list" },
          // { title: "Inactive Blocks", value: rawData.Inactivblock?.[0]?.total || 0, icon: "RiCloseCircleLine", color: "danger", link:"/inactive-block-list" },

          { title: "Total Plots", value: rawData.AllPlot?.[0]?.total || 0, icon: "PiListNumbersFill", color: "primary", link:"/all-plot" },
          { title: "Available Plots", value: rawData.ActivePlot?.[0]?.total || 0, icon: "PiListNumbersFill", color: "success", link:"/active-plot-list" },
          { title: "Sold Plots", value: rawData.InactivePlot?.[0]?.total || 0, icon: "RiCloseCircleLine", color: "danger", link:"/inactive-plot-list" },
          { title: "Total Property Lead", value: rawData.TotalPropertyLead?.[0]?.total || 0, icon: "GoProjectRoadmap", color: "primary"},
          { title: "Today Property Lead", value: rawData.TodayPropertyLead?.[0]?.total || 0, icon: "GoProjectRoadmap", color: "primary"},
          { title: "Total Loan Lead", value: rawData.TotalLoanLead?.[0]?.total || 0, icon: "PiListNumbersFill", color: "primary"},
          { title: "Today Loan Lead", value: rawData.TodayLoanLead?.[0]?.total || 0, icon: "PiListNumbersFill", color: "primary"},
        ];

        setDashboardData(transformedData);
      } catch (err) {
        console.error("Fetch dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="padding_15">
      <div className="dashboard">
      <Row className="g-4">
          {dashboardData.length > 0 ? (
            dashboardData.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              
              return (
                <div key={item.id || index} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                  {/* Make the entire card clickable */}
                  <div 
                    className={`card bg_card_design clickable-card`} 
                    onClick={() => item.link && navigate(item.link)}
                    style={{ cursor: item.link ? 'pointer' : 'default' }}
                  >
                    <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                      {IconComponent && (
                        <div className="icon_dashboard">
                          <IconComponent size={50} className="text-white" />
                        </div>
                      )}
                      <div>
                        <div className="card-title text-dark">{item.title}</div>
                        <div className="card-text">
                          {item.value}
                        </div>
                        
                       
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Col xs={12}>
              <div className="text-center text-muted mt-5">
                No dashboard data available.
              </div>
            </Col>
          )}
        </Row>

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? '' : ''}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-success' : messageModalContent.type === 'error' ? 'text-danger' : 'text-warning'}`}>
                  {messageModalContent.title}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={messageModalContent.type === 'warning' ? 'warning' : 'primary'}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
                    onClick={closeCustomMessageModal}
                  >
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
