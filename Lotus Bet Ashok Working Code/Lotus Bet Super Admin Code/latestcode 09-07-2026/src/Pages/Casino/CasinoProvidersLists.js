import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import ToggleSwitch from "../../Common/ToggleSwitch";
import Loader from "../../Common/Loader";

const CasinoProvidersLists = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [updating, setUpdating] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  const fetchProviders = async (page = currentPage) => {
    try {
      setLoading(true);

      const url = `${process.env.REACT_APP_API_CASINO_URL}/casino-provider-list`;
      console.log("Fetching from URL:", url);

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        const allProviders = response.data.data || [];

        let filteredData = allProviders;
        if (searchTerm) {
          filteredData = allProviders.filter(
            (provider) =>
              provider.providerName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              provider.providerCode
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          );
        }

        if (fromDate) {
          filteredData = filteredData.filter((provider) => {
            const createdAt = new Date(provider.createdAt)
              .toISOString()
              .split("T")[0];
            return createdAt >= fromDate;
          });
        }

        if (toDate) {
          filteredData = filteredData.filter((provider) => {
            const createdAt = new Date(provider.createdAt)
              .toISOString()
              .split("T")[0];
            return createdAt <= toDate;
          });
        }

        setProviders(filteredData);
        setTotalRecords(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / limit));

        // toast.success(response.data.message || "Providers loaded successfully");
      } else {
        toast.error(response.data?.message || "Failed to fetch providers");
        setProviders([]);
      }
    } catch (error) {
      console.error("Error fetching casino providers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch providers");
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateProviderStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const statusText = newStatus === 1 ? "ACTIVE" : "INACTIVE";
      const emoji = newStatus === 1 ? "🟢" : "🔴";

      const result = await Swal.fire({
        title: "Are you sure?",
        html: `
          <div style="text-align: center;">
            <p style="font-size: 18px; margin-bottom: 10px;">
              Do you want to change the status to <strong>${statusText}</strong>?
            </p>
            <p style="font-size: 14px; color: #666;">
              ${emoji} Provider will be ${statusText} for all users
            </p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: `${statusText}`,
        cancelButtonText: "Cancel",
        reverseButtons: true,
        backdrop: "rgba(0,0,0,0.5)",
        allowOutsideClick: false,
        allowEscapeKey: true,
        customClass: {
          popup: "swal2-popup-custom",
          confirmButton: "swal2-confirm-custom",
          cancelButton: "swal2-cancel-custom",
        },
      });

      if (!result.isConfirmed) {
        return;
      }

      setUpdating(id);

      const url = `${process.env.REACT_APP_API_CASINO_URL}/casino-provider-status-update`;
      console.log("Updating status URL:", url);
      console.log("Request Body:", { id, status: newStatus });

      const response = await axios.post(
        url,
        {
          id: id,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        },
      );

      console.log("Update Response:", response.data);

      if (response.data && response.data.success) {
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === id ? { ...provider, status: newStatus } : provider,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Status Updated!",
          text: `Provider is now ${statusText}`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "swal2-popup-custom",
          },
        });
      } else {
        toast.error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating provider status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Function to update order number
  const updateProviderOrder = async (id, orderNumber) => {
    try {
      if (!orderNumber || orderNumber === "") {
        toast.warning("Please enter an order number");
        return;
      }

      if (isNaN(orderNumber)) {
        toast.warning("Please enter a valid number");
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        html: `
          <div style="text-align: center;">
            <p style="font-size: 18px; margin-bottom: 10px;">
              Do you want to update order number to <strong>${orderNumber}</strong>?
            </p>
            <p style="font-size: 14px; color: #666;">
              🔢 Provider order will be updated
            </p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#036300",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Update Order",
        cancelButtonText: "Cancel",
        backdrop: "rgba(0,0,0,0.5)",
        allowOutsideClick: false,
        allowEscapeKey: true,
        customClass: {
          popup: "swal2-popup-custom",
          confirmButton: "swal2-confirm-custom",
          cancelButton: "swal2-cancel-custom",
        },
      });

      if (!result.isConfirmed) {
        return;
      }

      setUpdatingOrder(id);

      const url = `${process.env.REACT_APP_API_CASINO_URL}/casino-provider-order-update`;
      console.log("Updating order URL:", url);
      console.log("Request Body:", { id, order_number: Number(orderNumber) });

      const response = await axios.post(
        url,
        {
          id: id,
          order_number: Number(orderNumber),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        },
      );

      console.log("Update Order Response:", response.data);

      if (response.data && response.data.success) {
        // Update local state with new order number
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider._id === id
              ? { ...provider, order_number: Number(orderNumber) }
              : provider,
          ),
        );

        await Swal.fire({
          icon: "success",
          title: "Order Updated!",
          text: `Order number updated to ${orderNumber}`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "swal2-popup-custom",
          },
        });
      } else {
        toast.error(response.data?.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating provider order:", error);
      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProviders();
  }, []);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProviders(1);
  };

  // Handle clear filters
  const handleClearSearch = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    fetchProviders(1);
  };

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return providers.slice(startIndex, endIndex);
  };

  const StatusToggle = ({ provider }) => {
    const isActive = provider.status === 1;
    const isUpdating = updating === provider._id;

    return (
      <div className="d-flex align-items-center gap-2">
        {isUpdating ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <>
            <ToggleSwitch
              checked={isActive}
              onChange={() =>
                updateProviderStatus(provider._id, provider.status)
              }
            />
          </>
        )}
      </div>
    );
  };

  // ✅ Order Input Component - Shows existing order number
  const OrderInput = ({ provider }) => {
    const [orderValue, setOrderValue] = useState(provider.order_number || ""); // ✅ Show existing order
    const isUpdating = updatingOrder === provider._id;

    // ✅ Update input when provider changes (after update)
    useEffect(() => {
      setOrderValue(provider.order_number || "");
    }, [provider.order_number]);

    const handleOrderUpdate = () => {
      if (orderValue !== "" && !isNaN(orderValue)) {
        updateProviderOrder(provider._id, orderValue);
      } else {
        toast.warning("Please enter a valid number");
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleOrderUpdate();
      }
    };

    return (
      <div className="d-flex align-items-center gap-2">
        <input
          type="number"
          className="form-control form-control-sm"
          style={{ width: "80px" }}
          value={orderValue}
          onChange={(e) => setOrderValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isUpdating}
          placeholder="Order"
        />
        {isUpdating ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOrderUpdate}
            disabled={isUpdating}
          >
            Update
          </Button>
        )}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 1) {
      return <span className="activebadge">Active</span>;
    } else if (status === 0) {
      return <span className="status-badge inactive">Inactive</span>;
    } else {
      return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const hasActiveFilters = searchTerm || fromDate || toDate;

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2 align-items-center">
          <h3 className="card-title mb-0">Casino Provider Lists</h3>

          <div className="d-flex align-items-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Filter Section */}
          <div className="row mb-3 align-items-center gy-2">
            <div className="col-md-3">
              <Form.Control
                type="text"
                placeholder="Search by provider name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <Button variant="primary" onClick={handleSearch} className="me-2">
                <FiSearch /> Search
              </Button>
            </div>
          </div>

          {/* Total Records */}
          <div className="mb-3">
            <small className="text-muted">
              Total Providers: <strong>{totalRecords}</strong>
            </small>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Loader />
              <p>Loading casino providers...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Casino Providers Found</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Provider Name</th>
                      <th>Provider Code</th>
                      <th>Toggle Status</th>
                      <th>Order Number</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {getCurrentPageData().map((item, index) => (
                      <tr key={item._id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>
                          <strong>{item.providerName}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {item.providerCode}
                          </span>
                        </td>
                        <td>
                          <StatusToggle provider={item} />
                        </td>
                        <td>
                          <OrderInput provider={item} />
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <div className="paginationall d-flex align-items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={handlePrev}
                      className="d-flex justify-content-center align-items-center gap-1"
                    >
                      <MdKeyboardDoubleArrowLeft />
                      Previous
                    </button>
                    <div className="d-flex gap-1">
                      {getPageNumbers().map((page) => (
                        <div
                          key={page}
                          className={`paginationnumber ${
                            currentPage === page ? "active" : ""
                          }`}
                          onClick={() => handlePageClick(page)}
                        >
                          {page}
                        </div>
                      ))}
                    </div>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                      className="d-flex justify-content-center align-items-center gap-1"
                    >
                      Next <MdKeyboardDoubleArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ✅ SweetAlert2 Custom Styles */}
      <style jsx>{`
        .swal2-popup-custom {
          border-radius: 12px !important;
          padding: 20px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
        }
        .swal2-confirm-custom {
          border-radius: 8px !important;
          padding: 10px 30px !important;
          font-weight: bold !important;
        }
        .swal2-cancel-custom {
          border-radius: 8px !important;
          padding: 10px 30px !important;
          font-weight: bold !important;
        }
      `}</style>
    </>
  );
};

export default CasinoProvidersLists;
