// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUserById, updateUser } from "../../Server/api"; // You'll need these APIs

// function EditUser({ fetchUsers }) {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get user ID from URL

//   const [formData, setFormData] = useState({
//     username: "",
//     mobile: "",
//     email: "",
//     password: "",
//     user_status: 1,
//     fancy_min_bet: "",
//     fancy_max_bet: "",
//     odds_min_bet: "",
//     odds_max_bet: "",
//     bookmaker_min_bet: "",
//     bookmaker_max_bet: "",
//     min_withdraw: "",
//     max_withdraw: ""
//   });

//   const [validated, setValidated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch user data when component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await getUserById(id);
//         if (response.data && response.data.success) {
//           const userData = response.data.data;
//           setFormData({
//             username: userData.username || "",
//             mobile: userData.mobile || "",
//             email: userData.email || "",
//             password: "",
//             user_status: userData.user_status !== undefined ? userData.user_status : 1,
//             fancy_min_bet: userData.fancy_min_bet || "",
//             fancy_max_bet: userData.fancy_max_bet || "",
//             odds_min_bet: userData.odds_min_bet || "",
//             odds_max_bet: userData.odds_max_bet || "",
//             bookmaker_min_bet: userData.bookmaker_min_bet || "",
//             bookmaker_max_bet: userData.bookmaker_max_bet || "",
//             min_withdraw: userData.min_withdraw || "",
//             max_withdraw: userData.max_withdraw || ""

