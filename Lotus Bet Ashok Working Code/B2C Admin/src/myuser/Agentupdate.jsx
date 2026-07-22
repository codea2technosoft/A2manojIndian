import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function Agentupdate() {
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({
    code: "",
    name: "",
  });

  // 🔹 Local Dummy Data
  const data = [
    {
      id: 1,
      code: "AG001",
      name: "Rohit",
      super: "Yes",
      doj: "2024-01-10",
      password: "****",
      share: "20%",
      commType: "Flat",
      commMatch: "5%",
      commSession: "2%",
      chips: 5000,
      status: "Active",
    },
    {
      id: 2,
      code: "AG002",
      name: "Amit",
      super: "No",
      doj: "2024-02-15",
      password: "****",
      share: "15%",
      commType: "Flat",
      commMatch: "4%",
      commSession: "1%",
      chips: 3000,
      status: "Inactive",
    },
    {
      id: 3,
      code: "AG003",
      name: "Suresh",
      super: "Yes",
      doj: "2024-03-05",
      password: "****",
      share: "25%",
      commType: "Percent",
      commMatch: "6%",
      commSession: "3%",
      chips: 8000,
      status: "Active",
    },
  ];

  const dropdownRef = useRef(null);

  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    setOpenFilter(null);
  };

  const handleCancel = (key) => {
    setFilters({ ...filters, [key]: "" });
    setOpenFilter(null);
  };

  // 🔹 Filter Logic
  const filteredData = data.filter((item) => {
    const codeMatch = filters.code
      ? item.code.toLowerCase().includes(filters.code.toLowerCase())
      : true;

    const nameMatch = filters.name
      ? item.name.toLowerCase().includes(filters.name.toLowerCase())
      : true;

    return codeMatch && nameMatch;
  });

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="card Agentupdate">
     <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Agent Details</h5>
       <div className="d-flex gap-2">
         <button className="btn btn-success btn-sm">Back</button>
        <button className="btn btn-success btn-sm">Create</button>
        <button className="btn btn-success btn-sm">Update</button>
       </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>

                {/* Code */}
                <th rowSpan={2} className="position-relative">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Code</span>
                    <FiSearch onClick={() => toggleFilter("code")} />
                  </div>

                  {openFilter === "code" && (
                    <div ref={dropdownRef} className="filter-dropdown">
                      <input
                        className="form-control mb-2"
                        placeholder="Search Code"
                        value={filters.code}
                        onChange={(e) =>
                          handleChange("code", e.target.value)
                        }
                      />
                     <div className="d-flex gap-2">
                         <button className="btn btn-sm btn-primary w-100" onClick={handleSearch}>
                        Search
                      </button>
                      <button className="btn btn-sm btn-outline-secondary w-100" onClick={() => handleCancel("code")}>
                        Cancel
                      </button>
                     </div>
                    </div>
                  )}
                </th>

                {/* Name */}
                <th rowSpan={2} className="position-relative">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Name</span>
                    <FiSearch onClick={() => toggleFilter("name")} />
                  </div>

                  {openFilter === "name" && (
                    <div ref={dropdownRef} className="filter-dropdown">
                      <input
                        className="form-control mb-2"
                        placeholder="Search Name"
                        value={filters.name}
                        onChange={(e) =>
                          handleChange("name", e.target.value)
                        }
                      />
                    <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary w-100" onClick={handleSearch}>
                        Search
                      </button>
                      <button className="btn btn-sm btn-outline-secondary w-100" onClick={() => handleCancel("name")}>
                        Cancel
                      </button>
                    </div>
                    </div>
                  )}
                </th>

                <th rowSpan={2}>C.chip</th>
                <th rowSpan={2}>Add / Minus Limit</th>
                <th rowSpan={2}>Action</th>
              
              </tr>

             
            </thead>

            {/* ✅ Local Data Rows */}
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={row.id}>
                    <td className="text-center">{index + 1}</td>
                    <td></td>
                    <td>{row.code}</td>
                    <td>{row.name}</td>
                  
                    <td className="text-center">
                     <button
  className={`btn btn-sm d-flex align-items-center gap-1 ${
    row.status === "Active" ? "btn-success" : "btn-danger"
  }`}
>
  {row.status === "Active" ? (
    <>
      <FaCheckCircle size={14} />
      Active
    </>
  ) : (
    <>
      <FaTimesCircle size={14} />
      Inactive
    </>
  )}
</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center text-muted">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Agentupdate;
