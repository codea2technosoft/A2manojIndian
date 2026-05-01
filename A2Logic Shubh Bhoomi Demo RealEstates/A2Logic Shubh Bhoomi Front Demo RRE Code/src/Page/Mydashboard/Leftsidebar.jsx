import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa"; // ✏️ Pencil Icon
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

import {
  MdDashboard,
  MdPerson,
  MdBookmark,
  MdList,
  MdEmail,
} from "react-icons/md";
import { BsTelephone, BsSend } from "react-icons/bs";
function Leftsidebar() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

  const [imageUrl, setimageUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.status === "1") {
          setProfile(data.data);
          setimageUrl(data.imagePath);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  const location = useLocation();

  // Function to check if route is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  return (
    <div className="Leftsidebar">
      <div className="user_sidebar">
        <div className="property_dashboard_navbar">
          <div className="dash_user_avater">
            {/* {profile?.profile ? (
              <img
                src={
                  profile.profile
                    ? profile.profile.includes("http")
                      ? profile.profile
                      : `${imageUrl}${profile.profile}`
                    : "/public/icons/dummy_profile.png" 
                }
                alt="Profile"
                className="img-fluid avater"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
                // onError={(e) => {
                //   e.target.onerror = null;
                //   e.target.src = "/public/icons/dummy_profile.png";
                // }}
              />
            ) : (
              <div className="text-muted">No profile image</div>
            )} */}

            <div className="position-relative">
               {profile && profile.profile ? (
                  <img
                    src={`${profileImage}${profile.profile}`}
                    onError={(e) => {
                      e.target.onerror = null;
e.target.src = process.env.PUBLIC_URL + '/icons/userimage.png';
                    }}
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
src={process.env.PUBLIC_URL + '/icons/userimage.png'}
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
            {profile && (
              <div className="btn_edit alleditbutton">
                <label
                  htmlFor="fileUpload"
                  className="edit_btn_label d-flex align-items-center gap-1"
                  style={{
                    justifyContent: "flex-start",
                  }}
                >
                  <FaPencilAlt />
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    try {
                      const token = localStorage.getItem("token");
                      const formData = new FormData();
                      formData.append("image", file); // 👈 Use correct key expected by backend

                      const response = await fetch(
                        `${process.env.REACT_APP_API_URL}/profile-image-update`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            // DO NOT set 'Content-Type' for FormData
                          },
                          body: formData,
                        }
                      );

                      const data = await response.json();

                      if (response.ok && data.status == "1") {
                        Swal.fire({
                          icon: "success",
                          title: "Image Updated",
                          text: "✅ Profile image updated successfully!",
                          confirmButtonColor: "#226d36",
                        }).then((response) => {
                          if (response.isConfirmed) {
                            window.location.reload();
                          }
                        });
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Warning",
                          text: "! Internal Server Error",
                          confirmButtonColor: "#90a728ff",
                        });
                      }
                    } catch (err) {
                      console.error("Upload error:", err);
                      Swal.fire({
                        icon: "error",
                        title: "Error Found",
                        text: "❌ Some things went wrongs",
                        confirmButtonColor: "#a72828ff",
                      });
                    }
                  }}
                />
              </div>
            )}
            </div>
            <h4>{profile?.username}</h4>
            <span className="usertypedesign">
              Type:&nbsp; (
              {profile?.user_type
                ? profile.user_type.charAt(0).toUpperCase() +
                  profile.user_type.slice(1).toLowerCase()
                : ""}
              )
            </span>
          </div>

          <div className="adgt-wriop-footer py-3 px-3">
            <div className="single-button d-flex align-items-center justify-content-between">
              <button
                type="button"
                className="btn btn-md font--bold btn-light-primary me-2 full-width"
              >
                <BsTelephone className="me-2" />
                {profile?.mobile || "Not available"}
              </button>
            </div>
          </div>

          <div className="dash_user_menues">
            <ul>
              <li className={isActive("/") ? "active" : ""}>
                <Link to="/">
                  <MdDashboard className="me-2" />
                  Dashboard
                </Link>
              </li>
              <li className={isActive("profile") ? "active" : ""}>
                <Link to="profile">
                  <MdPerson className="me-2" />
                  My Profile
                </Link>
              </li>
              <li className={isActive("mybooking") ? "active" : ""}>
                <Link to="mybooking">
                  <MdBookmark className="me-2" />
                  My Booking
                </Link>
              </li>
              <li className={isActive("change-password") ? "active" : ""}>
                <Link to="change-password">
                  <MdList className="me-2" />
                  Change Password
                </Link>
              </li>
              <li className={isActive("paymentreport") ? "active" : ""}>
                <Link to="paymentreport">
                  <MdEmail className="me-2" />
                  Payment Report
                </Link>
              </li>
              <li onClick={handleLogout}>
                <a href="#">
                  <FaPowerOff className="me-2" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leftsidebar;