//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         Swal.fire("Error", "Failed to load user data", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchUserData();
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "username") {
//       if (/^[A-Za-z\s]*$/.test(value)) {
//         setFormData((prev) => ({ ...prev, username: value }));
//       }
//     } else if (name === "mobile") {
//       if (/^\d{0,10}$/.test(value)) {
//         setFormData((prev) => ({ ...prev, mobile: value }));
//       }
//     }

//     else if (name === "min_withdraw" || name === "max_withdraw") {
//       // ✅ ONLY NUMBERS ALLOW FOR WITHDRAW
//       if (/^\d*$/.test(value)) {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//       }
//     }

//     else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setValidated(true);
//   console.log("SUBMIT DATA 👉", formData);
//     const isValid =
//       /^[A-Za-z\s]+$/.test(formData.username) &&
//       /^\d{10}$/.test(formData.mobile) &&
//       formData.email.includes("@");
//     if (!isValid) return;

//     try {
//       const response = await updateUser(id, formData);
//       if (response.data && response.data.success) {
//         await Swal.fire({
//           icon: "success",
//           title: "User Updated",
//           text: "The user has been updated successfully!",
//           timer: 1000,
//           showConfirmButton: false,
//         });

//         if (fetchUsers) fetchUsers();
//         navigate("/all_users");
//       } else {
//         Swal.fire({
//           icon: "warning",
//           title: "Warning",
//           text: response.data.message || "Failed to update user.",
//         });
//       }
//     } catch (err) {
//       console.error("Update Error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to update user.",
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="row mt-3">
//       <div className="col-lg-12">
//         <div className="card">
//           <div className="card-header bg-color-black">
//             <div className="d-flex align-items-center justify-content-between">
//               <h3 className="card-title text-white">Edit User</h3>
//             </div>
//           </div>

//           <div className="card-body">
//             <form
//               noValidate
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               onSubmit={handleSubmit}
//             >
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     User Name <span style={{ color: "red" }}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="username"
//                     placeholder="Enter user name"
//                     value={formData.username}
//                     onChange={handleChange}

//                   />
//                   <div className="invalid-feedback">
//                     Only letters and spaces are allowed.
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Mobile <span style={{ color: "red" }}>*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${validated && !/^\d{10}$/.test(formData.mobile)
//                       ? "is-invalid"
//                       : validated && /^\d{10}$/.test(formData.mobile)
//                         ? "is-valid"
//                         : ""
//                       }`}
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     placeholder="Enter 10-digit mobile number"
//                     maxLength="10"
//                     inputMode="numeric"

//                   />
//                   <div className="invalid-feedback">
//                     Please enter a valid 10-digit mobile number.
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Email <span style={{ color: "red" }}>*</span>
//                   </label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter email"

//                   />
//                   <div className="invalid-feedback">
//                     Please enter a valid email address.
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter new password (leave blank to keep current)"
//                   />
//                   <div className="invalid-feedback">
//                     Password must be at least 4 characters long.
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label d-block">User Status</label>

//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="userStatusSwitch"
//                       checked={formData.user_status === 1}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           user_status: e.target.checked ? 1 : 0,
//                         }))
//                       }
//                     />
//                     <label
//                       className={`form-check-label fw-bold ${formData.user_status === 1 ? "text-success" : "text-danger"
//                         }`}
//                       htmlFor="userStatusSwitch"
//                     >
//                       {formData.user_status === 1 ? "Active" : "Inactive"}
//                     </label>
//                   </div>
//                 </div>

//                 {/* ===== Bet Limits ===== */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Fancy Min Bet</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="fancy_min_bet"
//                     value={formData.fancy_min_bet}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Fancy Max Bet</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="fancy_max_bet"
//                     value={formData.fancy_max_bet}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Odds Min Bet</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="odds_min_bet"
//                     value={formData.odds_min_bet}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Odds Max Bet</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="odds_max_bet"
//                     value={formData.odds_max_bet}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Bookmaker Min Bet</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="bookmaker_min_bet"
//                     value={formData.bookmaker_min_bet}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Bookmaker Max Bet</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="bookmaker_max_bet"
//                     value={formData.bookmaker_max_bet}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* ===== Withdraw Limits ===== */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Min Withdraw</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="min_withdraw"
//                     value={formData.min_withdraw}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Max Withdraw</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="max_withdraw"
//                     value={formData.max_withdraw}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="col-md-12">
//                   <div className="d-flex justify-content-end">
//                     <button
//                       className="button_submit btn btn-success btn-bordered waves-effect"
//                       type="submit"
//                     >
//                       Update User
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditUser;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../Server/api";
import { BsArrowLeft } from "react-icons/bs";
import { Button } from "react-bootstrap";

function EditUser({ fetchUsers }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    // password: "",
    active: 1,
    fancy_min_bet: "",
    fancy_max_bet: "",
    odds_min_bet: "",
    odds_max_bet: "",
    bookmaker_min_bet: "",
    bookmaker_max_bet: "",
    min_withdraw: "",
    max_withdraw: "",
    min_deposit: "",
    max_deposit: "",
  });

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        if (res.data?.success) {
          const u = res.data.data;
          setFormData({
            username: u.username || "",
            mobile: u.mobile || "",
            email: u.email || "",
            // password: "",
            active: u.active ?? 1,
            fancy_min_bet: u.fancy_min_bet || "",
            fancy_max_bet: u.fancy_max_bet || "",
            odds_min_bet: u.odds_min_bet || "",
            odds_max_bet: u.odds_max_bet || "",
            bookmaker_min_bet: u.bookmaker_min_bet || "",
            bookmaker_max_bet: u.bookmaker_max_bet || "",
            min_withdraw: u.min_withdraw || "",
            max_withdraw: u.max_withdraw || "",
            min_deposit: u.min_deposit || "",
            max_deposit: u.max_deposit || "",
          });
        }
      } catch {
        Swal.fire("Error", "Failed to load user", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      if (/^[A-Za-z\s]*$/.test(value))
        setFormData({ ...formData, username: value });
      return;
    }

    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) setFormData({ ...formData, mobile: value });
      return;
    }

    if (name === "min_withdraw" || name === "max_withdraw") {
      if (/^\d*$/.test(value)) setFormData({ ...formData, [name]: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("SUBMIT DATA 👉", formData);

    try {
      const res = await updateUser(id, formData);
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "User Updated",
          timer: 1200,
          showConfirmButton: false,
        });
        fetchUsers?.();
        navigate("/all_users");
      } else {
        Swal.fire("Warning", res.data.message || "Update failed", "warning");
      }
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  // ================= UI =================
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-dark text-white  d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">Edit User</h3>
            <Button variant="light" onClick={() => navigate(-1)}>
              <BsArrowLeft className="me-1" /> Back
            </Button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* USERNAME */}
                <div className="col-md-6 mb-3">
                  <label>User Name</label>
                  <input
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                {/* MOBILE */}
                <div className="col-md-6 mb-3">
                  <label>Mobile</label>
                  <input
                    className="form-control"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL */}
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* PASSWORD */}
                {/* <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                  />
                </div> */}

                {/* USER STATUS */}
                <div className="col-md-6 mb-3">
                  <label>User Status</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.active == 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          active: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                    <span
                      className={`ms-2 fw-bold ${
                        formData.active == 1
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {formData.active == 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* BET LIMITS */}
                <div className="col-md-6 mb-3">
                  <label>Fancy Min Bet</label>
                  <input
                    className="form-control"
                    name="fancy_min_bet"
                    value={formData.fancy_min_bet}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Fancy Max Bet</label>
                  <input
                    className="form-control"
                    name="fancy_max_bet"
                    value={formData.fancy_max_bet}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Odds Min Bet</label>
                  <input
                    className="form-control"
                    name="odds_min_bet"
                    value={formData.odds_min_bet}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Odds Max Bet</label>
                  <input
                    className="form-control"
                    name="odds_max_bet"
                    value={formData.odds_max_bet}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Bookmaker Min Bet</label>
                  <input
                    className="form-control"
                    name="bookmaker_min_bet"
                    value={formData.bookmaker_min_bet}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Bookmaker Max Bet</label>
                  <input
                    className="form-control"
                    name="bookmaker_max_bet"
                    value={formData.bookmaker_max_bet}
                    onChange={handleChange}
                  />
                </div>

                {/* WITHDRAW */}
                <div className="col-md-6 mb-3">
                  <label>Min Withdraw</label>
                  <input
                    className="form-control"
                    name="min_withdraw"
                    value={formData.min_withdraw}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Max Withdraw</label>
                  <input
                    className="form-control"
                    name="max_withdraw"
                    value={formData.max_withdraw}
                    onChange={handleChange}
                  />
                </div>

                {/* DEPOSIT LIMITS */}
                {/* <div className="col-md-6 mb-3">
  <label>Min Deposit</label>
  <input
    className="form-control"
    name="min_deposit"
    value={formData.min_deposit}
    onChange={handleChange}
  />
</div>

<div className="col-md-6 mb-3">
  <label>Max Deposit</label>
  <input
    className="form-control"
    name="max_deposit"
    value={formData.max_deposit}
    onChange={handleChange}
  />
</div> */}

                {/* SUBMIT */}
                <div className="col-md-12 text-end">
                  <button type="submit" className="btn btn-success">
                    Update User
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
