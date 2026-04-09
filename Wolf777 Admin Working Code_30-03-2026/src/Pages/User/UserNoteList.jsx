import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserNote } from "../../Server/api";
import { Table, Button, Spinner, Card } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";

function NotesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const body = {
        start: 0,
        length: 50, // page limit
        search: { value: "" },
      };
      const res = await getUserNote(body);
      if (res.data.success) {
        setData(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">Users with Notes</h4>
        <Button variant="light" onClick={() => navigate("/all_users")}>
          <BsArrowLeft className="me-1" />
          Back
        </Button>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Sr No</th>
                {/* <th>User ID</th> */}
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
                    {/* <td>{item.user_id}</td> */}
                    <td>{item.mobile}</td>
                    <td>{item.note}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* View Note */}
                        <button
                          className="me-1 btn btn-sm btn-primary"
                          title="View Note"
                          onClick={() => navigate(`/user-note/${item.user_id}`)}
                        >
                          <FaEye />
                        </button>

                        {/* Edit Note */}
                        <button
                          className="me-1 btn btn-sm btn-primary"
                          title="Edit Note"
                          onClick={() => navigate(`/user-note/${item.user_id}`)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users with notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default NotesList;
