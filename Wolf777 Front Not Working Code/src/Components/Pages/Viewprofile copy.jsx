import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const nodeMode = process.env.NODE_ENV;
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const [phonenum, setPhonenum] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseUrl}/getProfil/${userId}`);

        if (response.data.success) {
          setPhonenum(response.data.user.mobile);
          setBalance(response.data.user.balance || 0);
        } else {
          setError(response.data.message || "Failed to fetch user");
        }
      } catch (err) {
        console.error(err);
        setError("Server error or network issue");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [baseUrl]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h2 style={{ marginBottom: "25px", fontSize: "24px", color: "#2c3e50" }}>User Info</h2>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: "600", fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          Phone Number
        </p>
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#1abc9c" }}>{phonenum}</p>
      </div>

      <div>
        <p style={{ fontWeight: "600", fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          Balance
        </p>
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#e67e22" }}>₹ {balance}</p>
      </div>
    </div>
  );
};

export default UserProfile;



///////////
// import React, { useEffect, useState } from "react";
// import axios from "axios";
//     const nodeMode = process.env.NODE_ENV;
//     const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
//     const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
//     const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

// function App() {
//   const [contacts, setContacts] = useState([]);
//   const [name, setName] = useState("");
//   const [number, setNumber] = useState("");
//   const [image, setImage] = useState(null);
//   const [isActive, setIsActive] = useState(true);
//   const [editId, setEditId] = useState(null);

//   // Fetch all contacts
//   const fetchContacts = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/contacts`);
//       if (res.data.success) setContacts(res.data.data);
//     } catch (err) {
//       console.error("Error fetching contacts:", err);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   // Add or update contact
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !number) return alert("Name and Number required!");

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("number", number);
//     formData.append("isActive", isActive);
//     if (image) formData.append("image", image);

//     try {
//       if (editId) {
//         await axios.put(`${baseUrl}/contacts/${editId}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Contact updated!");
//       } else {
//         await axios.post(`${baseUrl}/contacts`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Contact added!");
//       }
//       resetForm();
//       fetchContacts();
//     } catch (err) {
//       console.error(err);
//       alert("Error saving contact");
//     }
//   };

//   const resetForm = () => {
//     setName("");
//     setNumber("");
//     setImage(null);
//     setIsActive(true);
//     setEditId(null);
//   };

//   // Edit contact
//   const handleEdit = (contact) => {
//     setEditId(contact._id);
//     setName(contact.name);
//     setNumber(contact.number);
//     setIsActive(contact.isActive);
//   };

//   // Delete contact
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure to delete?")) return;
//     try {
//       await axios.delete(`${baseUrl}/contacts/${id}`);
//       fetchContacts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Toggle active/inactive
//   const toggleActive = async (id) => {
//     try {
//       await axios.patch(`${baseUrl}/contacts/${id}/toggle-active`);
//       fetchContacts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center">{editId ? "Edit Contact" : "Add Contact"}</h2>

//       <form onSubmit={handleSubmit} className="mb-5">
//         <div className="mb-3">
//           <label className="form-label">Name</label>
//           <input
//             type="text"
//             className="form-control"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter Name"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Number</label>
//           <input
//             type="text"
//             className="form-control"
//             value={number}
//             onChange={(e) => setNumber(e.target.value)}
//             placeholder="Enter Number"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Image</label>
//           <input
//             type="file"
//             className="form-control"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </div>

//         <div className="form-check mb-3">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             checked={isActive}
//             onChange={(e) => setIsActive(e.target.checked)}
//             id="activeCheck"
//           />
//           <label className="form-check-label" htmlFor="activeCheck">
//             Active
//           </label>
//         </div>

//         <button type="submit" className="btn btn-success">
//           {editId ? "Update" : "Add"}
//         </button>
//         {editId && (
//           <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
//             Cancel
//           </button>
//         )}
//       </form>

//       <h4>Contacts List</h4>
//       <div className="row">
//         {contacts.map((c) => (
//           <div className="col-md-3 mb-4" key={c._id}>
//             <div className="card shadow">
//               {c.imageUrl ? (
//                 <img src={c.imageUrl} className="card-img-top" alt={c.name} />
//               ) : (
//                 <div className="text-center py-4 text-muted">No Image</div>
//               )}
//               <div className="card-body">
//                 <h5 className="card-title">{c.name}</h5>
//                 <p className="card-text">{c.number}</p>
//                 <p>
//                   Status:{" "}
//                   <span
//                     className={`badge ${c.isActive ? "bg-success" : "bg-danger"}`}
//                     style={{ cursor: "pointer" }}
//                     onClick={() => toggleActive(c._id)}
//                   >
//                     {c.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </p>
//                 <button
//                   className="btn btn-sm btn-primary me-2"
//                   onClick={() => handleEdit(c)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-sm btn-danger"
//                   onClick={() => handleDelete(c._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;








