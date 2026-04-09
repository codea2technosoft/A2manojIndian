import React, { useEffect, useState } from "react";
import { Table, Spinner, Pagination, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function MyAssociates() {
  const [mobile, setMobile] = useState("");
  const [associateName, setAssociateName] = useState("");
  const [checking, setChecking] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  // ✅ Auto fetch associate name when mobile reaches 10 digits
  useEffect(() => {
    const fetchAssociateName = async () => {
      if (mobile.length === 10) {
        setChecking(true);
        setAssociateName("");

        try {
          const token = getAuthToken();
          if (!token) {
            Swal.fire({
              icon: "error",
              title: "Authentication Error",
              text: "Authentication token not found. Please log in again.",
            });
            setChecking(false);
            return;
          }

          const payload = {
            parentid: mobile,
            type: "associate",
          };

          const response = await fetch(`${API_URL}/check-parentid-name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok && data.status === "1" && data.data?.username) {
            setAssociateName(data.data.username);
          } else {
            setAssociateName("");
          }
        } catch (error) {
          console.error("Error fetching associate name:", error);
          setAssociateName("");
        } finally {
          setChecking(false);
        }
      } else {
        setAssociateName("");
      }
    };

    fetchAssociateName();
  }, [mobile]);

  // const fetchUsers = async () => {
  //   if (!mobile) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Missing Input",
  //       text: "Please enter a mobile number",
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/myteam-list-lavel11-excel?mobile=${mobile}`,
  //       { responseType: "blob" }
  //     );

  //     const text = await response.data.text();
  //     try {
  //       const json = JSON.parse(text);
  //       if (json.status === "0") {
  //         Swal.fire({
  //           icon: "info",
  //           title: "Sorry!",
  //           text: json.message || "No data found",
  //         });
  //         return;
  //       }
  //     } catch (e) { }

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `myteam_level11_${mobile}.xlsx`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Warning!",
  //       text: "No data found, please try another.",
  //     });
  //   }
  // };
const fetchUsers = async (e) => {
  // Prevent form submission from refreshing the page
  if (e) e.preventDefault();

  if (!mobile) {
    Swal.fire({
      icon: "warning",
      title: "Missing Input",
      text: "Please enter a mobile number",
    });
    return; // stop execution here
  }

  try {
    const response = await axios.get(
      `${API_URL}/myteam-list-lavel11-excel?mobile=${mobile}`,
      { responseType: "blob" }
    );

    const text = await response.data.text();
    try {
      const json = JSON.parse(text);
      if (json.status === "0") {
        Swal.fire({
          icon: "info",
          title: "Sorry!",
          text: json.message || "No data found",
        });
        return;
      }
    } catch (e) { }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `My 11 Level Team ${mobile}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: "No data found, please try another.",
    });
  }
};

  return (
    <>
      <div className="padding_15">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                Download My 11 Level Team In Excel.
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <div className="card">
                      <div className="card-body">
                        <form  onSubmit={fetchUsers}>
                          <div className="mb-3 form-group" id="formEmail">
                            <label className="form-label fw-bold">Enter Mobile Number</label>
                            <input

                              type="text"
                              placeholder="Enter Mobile Number"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              maxLength="10"
                            />
                          </div>
                          <div className="text-center">
                            {checking && (
                              <p style={{ color: "gray", marginBottom: "10px" }}>
                                Checking associate name...
                              </p>
                            )}
                            {associateName && (
                              <p style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
                                Name: {associateName}
                              </p>
                            )}
                          </div>
                          <div className="submitbutton">
                            <button  type="submit" className="submitbutton_design">
                              Download Excel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>




              </div>
            </div>
          </div>
        </div>
      </div>


    </>

  );
}

export default MyAssociates;
