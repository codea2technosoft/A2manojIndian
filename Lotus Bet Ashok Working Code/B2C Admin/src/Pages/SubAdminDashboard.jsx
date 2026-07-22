import { useEffect, useState } from "react";
import { FaUserCircle, FaEye, FaSignOutAlt } from "react-icons/fa";
import { getDashboardSummary, getAllEvents } from "../Server/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import {
  FaUserTie,
  FaGamepad,
  FaCheckCircle,
  FaChartLine,
  FaBook,
  FaMoneyBillWave,
  FaCogs,
  FaUser,
  FaTrophy,
  FaUsers,
  FaChartBar,
  FaInfoCircle,
  FaUserCheck,
  FaUserSlash,
  FaUsers as FaUsersIcon
} from "react-icons/fa";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

/* ---------- Helper ---------- */
function getValue(obj, key) {
  return obj?.[key] ?? 0;
}

const admin_id = localStorage.getItem("admin_id");
console.log("adminid", admin_id)



export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [adminProfile, setAdminProfile] = useState(null);
  const [role2Count, setRole2Count] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalLinks, setModalLinks] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [counts, setCounts] = useState({});
  const [showModalCount, setShowModalCount] = useState(true);
  const [modalTitle, setModalTitle] = useState("");
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0,
    totalPages: 1
  });
  const [pullLoading, setPullLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    is_completed: "",
    is_inplay: ""
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get('sportId');
  const seriesId = searchParams.get('seriesId');
  const navigate = useNavigate();
  


  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;

      if (window.scrollY === 0 && currentY - startY > 80) {
        triggerPullRefresh();
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);


 

  const fetchEvents = async (page = pagination.currentPage, limit = pagination.itemsPerPage) => {
    try {
      setGamesLoading(true);
      const params = {
        page,
        limit,
        search: filters.search,
        status: 1,
        is_completed: filters.is_completed,
        is_inplay: filters.is_inplay
      };
      const response = await getAllEvents(sportId, seriesId, params);

      if (response.data.success) {
        let list = response.data.data || [];

        list = list.sort((a, b) => {
          const dateA = new Date(a.date_time);
          const dateB = new Date(b.date_time);
          return dateA - dateB;
        });

        setGames(list);

        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: response.data.pagination.page || 1,
            itemsPerPage: response.data.pagination.limit || 10,
            totalItems: response.data.pagination.total || 0,
            totalPages: response.data.pagination.totalPages || 1
          }));
        } else {
          setPagination(prev => ({
            ...prev,
            currentPage: page,
            itemsPerPage: limit,
            totalItems: response.data.data?.length || 0,
            totalPages: Math.ceil((response.data.data?.length || 0) / limit)
          }));
        }

        setError("");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setGamesLoading(false);
    }
  };

  const triggerPullRefresh = async () => {
    if (pullLoading) return;
    setPullLoading(true);
    try {
      await fetchEvents(1, pagination.itemsPerPage);
    } finally {
      setTimeout(() => {
        setPullLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchEvents(1, pagination.limit);
  }, [sportId, seriesId]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleMatchClicknew = (market_id, event_id, e) => {
    e.preventDefault();
    localStorage.setItem("event_id", event_id);
    navigate(`/viewmatch-fancy/series_idd/${market_id}/event_id/${event_id}`);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      const nextPage = pagination.currentPage + 1;
      fetchEvents(nextPage, pagination.itemsPerPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      const prevPage = pagination.currentPage - 1;
      fetchEvents(prevPage, pagination.itemsPerPage);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchEvents(page, pagination.itemsPerPage);
    }
  };
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;
    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(pagination.totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const getStatus = (game) => {
    const now = new Date();
    const openDateObj = new Date(game.openDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (game.status === 0) return "INACTIVE";
    if (game.is_inplay === 1) return "INPLAY";

    const gameDate = new Date(game.openDate);
    gameDate.setHours(0, 0, 0, 0);
    if (gameDate.getTime() === today.getTime()) {
      return "INPLAY";
    }

    if (now < openDateObj) return "UPCOMING";
    if (now >= openDateObj) return "INPLAY";

    return "UPCOMING";
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h5>Loading dashboard data...</h5>
      </div>
    );
  }

  return (
    <>      
      <div className="mt-2 activematch">
        <div className="title_all">All Active Match</div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>NAME</th>
                <th>OPEN DATE</th>
                <th>COMPETITION</th>
                <th>STATUS</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No matches found
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game._id}>
                    <td>{game.name}</td>
                    <td>{game.date_time}</td>
                    <td>{game.series_name}</td>
                    <td>
                      <span className={`status-badge ${getStatus(game).toLowerCase()}`}>
                        <span></span>
                        {getStatus(game)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="viewdetailsbutton"
                        onClick={(e) => {
                          handleMatchClicknew(game.market_id, game.event_id, e);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* <GameDetailsModal
            game={detailsOpen ? selectedGame : null}
            onClose={() => setDetailsOpen(false)}
          /> */}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="sohwingallentries">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
          </div>

          <div className="paginationall d-flex align-items-center gap-1">
            <button
              disabled={pagination.currentPage === 1}
              onClick={handlePrevPage}
              className=""
              title="Previous Page"
            >
              <MdOutlineKeyboardArrowLeft />
            </button>

            <div className="d-flex gap-1">
              {getPageNumbers().map((page) => (
                <div
                  key={page}
                  className={`paginationnumber ${pagination.currentPage === page ? "active" : ""}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </div>
              ))}
            </div>

            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={handleNextPage}
              className=""
              title="Next Page"
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          </div>
        </div>
      )}
    </>
  );
}