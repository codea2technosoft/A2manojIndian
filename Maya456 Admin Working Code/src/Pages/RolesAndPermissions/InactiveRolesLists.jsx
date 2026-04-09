import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdAssignmentTurnedIn } from "react-icons/md";

function CreatedRolesList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalPassword, setModalPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminUserId, setAdminUserId] = useState(null);
  const [permissionData, setPermissionData] = useState([]);
  const [trueStatusKeys, setTrueStatusKeys] = useState([]);

  let cachedAdminPermissions = [];

  const [UserType, setUserType] = useState("");
  // const parentCheckboxRefs = useRef({});
  const usersPerPage = 20;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserProfile();
    if (UserType) {
      fetchUsers(UserType);
    }
  }, [UserType]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
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
      if (res.ok && result.success === "1") {
        // alert(result.data.roles);
        setUserType(result.data.roles); // ✅ Set userType from API
        fetchUsers(result.data.roles);
        setAdminUserId(result.data._id);
      } else {
        Swal.fire("Error", "Failed to fetch user profile", "error");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const fetchUsers = async (UserType) => {
    setLoading(false);
    try {
      let apiUrl;
      let roleToFilter;
      if (UserType === "tech_admin") {
        apiUrl = `${process.env.REACT_APP_API_URL}/admin-inactivelist`;
        roleToFilter = "admin";
      } else if (UserType === "admin") {
        apiUrl = `${process.env.REACT_APP_API_URL}/sub-admin-inactive-list`;
        roleToFilter = "sub_admin";
      } else {
        throw new Error("Invalid user type");
      }
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roles: roleToFilter }),
      });

      const result = await res.json();

      if (result.success === "1") {
        const filteredUsers = result.data.filter(
          (user) => user.roles === roleToFilter || user.type === roleToFilter
        );
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        setLoading(true);
      } else {
        Swal.fire("Error", result.message || "Failed to fetch users", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (_id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}admin-update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: _id, status: newStatus }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire("Success", "User status updated", "success");
      } else {
        throw new Error(result.message || "Failed to update user status");
      }
      fetchUsers(UserType);
    } catch (error) {
      Swal.fire("Error", error.message || "An error occurred", "error");
    }
  };

  const openModal = (_id, currentPassword) => {
    setModalUserId(_id);
    setModalPassword(currentPassword);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalUserId(null);
    setModalPassword("");
    setModalOpen(false);
  };

  const handlePasswordSubmit = async () => {
    if (!modalPassword || modalPassword.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}admin-update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: modalUserId, password: modalPassword }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire("Success", "Password updated successfully", "success");
        closeModal();
        fetchUsers(UserType);
      } else {
        throw new Error(result.message || "Password update failed");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Server error", "error");
    }
  };

  const openPermissionModal = async (userId) => {
    setSelectedUserId(userId);
    setSelectedPermissions([]);
    setPermissionModalOpen(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin-permissions-list`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            // user_id: UserType === "admin" ? adminUserId : userId,
          }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        if (result.data.length > 0) {
          const apiResponse = result.data[0];
          // console.warn("result.data", result.data[0]);
          // Update state based on API response
          if (UserType == "tech_admin") {
            setData((prevData) => {
              return prevData.map((category) => {
                const apiCategory = apiResponse.permissions.find(
                  (c) => c.id === category.id
                );
                if (!apiCategory) return category;

                return {
                  ...category,
                  checked: apiCategory.checked,
                  indeterminate: calculateIndeterminate(apiCategory.children),
                  children: category.children.map((child) => {
                    const apiChild = apiCategory.children.find(
                      (c) => c.id === child.id
                    );
                    return apiChild
                      ? { ...child, checked: apiChild.checked }
                      : child;
                  }),
                };
              });
            });
          } else {
            console.warn("apiResponse.permissions", apiResponse.permissions);
            setData1sub(apiResponse.permissions);

            console.warn("data1", data1sub);
            console.warn("dataaaaa1", UserType);
            // alert("opopop");
            // setData((prevData) => {
            //   const filteredData = prevData
            //     .map((category) => {
            //       const apiCategory = apiResponse.permissions.find(
            //         (c) => c.id === category.id
            //       );
            //       if (!apiCategory) return null;

            //       // Filter children based on API response
            //       const filteredChildren = category.children.filter((child) => {
            //         const apiChild = apiCategory.children.find(
            //           (c) => c.id === child.id
            //         );
            //         return apiChild?.checked;
            //       });

            //       // Keep category only if it has checked children (ignore its own checked state)
            //       return filteredChildren.length > 0
            //         ? {
            //             ...category,
            //             children: filteredChildren,
            //           }
            //         : null;
            //     })
            //     .filter(Boolean);

            //   return filteredData;
            // });
          }
        }
      }
    } catch (err) {
      console.error("Error loading permissions:", err);
    }
  };

  const closePermissionModal = () => {
    setPermissionModalOpen(false);
    setSelectedUserId(null);
    setSelectedPermissions([]);
  };

  const handlePermissionSubmit = async () => {
    if (!selectedUserId) {
      Swal.fire("Warning", "No user selected", "warning");
      return;
    }
    const permissionsPayload = {};
    const permissions = permissionsPayload[0]?.Permissions || [];
    console.log("permissions:", permissions);
    const trueCount = permissions.filter(
      (perm) => perm.Status === true || perm.Status === "true"
    ).length;
    console.log("trueCount:", trueCount);
    if (trueCount < 1) {
      Swal.fire("Warning", "Please select at least one permission", "warning");
      return;
    }
    const payload = {
      user_id: selectedUserId,
      permissions: permissionsPayload,
    };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin-set-permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire("Success", "Permissions assigned successfully", "success");
        closePermissionModal();
      } else {
        throw new Error(result.message || "Failed to assign permissions");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }
  };
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      user.email?.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };
  const [data, setData] = useState([
    {
      id: "home",
      name: "Home",
      checked: false,
      indeterminate: false,
      children: [{ id: "dashboard", name: "Dashboard", checked: false }],
    },

    {
      id: "adminchat",
      name: "Admin Chat",
      checked: false,
      indeterminate: false,
      children: [{ id: "adminchat", name: "Adminchat", checked: false }],
    },

    {
      id: "roles_permission",
      name: "Roles & Permissions",
      checked: false,
      indeterminate: false,
      children: [
        { id: "create_roles", name: "Create Roles", checked: false },
        { id: "all_roles", name: "All Roles", checked: false },
        // { id: "active_roles", name: "Active Roles", checked: false },
        // { id: "inactive_roles", name: "Inactive Roles", checked: false },
      ],
    },
    {
      id: "Application_User",
      name: "Application User",
      checked: false,
      indeterminate: false,
      children: [
        { id: "create_user", name: "Create User", checked: false },
        { id: "all_users", name: "All Users", checked: false },
        // { id: "active_users", name: "Active Users", checked: false },
        // { id: "inactive_users", name: "Inactive Users", checked: false },
        // {
        //   id: "user_wallet_balance",
        //   name: "User Wallet Balance",
        //   checked: false,
        // },
      ],
    },
    {
      id: "Market",
      name: "Market",
      checked: false,
      indeterminate: false,
      children: [
        { id: "main_market_list", name: "Main Market", checked: false },
        {
          id: "king_jack_port_market_list",
          name: "King Jack Port Market",
          checked: false,
        },
        {
          id: "king_starline_market_list",
          name: "King Starline Market List",
          checked: false,
        },
      ],
    },

    {
      id: "GameLoadMarket",
      name: "GameLoadMarket",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "main_market_game_load",
          name: "Main Market Game Load",
          checked: false,
        },
        {
          id: "king_jackport_game_load",
          name: "King Jack Port Game Load",
          checked: false,
        },
        {
          id: "king_starline_game_load",
          name: "King Starline Game Load",
          checked: false,
        },
      ],
    },

    {
      id: "withdrawal",
      name: "Withdrawal",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "withdrawal_pending",
          name: "Withdrawal Pending",
          checked: false,
        },
        {
          id: "withdrawal_complete",
          name: "Withdrawal Approved",
          checked: false,
        },
        {
          id: "withdrawal_reject",
          name: "Withdrawal Reject",
          checked: false,
        },

        {
          id: "withdrawal_report_datewise",
          name: "Withdrawal Report Datewise",
          checked: false,
        },

        {
          id: "withdrawal_pending_Approve",
          name: "Withdrawal Pre Approved",
          checked: false,
        },

        {
          id: "admin_withdrawal_report_datewise",
          name: "Admin Withdrawal Datewise Report",
          checked: false,
        },
      ],
    },

    {
      id: "bank_accounts",
      name: "BankAccounts",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "bank_account_pending",
          name: "Bank Account Pending",
          checked: false,
        },
        {
          id: "bank_account_complete",
          name: "Bank Account Complete",
          checked: false,
        },
        {
          id: "bank_account_reject",
          name: "Bank Account Reject",
          checked: false,
        },
      ],
    },

    {
      id: "deposite",
      name: "Deposits",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "deposite_pending",
          name: "Deposit Pending",
          checked: false,
        },
        {
          id: "deposite_complete",
          name: "Deposit Approve",
          checked: false,
        },
        {
          id: "deposite_reject",
          name: "Deposit Reject",
          checked: false,
        },

        {
          id: "deposite_report_datewise",
          name: "Deposit Report Datewise",
          checked: false,
        },

        {
          id: "admin_deposite_report_datewise",
          name: "Admin Deposite Datewise Report",
          checked: false,
        },
      ],
    },

    // {
    //   id: "point_management",
    //   name: "Point Management",
    //   checked: false,
    //   indeterminate: false,
    //   children: [
    //     {
    //       id: "point_management_add_point",
    //       name: "Point Management Add Point",
    //       checked: false,
    //     },
    //     {
    //       id: "point_management_deduct_point",
    //       name: "Point Management Deduct Point",
    //       checked: false,
    //     },
    //     {
    //       id: "point_user_wallet_balance",
    //       name: "Point User Wallet Balance",
    //       checked: false,
    //     },
    //     {
    //       id: "admin_add_point_history",
    //       name: "Admin Add Point History",
    //       checked: false,
    //     },
    //     {
    //       id: "auto_point_add_history",
    //       name: "Auto Point Add History",
    //       checked: false,
    //     },
    //   ],
    // },
    {
      id: "bet_history",
      name: "Bet History",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "bet_history_pending",
          name: "Bet History Pending",
          checked: false,
        },
        {
          id: "bet_history_success",
          name: "Win Bet List",
          checked: false,
        },

        {
          id: "game_load_bet_loss_lists",
          name: "Loss Bet List",
          checked: false,
        },
        {
          id: "game_report_datewise",
          name: "Bet Report Datewise",
          checked: false,
        },
      ],
    },

    {
      id: "declear_result",
      name: "Declear Result",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "declare_main",
          name: "Declare Main",
          checked: false,
        },
        {
          id: "declare_king_jack",
          name: "Declare King Jack",
          checked: false,
        },
        {
          id: "declare_king_starline",
          name: "Declare King Starline",
          checked: false,
        },
      ],
    },
    // {
    //   id: "running_game",
    //   name: "Running Game",
    //   checked: false,
    //   indeterminate: false,
    //   children: [
    //     {
    //       id: "running_main_market_lists",
    //       name: "Running Main Market Lists",
    //       checked: false,
    //     },
    //     {
    //       id: "running_king_jack_port_lists",
    //       name: "Running King Jack Port Lists",
    //       checked: false,
    //     },
    //     {
    //       id: "running_king_starline_lists",
    //       name: "Running King Starline Lists",
    //       checked: false,
    //     },
    //   ],
    // },
    {
      id: "all_game_rate",
      name: "All Game Rate",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "update_rates",
          name: "update_rates",
          checked: false,
        },
      ],
    },
    // {
    //   id: "report_management",
    //   name: "Report Management",
    //   checked: false,
    //   indeterminate: false,
    //   children: [
    //     {
    //       id: "bidding_report",
    //       name: "Bidding Report",
    //       checked: false,
    //     },
    //     {
    //       id: "user_bidding_report",
    //       name: "User Bidding Report",
    //       checked: false,
    //     },
    //     {
    //       id: "user_full_bidding_report",
    //       name: "User Full Bidding Report",
    //       checked: false,
    //     },
    //     {
    //       id: "user_transactions_history",
    //       name: "User Transactions History",
    //       checked: false,
    //     },
    //     {
    //       id: "user_winner_history",
    //       name: "User Winner History",
    //       checked: false,
    //     },
    //     {
    //       id: "user_result_analysis_history",
    //       name: "User Result Analysis History",
    //       checked: false,
    //     },
    //   ],
    // },
    {
      id: "notice_management",
      name: "Notice Management",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "notice_management",
          name: "Notice Management",
          checked: false,
        },
      ],
    },
    {
      id: "App Settings",
      name: "app_settings",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "config",
          name: "App Setting",
          checked: false,
        },

        {
          id: "video_lists",
          name: "Video Lists",
          checked: false,
        },

        {
          id: "idea_submit_lists",
          name: "Idea Submit Lists",
          checked: false,
        },

        {
          id: "slider_lists",
          name: "Slider Lists",
          checked: false,
        },

        {
          id: "color_lists",
          name: "Color Lists",
          checked: false,
        },
      ],
    },

    {
      id: "PayIn Gateway Settings",
      name: "pay_in_gateway_settings",
      checked: false,
      indeterminate: false,
      children: [
        {
          id: "pay_in_gateway_settings",
          name: "PayIn Gateway Settings",
          checked: false,
        },
      ],
    },
  ]);
  const [data1sub, setData1sub] = useState([]);
  const parentCheckboxRefs = useRef({});

  // Update indeterminate state when data changes
  useEffect(() => {
    data.forEach((category) => {
      const ref = parentCheckboxRefs.current[category.id];
      if (ref) {
        const someChecked = category.children.some((c) => c.checked);
        const allChecked = category.children.every((c) => c.checked);
        ref.indeterminate = someChecked && !allChecked;
      }
    });
  }, [data]);

  const getSelectedItems = () => {
    const selected = [];
    data.forEach((category) => {
      if (category.checked) {
        selected.push(category.name);
      }
      category.children.forEach((child) => {
        if (child.checked) {
          selected.push(`${category.name} > ${child.name}`);
        }
      });
    });
    return selected;
  };

  const calculateIndeterminate = (children) => {
    const checkedCount = children.filter((child) => child.checked).length;
    return checkedCount > 0 && checkedCount < children.length;
  };

  const toggleParent = (parentId) => {
    setData((prevData) => {
      return prevData.map((category) => {
        if (category.id !== parentId) return category;

        const newChecked = !category.checked;
        return {
          ...category,
          checked: newChecked,
          indeterminate: false,
          children: category.children.map((child) => ({
            ...child,
            checked: newChecked,
          })),
        };
      });
    });
  };

  const toggleParentsub = (parentId) => {
    setData1sub((prevData) => {
      return prevData.map((category) => {
        if (category.id !== parentId) return category;

        const newChecked = !category.checked;
        return {
          ...category,
          checked: newChecked,
          indeterminate: false,
          children: category.children.map((child) => ({
            ...child,
            checked: newChecked,
          })),
        };
      });
    });
  };

  //   const toggleParentsub = (parentId) => {
  //   setData1sub(prevData =>
  //     prevData.map(category => {
  //       if (category.id === parentId) {
  //         const newCheckedState = !category.checked;
  //         // Update all children to match parent's state
  //         const updatedChildren = category.children.map(child => ({
  //           ...child,
  //           checked: newCheckedState
  //         }));

  //         return {
  //           ...category,
  //           checked: newCheckedState,
  //           children: updatedChildren
  //         };
  //       }
  //       return category;
  //     })
  //   );
  // };

  const toggleChild = (parentId, childId) => {
    setData((prevData) => {
      return prevData.map((category) => {
        if (category.id !== parentId) return category;

        const updatedChildren = category.children.map((child) => {
          if (child.id !== childId) return child;
          return { ...child, checked: !child.checked };
        });

        const allChecked = updatedChildren.every((child) => child.checked);
        const someChecked = updatedChildren.some((child) => child.checked);

        return {
          ...category,
          checked: allChecked,
          indeterminate: someChecked && !allChecked,
          children: updatedChildren,
        };
      });
    });
  };

  // const toggleChildsub = (parentId, childId) => {
  //   setData1sub((prevData) => {
  //     return prevData.map((category) => {
  //       if (category.id !== parentId) return category;

  //       const updatedChildren = category.children.map((child) => {
  //         if (child.id !== childId) return child;
  //         return { ...child, checked: !child.checked };
  //       });

  //       const allChecked = updatedChildren.every((child) => child.checked);
  //       const someChecked = updatedChildren.some((child) => child.checked);

  //       return {
  //         ...category,
  //         checked: allChecked,
  //         indeterminate: someChecked && !allChecked,
  //         children: updatedChildren,
  //       };
  //     });
  //   });
  // };

  const toggleChildsub = (parentId, childId) => {
    setData1sub((prevData) =>
      prevData.map((category) => {
        if (category.id === parentId) {
          const updatedChildren = category.children.map((child) =>
            child.id === childId ? { ...child, checked: !child.checked } : child
          );

          const shouldParentBeChecked = updatedChildren.some(
            (child) => child.checked
          );

          return {
            ...category,
            children: updatedChildren,
            checked: shouldParentBeChecked,
          };
        }
        return category;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare data for API submission
    // data1sub;
    if (UserType == "admin") {
      var submissionData = data1sub.map((category) => ({
        id: category.id,
        name: category.name,
        checked: category.checked,
        children: category.children.map((child) => ({
          id: child.id,
          name: child.name,
          checked: child.checked,
        })),
      }));
    } else {
      var submissionData = data.map((category) => ({
        id: category.id,
        name: category.name,
        checked: category.checked,
        children: category.children.map((child) => ({
          id: child.id,
          name: child.name,
          checked: child.checked,
        })),
      }));
    }

    console.warn("Submitting:", submissionData);

    const payload = {
      user_id: selectedUserId,
      permissions: submissionData,
    };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin-set-permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire("Success", "Permissions assigned successfully", "success");
        closePermissionModal();
      } else {
        throw new Error(result.message || "Failed to assign permissions");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error", "error");
    }

    // Here you would make your API call with submissionData
  };

  return (
    <div className="userlist mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Inactive Roles & Permissions List
            </h3>
            {/* <Link to="/create_roles" className="btn btn-success">
              <FaPlus /> Add
            </Link> */}
            <div className="form-design-fillter d-flex justify-content-end search_bar ml-auto">
                <input
                  type="text"
                  placeholder="Search by Email"
                  className="form-control"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
          </div>
        </div>

        <div className="card-body">

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Roles</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user, index) => (
                        <tr key={user._id}>
                          <td>{indexOfFirstUser + index + 1}</td>
                          <td>{user.email}</td>
                          <td>{user.password}</td>
                          <td>
                            {user.roles.charAt(0).toUpperCase() +
                              user.roles.slice(1).toLowerCase()}
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={user.status === "active"}
                                onChange={() =>
                                  handleToggleStatus(user._id, user.status)
                                }
                              />
                              <label className="form-check-label">
                                {user.status === "active" ? "ON" : "OFF"}
                              </label>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                className="actionbutton edit"
                                onClick={() =>
                                  openModal(user._id, user.password)
                                }
                                data-tooltip="Change Password"
                              >
                                <RiLockPasswordLine />
                              </button>

                              {/* <button
                                className="actionbutton success"
                                onClick={() => openPermissionModal(user._id)}
                                data-tooltip="Assign"
                              >
                                <MdAssignmentTurnedIn />
                              </button> */}
                              {/* {user.roles == "subadmin" ? (
                                <button
                                  className="actionbutton success"
                                  onClick={() =>
                                    openPermissionModalSubadmin(user._id)
                                  }
                                  data-tooltip="Assign"
                                >
                                  <MdAssignmentTurnedIn />
                                </button>
                              ) : ( */}
                              <button
                                className="actionbutton success"
                                onClick={() => openPermissionModal(user._id)}
                                data-tooltip="Assign"
                              >
                                <MdAssignmentTurnedIn />
                              </button>
                              {/* )} */}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="paginationbutton"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="alllistnumber">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="paginationbutton"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              {modalOpen && (
                <div
                  className="modal fade show"
                  style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                  tabIndex="-1"
                  onClick={closeModal}
                >
                  <div
                    className="modal-dialog"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Password</h5>
                        <button
                          className="btn-close"
                          onClick={closeModal}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <label htmlFor="newPassword">New Password</label>

                        <input
                          type="text"
                          id="newPassword"
                          className="form-control"
                          value={modalPassword}
                          onChange={(e) => {
                            console.log("Password typing:", e.target.value);
                            setModalPassword(e.target.value);
                          }}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn btn-success"
                          onClick={handlePasswordSubmit}
                        >
                          Update
                        </button>
                        <button className="btn btn-danger" onClick={closeModal}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {permissionModalOpen && (
                <div
                  className="modal fade show"
                  style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                  tabIndex="-1"
                  onClick={closePermissionModal}
                >
                  <div
                    className="modal-dialog modal-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          Assign Admin Permissions
                        </h5>
                        <button
                          className="btn-close"
                          onClick={closePermissionModal}
                        ></button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                          <div className="row">
                            <div
                              className="row"
                              style={{ marginBottom: "20px" }}
                            >
                              {UserType == "admin"
                                ? data1sub.map((category) => (
                                    <div
                                      className="col-md-3"
                                      key={category.id}
                                      style={{ marginBottom: "15px" }}
                                    >
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          ref={(el) =>
                                            (parentCheckboxRefs.current[
                                              category.id
                                            ] = el)
                                          }
                                          checked={
                                            UserType === "admin" &&
                                            category.id === "roles_permission"
                                              ? false
                                              : category.checked
                                          }
                                          onChange={() =>
                                            toggleParentsub(category.id)
                                          }
                                          disabled={
                                            category.id === "roles_permission"
                                          }
                                          style={{ marginRight: "8px" }}
                                        />
                                        <span style={{ fontWeight: "bold" }}>
                                          {category.name}
                                        </span>
                                      </label>

                                      <div
                                        style={{
                                          marginLeft: "25px",
                                          marginTop: "5px",
                                        }}
                                      >
                                        {category.children.map((child) => (
                                          <label
                                            key={child.id}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                category.id ===
                                                "roles_permission"
                                                  ? false
                                                  : child.checked
                                              }
                                              onChange={() =>
                                                toggleChildsub(
                                                  category.id,
                                                  child.id
                                                )
                                              }
                                              disabled={
                                                category.id ===
                                                "roles_permission"
                                              }
                                              style={{ marginRight: "8px" }}
                                            />
                                            {child.name}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                : data.map((category) => (
                                    <div
                                      className="col-md-3"
                                      key={category.id}
                                      style={{ marginBottom: "15px" }}
                                    >
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          ref={(el) =>
                                            (parentCheckboxRefs.current[
                                              category.id
                                            ] = el)
                                          }
                                          checked={
                                            UserType === "admin" &&
                                            category.id === "roles_permission"
                                              ? false
                                              : category.checked
                                          }
                                          onChange={() =>
                                            toggleParent(category.id)
                                          }
                                          style={{ marginRight: "8px" }}
                                        />
                                        <span style={{ fontWeight: "bold" }}>
                                          {category.name}
                                        </span>
                                      </label>

                                      <div
                                        style={{
                                          marginLeft: "25px",
                                          marginTop: "5px",
                                        }}
                                      >
                                        {category.children.map((child) => (
                                          <label
                                            key={child.id}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={child.checked}
                                              onChange={() =>
                                                toggleChild(
                                                  category.id,
                                                  child.id
                                                )
                                              }
                                              style={{ marginRight: "8px" }}
                                            />
                                            {child.name}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                              {/* <button type="submit">Submit</button> */}
                            </div>

                            <div
                              style={{
                                marginTop: "20px",
                                padding: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                              }}
                            >
                              <h3>Selected Items:</h3>
                              <ul>
                                <div className="row">
                                  {getSelectedItems().map((item, index) => (
                                    <div className="col-md-6">
                                      <li key={index}>{item}</li>
                                    </div>
                                  ))}
                                </div>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-success" type="submit">
                            Add
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={closePermissionModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatedRolesList;
