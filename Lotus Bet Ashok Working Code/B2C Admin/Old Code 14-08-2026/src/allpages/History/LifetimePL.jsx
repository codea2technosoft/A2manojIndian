import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import Swal from "sweetalert2";

import {
  GetAllLifetimePL,
  getUserProfileData
} from "../../Server/api";

const LifetimePL = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const role = searchParams.get('role') || localStorage.getItem("role") || 3;
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    mobileNumber: '-',
  });
  
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [balanceSummary, setBalanceSummary] = useState({
    total_deposit: 0,
    total_withdraw: 0,
    balance: 0,
    final_pl: 0
  });
  const [userInfo, setUserInfo] = useState({
    username: '',
    admin_id: '',
    phoneNumber: ''
  });
  const [details, setDetails] = useState({
    deposit_count: 0,
    withdraw_count: 0,
    bet_count: 0
  });

  // Fetch user profile data - Sirf User (role 3) ke liye
  const fetchUserProfile = async () => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        role: parseInt(role) || 3
      };
      
      console.log("Fetching user profile with payload:", payload);
      
      const response = await getUserProfileData(payload);
      console.log("User Profile Response:", response);
      
      // ✅ Sahi tarah se data extract karo
      const profileData = response?.data?.data?.user_profile || 
                         response?.data?.user_profile || 
                         response?.data?.data || 
                         response?.data || 
                         {};
      
      console.log("Profile Data:", profileData);
      
      // ✅ User ID extract karo
      const userIdFromProfile = profileData._id || profileData.user_id || profileData.id;
      console.log("User ID from profile:", userIdFromProfile);
      
      if (userIdFromProfile) {
        setUserId(userIdFromProfile);
      }
      
      const username = profileData.username || profileData.name || adminId;
      localStorage.setItem("headerUserName", username);
      
      setUserData({
        name: username,
        username: username,
        mobileNumber: profileData.phoneNumber || profileData.mobile || profileData.mobileNumber || '-'
      });
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load profile data",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Lifetime PL Data - /balance-summary API
  const fetchLifetimePL = async () => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    setTableLoading(true);
    try {
      // ✅ Payload mein admin_id aur user_id dono bhejo
      const payload = {
        admin_id: adminId,
        user_id: userId  // ✅ User ID bhi add karo
      };
      
      console.log("Fetching Balance Summary with payload:", payload);
      
      const response = await GetAllLifetimePL(payload);
      console.log("Balance Summary Response:", response);
      
      // ✅ Check if response is successful
      if (response?.status === false || response?.success === false) {
        throw new Error(response?.message || "Failed to fetch data");
      }
      
      const responseData = response?.data || response || {};
      const dataObj = responseData.data || responseData || {};
      
      // ✅ Extract user info
      if (dataObj.user) {
        setUserInfo({
          username: dataObj.user.username || '-',
          admin_id: dataObj.user.admin_id || '-',
          phoneNumber: dataObj.user.phoneNumber || '-'
        });
      }
      
      // ✅ Extract balance summary
      if (dataObj.balance_summary) {
        setBalanceSummary({
          total_deposit: dataObj.balance_summary.total_deposit || 0,
          total_withdraw: dataObj.balance_summary.total_withdraw || 0,
          balance: dataObj.balance_summary.balance || 0,
          final_pl: dataObj.balance_summary.final_pl || 0
        });
      }
      
      // ✅ Extract details
      if (dataObj.details) {
        setDetails({
          deposit_count: dataObj.details.deposit_count || 0,
          withdraw_count: dataObj.details.withdraw_count || 0,
          bet_count: dataObj.details.bet_count || 0
        });
      }
      
    } catch (error) {
      console.error("Error fetching Balance Summary:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message || "Failed to fetch data",
        confirmButtonText: "OK",
      });
    } finally {
      setTableLoading(false);
    }
  };

  // ✅ Effect to fetch profile and then PL data
  useEffect(() => {
    const loadData = async () => {
      await fetchUserProfile();
      // ✅ Profile fetch hone ke baad PL data fetch karo
      if (userId) {
        await fetchLifetimePL();
      }
    };
    
    loadData();
  }, []);

  // ✅ Separate effect to fetch PL when userId changes
  useEffect(() => {
    if (userId) {
      fetchLifetimePL();
    }
  }, [userId]);

  return (
    <>
      <Layout activeItem="lifetime-PL">
        <div className="inner-wrapper">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading profile...</p>
            </div>
          ) : (
            <section className="account-table w-100">
              {/* Balance Summary Table */}
              <div className="profile-tab">
                <div className="row">
                  <div className="col-lg-7 col-md-12">
                    <h2 className="common-heading">Balance Summary</h2>

                    {tableLoading ? (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary spinner-border-sm"></div>
                        <p className="mt-2">Loading data...</p>
                      </div>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col" colSpan={2} className="text-start">About Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-start" style={{ fontWeight: 'bold' }}>Total Deposit</td>
                            <td className="text-start" style={{ color: '#28a745', fontWeight: 'bold' }}>
                              {balanceSummary.total_deposit.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-start" style={{ fontWeight: 'bold' }}>Total withdraw</td>
                            <td className="text-start" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                              -{balanceSummary.total_withdraw.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-start" style={{ fontWeight: 'bold' }}>Balance</td>
                            <td className="text-start" style={{ color: '#28a745', fontWeight: 'bold' }}>
                              {balanceSummary.balance.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-start" style={{ fontWeight: 'bold' }}>Final PL</td>
                            <td className="text-start" style={{ 
                              color: balanceSummary.final_pl >= 0 ? '#0c0b0b' : '#dc3545', 
                              fontWeight: 'bold' 
                            }}>
                              {balanceSummary.final_pl.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
};

export default LifetimePL;