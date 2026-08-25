import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  createPayingatewaySettings,
  getAllPayingatewaySettings,
  getPayingatewaySetting,
  updatePayingatewaySettings,
  deletePayingatewaySettings,
  changePayingatewaySettingsStatus,
} from "../Server/api";

function Banks() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [addFormData, setAddFormData] = useState({
    depositType: '',
    account_name: '',
    ifsc_code: '',
    bank_name: '',
    account_number: '',
    depositLimit: '',
    discount: '',
    upi_id: '',
    image: null
  });

  // Function to fix image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    let url = imagePath;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }
    url = url.replace(/\\/g, '/');
    return url;
  };

  // Fetch all banks
  useEffect(() => {
    fetchAllBanks();
  }, []);

  const fetchAllBanks = async () => {
    setLoading(true);
    try {
      const response = await getAllPayingatewaySettings('');
      if (response.data && response.data.data) {
        const formattedData = response.data.data.map((item) => ({
          _id: item._id,
          accountName: item.accountName || '',
          depositType: item.depositType || '',
          depositDetail: {
            accountNumber: item.account_number || '',
            bankName: item.bank_name || '',
            ifscCode: item.ifsc_code || '',
            upiId: item.upi_id || '',
            qrCode: getImageUrl(item.image)
          },
          createdDate: item.createdDate ? new Date(item.createdDate).toLocaleString() : new Date().toLocaleString(),
          depositLimit: item.depositLimit || '',
          discount: item.discount || '0',
          status: item.status == 1 ? 'on' : 'off',
        }));
        setBankData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = async (bank) => {
    setEditLoading(true);
    try {
      const response = await getPayingatewaySetting(bank._id);

      if (response.data && response.data.data) {
        const data = response.data.data;

        const bankObj = {
          _id: data._id,
          depositType: data.depositType || data.type || '',
          accountName: data.accountName || data.name || '',
          depositLimit: data.depositLimit || data.max || '',
          discount: data.discount || '0',
          status: data.status == 1 ? 'on' : 'off',
          account_number: data.account_number || '',
          bank_name: data.bank_name || '',
          ifsc_code: data.ifsc_code || '',
          upi_id: data.upi_id || '',
          qr_code: getImageUrl(data.image),
          image: data.image
        };

        setSelectedBank(bankObj);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch bank details',
        confirmButtonColor: '#d33',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBank(null);
    setEditLoading(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files) {
      setSelectedBank(prev => ({
        ...prev,
        image: files[0]
      }));
    } else if (name === 'depositType') {
      const currentData = selectedBank;
      const newType = value;

      const baseData = {
        _id: currentData._id,
        accountName: currentData.accountName || '',
        depositLimit: currentData.depositLimit || '',
        discount: currentData.discount || '0',
        status: currentData.status || 'off'
      };

      let typeSpecificData = {};

      if (newType === 'bankTransfer') {
        typeSpecificData = {
          account_number: currentData.account_number || '',
          bank_name: currentData.bank_name || '',
          ifsc_code: currentData.ifsc_code || '',
          upi_id: '',
          qr_code: ''
        };
      } else if (newType === 'UPI') {
        typeSpecificData = {
          upi_id: currentData.upi_id || '',
          account_number: '',
          bank_name: '',
          ifsc_code: '',
          qr_code: ''
        };
      } else if (newType === 'QR') {
        typeSpecificData = {
          upi_id: currentData.upi_id || '',
          qr_code: currentData.qr_code || '',
          account_number: '',
          bank_name: '',
          ifsc_code: ''
        };
      } else if (newType === 'online') {
        typeSpecificData = {
          account_number: '',
          bank_name: '',
          ifsc_code: '',
          upi_id: '',
          qr_code: ''
        };
      }

      setSelectedBank({
        ...baseData,
        depositType: newType,
        ...typeSpecificData
      });
    } else {
      setSelectedBank(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Update Bank - With Sweet Alert
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const formData = new FormData();

      const payload = {
        accountName: selectedBank.accountName,
        depositType: selectedBank.depositType,
        depositLimit: selectedBank.depositLimit,
        depositDiscount: selectedBank.discount || '0',
        status: selectedBank.status === 'on' ? '1' : '0'
      };

      if (selectedBank.depositType === 'bankTransfer') {
        payload.account_number = selectedBank.account_number;
        payload.ifsc_code = selectedBank.ifsc_code;
        payload.bank_name = selectedBank.bank_name;
      } else if (selectedBank.depositType === 'UPI') {
        payload.upi_id = selectedBank.upi_id;
      } else if (selectedBank.depositType === 'QR') {
        payload.upi_id = selectedBank.upi_id;
        if (selectedBank.image && typeof selectedBank.image !== 'string') {
          formData.append('image', selectedBank.image);
        }
      }
      // Online ke liye kuch extra nahi, bas accountName use hoga

      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });

      const response = await updatePayingatewaySettings(formData, selectedBank._id);

      if (response.data && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: response.data.message || 'Payment setting updated successfully!',
          confirmButtonColor: '#3085d6',
          timer: 3000,
          timerProgressBar: true,
        });
        await fetchAllBanks();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update bank',
        confirmButtonColor: '#d33',
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Bank - With Sweet Alert
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await deletePayingatewaySettings(id);

          if (response.data && response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: response.data.message || 'Bank deleted successfully!',
              confirmButtonColor: '#3085d6',
              timer: 3000,
              timerProgressBar: true,
            });
            await fetchAllBanks();
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete bank',
            confirmButtonColor: '#d33',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Toggle Status - With Sweet Alert
  const handleStatusToggle = async (id, currentStatus) => {
    setLoading(true);
    try {
      const newStatus = currentStatus === 'on' ? '0' : '1';
      const response = await changePayingatewaySettingsStatus(id, newStatus);

      if (response.data && response.data.success) {
        const statusText = newStatus === '1' ? 'ON' : 'OFF';
        Swal.fire({
          icon: 'success',
          title: `Status Changed!`,
          text: `Bank status is now ${statusText}`,
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true,
        });
        await fetchAllBanks();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to change status',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add Bank - With Sweet Alert
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddFormData({
      depositType: '',
      account_name: '',
      ifsc_code: '',
      bank_name: '',
      account_number: '',
      depositLimit: '',
      discount: '',
      upi_id: '',
      image: null
    });
    setErrors({});
  };

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name === 'image' && files) {
      setAddFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (name === 'depositType') {
      setAddFormData(prev => ({
        ...prev,
        depositType: value,
        account_number: '',
        bank_name: '',
        ifsc_code: '',
        upi_id: '',
        image: null
      }));
    } else {
      setAddFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validation function
  const validateAddForm = () => {
    const newErrors = {};
    
    if (!addFormData.depositType) {
      newErrors.depositType = 'Please select deposit type';
    }
    
    if (!addFormData.account_name || addFormData.account_name.trim() === '') {
      newErrors.account_name = 'Please enter account name';
    }
    
    if (addFormData.depositType === 'bankTransfer') {
      if (!addFormData.ifsc_code || addFormData.ifsc_code.trim() === '') {
        newErrors.ifsc_code = 'Please enter IFSC code';
      }
      if (!addFormData.bank_name || addFormData.bank_name.trim() === '') {
        newErrors.bank_name = 'Please enter bank name';
      }
      if (!addFormData.account_number || addFormData.account_number.trim() === '') {
        newErrors.account_number = 'Please enter account number';
      }
    }
    
    if (addFormData.depositType === 'UPI') {
      if (!addFormData.upi_id || addFormData.upi_id.trim() === '') {
        newErrors.upi_id = 'Please enter UPI ID';
      }
    }
    
    if (addFormData.depositType === 'QR') {
      if (!addFormData.upi_id || addFormData.upi_id.trim() === '') {
        newErrors.upi_id = 'Please enter UPI ID';
      }
      if (!addFormData.image) {
        newErrors.image = 'Please upload QR code image';
      }
    }
    
    // Online ke liye alag validation nahi, bas account_name required hai
    if (addFormData.depositType === 'online') {
      // account_name already required hai upar
    }
    
    if (!addFormData.depositLimit || addFormData.depositLimit <= 0) {
      newErrors.depositLimit = 'Please enter valid deposit limit';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateAddForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();

      const payload = {
        accountName: addFormData.account_name, // Online ke liye yehi gateway name hoga
        depositType: addFormData.depositType,
        depositLimit: addFormData.depositLimit,
        depositDiscount: addFormData.discount || '0',
        status: '0'
      };

      if (addFormData.depositType === 'bankTransfer') {
        payload.account_number = addFormData.account_number;
        payload.ifsc_code = addFormData.ifsc_code;
        payload.bank_name = addFormData.bank_name;
      } else if (addFormData.depositType === 'UPI') {
        payload.upi_id = addFormData.upi_id;
      } else if (addFormData.depositType === 'QR') {
        payload.upi_id = addFormData.upi_id;
        if (addFormData.image) {
          formData.append('image', addFormData.image);
        }
      }
      // Online ke liye kuch extra nahi, bas accountName send ho raha hai

      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });

      const response = await createPayingatewaySettings(formData);

      if (response.data && response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: response.data.message || 'Bank added successfully!',
          confirmButtonColor: '#3085d6',
          timer: 3000,
          timerProgressBar: true,
        });
        await fetchAllBanks();
        handleCloseAddModal();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to add bank',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allcommon">
      <section className="main-inner-outer py-3">
        <div className="db-sec d-flex justify-content-between align-items-center w-100 mb-2">
          <h2 className="common-heading">Banks</h2>
          <button className="theme_dark_btn" onClick={handleOpenAddModal}>+ Add Bank</button>
        </div>
        <div className="inner-wrapper">
          <div className="common-container">
            <div className="account-table batting-table">
              <div className="responsive">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Sr no.</th>
                        <th scope="col">Account Name / Gateway Name</th>
                        <th scope="col">Deposit Type</th>
                        <th scope="col">Deposit Detail</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Deposit Limit</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Action</th>
                        <th scope="col">ON/OFF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankData.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center">No banks found</td>
                        </tr>
                      ) : (
                        bankData.map((bank, index) => (
                          <tr key={bank._id || index}>
                            <td>{index + 1}</td>
                            <td className='text-capitalize'>{bank.accountName}</td>
                            <td>{bank.depositType}</td>
                            <td style={{ width: "20%" }}>
                              {bank.depositType === 'bankTransfer' ? (
                                <div className="div-inner">
                                  <p>Account Number : {bank.depositDetail.accountNumber}</p>
                                  <p>Bank Name : {bank.depositDetail.bankName}</p>
                                  <p>IFSC Code : {bank.depositDetail.ifscCode}</p>
                                </div>
                              ) : bank.depositType === 'online' ? (
                                <div>
                                  <p>Gateway Name : {bank.accountName}</p>
                                </div>
                              ) : (
                                <div>
                                  <p>UPI ID : {bank.depositDetail.upiId}</p>
                                  {bank.depositDetail.qrCode && (
                                    <div>
                                      <p>QR Code :</p>
                                      <img
                                        className="m-0 p-0"
                                        width="100px"
                                        height="100px"
                                        src={bank.depositDetail.qrCode}
                                        alt="QR Code"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                        }}
                                        style={{ objectFit: 'contain' }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td>{bank.createdDate}</td>
                            <td>{bank.depositLimit}</td>
                            <td>{bank.discount}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ background: "green", color: "white", marginRight: "5px" }}
                                onClick={() => handleEditClick(bank)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                style={{ background: "red", color: "white" }}
                                onClick={() => handleDelete(bank._id)}
                              >
                                Delete
                              </button>
                            </td>
                            <td>
                              <div className="form-check form-check-inline form-switch ps-0">
                                <input
                                  type="checkbox"
                                  className="form-check-input ms-0"
                                  checked={bank.status === 'on'}
                                  onChange={() => handleStatusToggle(bank._id, bank.status)}
                                />
                                <label title="" className="form-check-label" />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showModal && selectedBank && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Bank Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {editLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEditSubmit} className='row'>
                    <div className="mb-3 col-12 col-md-6">
                      <label className="form-label">Bank Type</label>
                      <select className="form-select" value="deposit" disabled>
                        <option value="deposit">Deposit</option>
                      </select>
                      <small className="text-muted">Bank type is fixed to Deposit</small>
                    </div>

                    <div className="mb-3 col-12 col-md-6">
                      <label className="form-label">Deposit Type</label>
                      <select
                        name="depositType"
                        className="form-select"
                        value={selectedBank.depositType || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Deposit Type</option>
                        <option value="bankTransfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="QR">QR</option>
                        <option value="online">Online</option>
                      </select>
                    </div>

                    <div className="mb-3 col-12 col-md-6">
                      <label className="form-label">
                        {selectedBank.depositType === 'online' ? 'Gateway Name' : 'Account Name'}
                      </label>
                      <input
                        name="accountName"
                        type="text"
                        className="form-control"
                        placeholder={selectedBank.depositType === 'online' ? 'Enter gateway name' : 'Enter account name'}
                        value={selectedBank.accountName || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {selectedBank.depositType === 'bankTransfer' && (
                      <>
                        <div className="mb-3 col-12 col-md-6">
                          <label className="form-label">IFSC Code</label>
                          <input
                            name="ifsc_code"
                            type="text"
                            className="form-control"
                            value={selectedBank.ifsc_code || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3 col-12 col-md-6">
                          <label className="form-label">Bank Name</label>
                          <input
                            name="bank_name"
                            type="text"
                            className="form-control"
                            value={selectedBank.bank_name || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3 col-12 col-md-6">
                          <label className="form-label">Account Number</label>
                          <input
                            name="account_number"
                            type="text"
                            className="form-control"
                            value={selectedBank.account_number || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </>
                    )}

                    {(selectedBank.depositType === 'UPI' || selectedBank.depositType === 'QR') && (
                      <>
                        <div className="mb-3 col-12 col-md-6">
                          <label className="form-label">UPI ID</label>
                          <input
                            name="upi_id"
                            type="text"
                            className="form-control"
                            value={selectedBank.upi_id || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        {selectedBank.depositType === 'QR' && (
                          <div className="mb-3 col-12 col-md-6">
                            <label className="form-label">QR Code Image</label>
                            <input
                              name="image"
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={handleInputChange}
                            />
                            {selectedBank.qr_code && (
                              <div className="mt-2">
                                <img
                                  src={selectedBank.qr_code}
                                  alt="QR"
                                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <div className="mb-3 col-12 col-md-6">
                      <label className="form-label">Deposit Limit</label>
                      <input
                        name="depositLimit"
                        type="number"
                        className="form-control"
                        value={selectedBank.depositLimit || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3 col-12 col-md-6">
                      <label className="form-label">Deposit Discount</label>
                      <input
                        name="discount"
                        type="number"
                        className="form-control"
                        value={selectedBank.discount || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={editLoading}>
                      {editLoading ? 'Updating...' : 'Update'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal - With Validation */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCloseAddModal}
        >
          <div
            className="modal-dialog modal-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Bank Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddSubmit} noValidate>
                  {/* Bank Type */}
                  <div className="mb-3">
                    <label className="form-label">Bank Type</label>
                    <select className="form-select" value="deposit" disabled>
                      <option value="deposit">Deposit</option>
                    </select>
                    <small className="text-muted">Bank type is fixed to Deposit</small>
                  </div>

                  {/* Deposit Type */}
                  <div className="mb-3">
                    <label className="form-label">Deposit Type <span className="text-danger">*</span></label>
                    <select
                      name="depositType"
                      className={`form-select ${errors.depositType ? 'is-invalid' : ''}`}
                      value={addFormData.depositType}
                      onChange={handleAddChange}
                      required
                    >
                      <option value="">Select Deposit Type</option>
                      <option value="bankTransfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="QR">QR</option>
                      <option value="online">Online</option>
                    </select>
                    {errors.depositType && (
                      <div className="invalid-feedback">{errors.depositType}</div>
                    )}
                  </div>

                  {/* Account Name / Gateway Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      {addFormData.depositType === 'online' ? 'Gateway Name' : 'Account Name'} 
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      name="account_name"
                      type="text"
                      className={`form-control ${errors.account_name ? 'is-invalid' : ''}`}
                      placeholder={addFormData.depositType === 'online' ? 'Enter gateway name (e.g., Paytm, Razorpay)' : 'Enter account name'}
                      value={addFormData.account_name}
                      onChange={handleAddChange}
                      required
                    />
                    {errors.account_name && (
                      <div className="invalid-feedback">{errors.account_name}</div>
                    )}
                  </div>

                  {/* Bank Transfer Fields */}
                  {addFormData.depositType === 'bankTransfer' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">IFSC Code <span className="text-danger">*</span></label>
                        <input
                          name="ifsc_code"
                          type="text"
                          className={`form-control ${errors.ifsc_code ? 'is-invalid' : ''}`}
                          placeholder="Enter IFSC code"
                          value={addFormData.ifsc_code}
                          onChange={handleAddChange}
                          required
                        />
                        {errors.ifsc_code && (
                          <div className="invalid-feedback">{errors.ifsc_code}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Bank Name <span className="text-danger">*</span></label>
                        <input
                          name="bank_name"
                          type="text"
                          className={`form-control ${errors.bank_name ? 'is-invalid' : ''}`}
                          placeholder="Enter bank name"
                          value={addFormData.bank_name}
                          onChange={handleAddChange}
                          required
                        />
                        {errors.bank_name && (
                          <div className="invalid-feedback">{errors.bank_name}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Account Number <span className="text-danger">*</span></label>
                        <input
                          name="account_number"
                          type="text"
                          className={`form-control ${errors.account_number ? 'is-invalid' : ''}`}
                          placeholder="Enter account number"
                          value={addFormData.account_number}
                          onChange={handleAddChange}
                          required
                        />
                        {errors.account_number && (
                          <div className="invalid-feedback">{errors.account_number}</div>
                        )}
                      </div>
                    </>
                  )}

                  {/* UPI & QR Fields */}
                  {(addFormData.depositType === 'UPI' || addFormData.depositType === 'QR') && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">UPI ID <span className="text-danger">*</span></label>
                        <input
                          name="upi_id"
                          type="text"
                          className={`form-control ${errors.upi_id ? 'is-invalid' : ''}`}
                          placeholder="Enter UPI ID"
                          value={addFormData.upi_id}
                          onChange={handleAddChange}
                          required
                        />
                        {errors.upi_id && (
                          <div className="invalid-feedback">{errors.upi_id}</div>
                        )}
                      </div>

                      {addFormData.depositType === 'QR' && (
                        <div className="mb-3">
                          <label className="form-label">QR Code Image <span className="text-danger">*</span></label>
                          <input
                            name="image"
                            type="file"
                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                            accept="image/*"
                            onChange={handleAddChange}
                            required
                          />
                          {errors.image && (
                            <div className="invalid-feedback">{errors.image}</div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Deposit Limit */}
                  <div className="mb-3">
                    <label className="form-label">Deposit Limit <span className="text-danger">*</span></label>
                    <input
                      name="depositLimit"
                      type="number"
                      className={`form-control ${errors.depositLimit ? 'is-invalid' : ''}`}
                      placeholder="Enter deposit limit"
                      value={addFormData.depositLimit}
                      onChange={handleAddChange}
                      required
                    />
                    {errors.depositLimit && (
                      <div className="invalid-feedback">{errors.depositLimit}</div>
                    )}
                  </div>

                  {/* Deposit Discount */}
                  <div className="mb-3">
                    <label className="form-label">Deposit Discount</label>
                    <input
                      name="discount"
                      type="number"
                      className="form-control"
                      placeholder="Enter deposit discount (optional)"
                      value={addFormData.discount}
                      onChange={handleAddChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banks;