import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Statementmasterlist = () => {
  const { admin_id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchStatements = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:9002/api/get-statement",
        {
          admin_id: admin_id, // 👈 send it to backend
        }
      );

      setData(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching statements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin_id) fetchStatements();
  }, [admin_id]);

  return (
    <div className="container mt-3">
      <h4>Statement — {admin_id}</h4>

      {loading && <p>Loading…</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p>No records found.</p>
      )}

      {!loading && data.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>P&L</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{row.date}</td>
                <td>{row.type}</td>
                <td>{row.amount}</td>
                <td>{row.balance}</td>
                <th>0</th>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Statementmasterlist;
