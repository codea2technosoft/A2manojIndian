import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaUndo } from "react-icons/fa";
import { getDeletedUsers, restoreUser } from "../../Server/api"; // API import
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

function DeletedUsers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Deleted Users fetch
  const fetchDeletedUsers = async () => {
    try {
      const response = await getDeletedUsers();
      console.log("resposne", response);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Restore User
  const handleRestore = async (userId) => {
    try {
      const response = await restoreUser(userId);
      console.log("response", response);
      if (response.data.success) {
        alert("User restored successfully");
        fetchDeletedUsers(); // list refresh
      }
    } catch (error) {
      console.error(error);
      alert("Failed to restore user");
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <Card>
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">Deleted Users</h4>
        <Button variant="light" onClick={() => navigate("/all_users")}>
           <BsArrowLeft className="me-1" />Back
        </Button>
      </Card.Header>
      <Card.Body>
        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Sr No</th>
              <th>Mobile</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.mobile}</td>
                  <td>{item.note}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/user-note/${item.user_id}`)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/user-note/${item.user_id}`)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleRestore(item._id)}
                      >
                        <FaUndo />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No deleted users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default DeletedUsers;
