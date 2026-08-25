import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";
import { WithdrawRequestListsByDate } from "../../Server/api";


const WithdrowDatewiseList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 50;
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchReport();
  }, [currentPage]);

  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   fetchReport();
  // };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  // Search handler

  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };
  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
  };
  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
  };
  const handleFilter = (e) => {
    fetchReport();
  };
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        min: FilterMin,
        max: FilterMax,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      };
      const result = await WithdrawRequestListsByDate(params);


      if (result.data.success) {
        setData(result.data.data || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalRecords(result.data.pagination?.total || 0);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching withdraw summary:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="allcommon">
        <section className="main-inner-outer py-3">
          <div className="container-fluid">
            <div className="db-sec">
              <h2 className="common-heading">Wallet Withdrawal History</h2>
            </div>
            <div className="inner-wrapper">
              <div className="common-container">
                {" "}
                <form className="">
                  <div className="bet_status mb-0">
                    <div className="row">
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3  col-lg-2 col-sm-6">
                        <div className="position-relative">
                          <input
                            placeholder="Keyword"
                            type="text"
                            className="form-control"
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3  col-lg-2 col-sm-6">
                        <div className="position-relative d-flex align-items-center">
                          <select
                            aria-label="Default select example"
                            className="small_select form-select"
                            style={{ height: "2.5rem" }}
                          >
                            <option value="">Select Status</option>
                            <option value="approve">Approve</option>
                            <option value="decline">Decline</option>
                          </select>
                        </div>
                      </div>{" "}
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3  col-lg-2 col-sm-6">
                        <div className="position-relative d-flex align-items-center">
                          <select
                            aria-label="Default select example"
                            className="small_select form-select"
                            style={{ height: "2.5rem" }}
                          >
                            <option value="">All Agent</option>
                            <option value="67d54134b431a39a37ae995b">agvip</option>
                            <option value="684d4e8b77dfc553af84f3f6">yash</option>
                            <option value="684d530477dfc553af85010c">rajini</option>
                        
                          </select>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3  col-lg-3 col-sm-6">
                        <div className="bet-sec bet-period">
                          <label className="px-2 form-label">From</label>
                          <div className="form-group">
                            <input
                              max="2026-07-04"
                              type="date"
                              className="small_form_control form-control"
                              defaultValue="2026-07-03"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 ps-3 col-lg-3 col-sm-6">
                        <div className="bet-sec bet-period">
                          <label className="px-2 form-label">To</label>
                          <div className="form-group">
                            <input
                              min="Sat Jul 04 2026 16:34:23 GMT+0530 (India Standard Time)"
                              max="2026-07-04"
                              type="date"
                              className="small_form_control form-control"
                              defaultValue="2026-07-04"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 d-flex align-items-center col-lg-3 col-sm-6">
                        {" "}
                        <ul className="list-unstyled mb-0 d-flex">
                          <li style={{ marginRight: 15 }}>
                            <button
                              type="button"
                              className="me-0 theme_light_btn btn btn-primary"
                            >
                              Just For Today
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="me-0 theme_light_btn btn btn-primary"
                            >
                              From Yesterday
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="mb-lg-0 mt-2 d-flex align-items-center col-lg-2 col-sm-6">
                        <ul className="list-unstyled mb-0 d-flex">
                          <li>
                            <button
                              type="button"
                              className="theme_dark_btn btn btn-primary"
                              style={{ marginRight: 10 }}
                            >
                              Search
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="theme_light_btn btn btn-primary"
                            >
                              Reset
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        {" "}
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 5 }}
                        >
                          Export As XLSM
                        </button>{" "}
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 5 }}
                        >
                          Export As CSV
                        </button>{" "}
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 10 }}
                        >
                          Export As Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <section className="total-balance-sec was">
                  <div className="px-0 container-fluid">
                    <ul className="list-unstyled" style={{ background: "black" }}>
                      <li>
                        <dt>Approve Withdrawal Amount</dt>
                        <strong>INR 318,890.00</strong>
                      </li>
                      <li>
                        <dt>Decline Withdrawal Amount</dt>
                        <strong>INR 15,400.00</strong>
                      </li>
                    </ul>
                  </div>
                </section>
                <div className="account-table batting-table">
                  <div className="responsive">
                    <table id="export-table" className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sr no.</th>
                          <th scope="col">Username</th>
                          <th scope="col">Account Name</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Bank Account</th>
                          <th scope="col">IFSC Code</th> 
                          <th scope="col">Agent Name</th>
                          <th scope="col">Accepted By</th>{" "}
                          <th scope="col">Created Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>yathish02</td>
                          <td>Yateesh bc</td> <td>5000</td>
                          <td>63810100010403</td>
                          <td>BARB0VJBGUR </td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 4:01:31 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>charv123</td>
                          <td>Vinay</td> <td>1300</td>
                          <td>9022500101796701</td>
                          <td>KARB0000347</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 3:07:30 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>ngr39</td>
                          <td>Hemalata </td> <td>20000</td>
                          <td>3112500102072301</td>
                          <td>KARB0000311</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 2:17:21 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>nabi001</td>
                          <td>Afsana </td> <td>540</td>
                          <td>10836101201590</td>
                          <td>PKGB0010836</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 1:32:54 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>prathap</td>
                          <td>Prathap</td> <td>1495</td>
                          <td>64147550166</td>
                          <td>SBIN0040093</td>
                          <td>mavip -&gt; manjanna009b</td>
                          <td>-</td>
                          <td>7/4/2026, 1:05:56 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>revanna</td>
                          <td>BHREVANNA</td> <td>500</td>
                          <td>110146141684</td>
                          <td>CNRB0011008</td>
                          <td>mavip -&gt; manjanna009b</td>
                          <td>-</td>
                          <td>7/4/2026, 12:44:58 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>7</td>
                          <td>raju1234</td>
                          <td>Devaraju B K</td> <td>20000</td>
                          <td>41408525715</td>
                          <td>SBIN0040162</td>
                          <td>mavip -&gt; ambu010</td>
                          <td>-</td>
                          <td>7/4/2026, 12:14:02 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>8</td>
                          <td>thippe01</td>
                          <td>thipperudraswamy kt</td> <td>1000</td>
                          <td>43738034919</td>
                          <td>SBIN0040262</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 12:06:07 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>9</td>
                          <td>januu123</td>
                          <td>Shridhar sr</td> <td>2000</td>
                          <td>0454108033628</td>
                          <td>CNRB0000454</td>
                          <td>mavip -&gt; rakesh hsd</td>
                          <td>-</td>
                          <td>7/4/2026, 11:54:21 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>10</td>
                          <td>rajesh4977</td>
                          <td>Rajeshkumarbhosle</td> <td>4300</td>
                          <td>99980101490568</td>
                          <td>FDRL0001582</td>
                          <td>mavip -&gt; rakesh hsd</td>
                          <td>-</td>
                          <td>7/4/2026, 11:33:46 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>11</td>
                          <td>charv123</td>
                          <td>Vinay</td> <td>3700</td>
                          <td>9022500101796701</td>
                          <td>KARB0000347</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 11:26:27 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>12</td>
                          <td>veeranji</td>
                          <td>P. Veeranjineyulu</td> <td>10000</td>
                          <td>20029917221</td>
                          <td>SBIN0003364</td>
                          <td>mavip -&gt; madhu77</td>
                          <td>-</td>
                          <td>7/4/2026, 11:04:38 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>13</td>
                          <td>anilbh</td>
                          <td>Santosh</td> <td>26000</td>
                          <td>62171432343</td>
                          <td>SBIN0063943</td>
                          <td>mavip -&gt; guru001</td>
                          <td>-</td>
                          <td>7/4/2026, 10:54:44 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>14</td>
                          <td>amithgowda</td>
                          <td>Manjunatha P N</td> <td>4170</td>
                          <td>5332500102922901</td>
                          <td>KARB0000533</td>
                          <td>mavip -&gt; amith gowda</td>
                          <td>-</td>
                          <td>7/4/2026, 10:51:26 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>15</td>
                          <td>sagar01</td>
                          <td>Sagar G</td> <td>13000</td>
                          <td>34198976856</td>
                          <td>SBIN0007911</td>
                          <td>mavip -&gt; rakesh bng</td>
                          <td>-</td>
                          <td>7/4/2026, 10:48:24 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>16</td>
                          <td>shaik</td>
                          <td>Shaik</td> <td>20000</td>
                          <td>520101036305185</td>
                          <td>UBIN0913855</td>
                          <td>mavip -&gt; ambu010</td>
                          <td>-</td>
                          <td>7/4/2026, 10:47:01 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>17</td>
                          <td>sunilsis</td>
                          <td>Sunil</td> <td>20000</td>
                          <td>13260100027426</td>
                          <td>BARB0GULBAR</td>
                          <td>mavip -&gt; guru001</td>
                          <td>-</td>
                          <td>7/4/2026, 10:43:54 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>18</td>
                          <td>zabi</td>
                          <td>Ismail zabiulla</td> <td>10000</td>
                          <td>520101016897923</td>
                          <td>UBINO901008</td>
                          <td>mavip -&gt; rahmath ajjampura</td>
                          <td>-</td>
                          <td>7/4/2026, 10:42:37 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>19</td>
                          <td>januu123</td>
                          <td>Shridhar sr</td> <td>2900</td>
                          <td>0454108033628</td>
                          <td>CNRB0000454</td>
                          <td>mavip -&gt; rakesh hsd</td>
                          <td>-</td>
                          <td>7/4/2026, 10:41:08 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>20</td>
                          <td>khalilauto</td>
                          <td>Rashida bau</td> <td>6000</td>
                          <td>40408845960</td>
                          <td>SBIN0040305</td>
                          <td>mavip -&gt; shivu hlk</td>
                          <td>-</td>
                          <td>7/4/2026, 8:18:08 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>21</td>
                          <td>charv123</td>
                          <td>Vinay</td> <td>1500</td>
                          <td>9022500101796701</td>
                          <td>KARB0000347</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 6:30:13 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>22</td>
                          <td>ngr39</td>
                          <td>Hemalata </td> <td>11000</td>
                          <td>3112500102072301</td>
                          <td>KARB0000311</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 5:36:47 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>23</td>
                          <td>yathish02</td>
                          <td>Yateesha bc</td> <td>10000</td>
                          <td>63810100010403</td>
                          <td>BARB0VJBGUR </td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/4/2026, 12:41:34 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>24</td>
                          <td>yathish02</td>
                          <td>Yateesh bc</td> <td>10000</td>
                          <td>63810100010403</td>
                          <td>BARB0VJBGUR </td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/3/2026, 10:29:02 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>25</td>
                          <td>charv123</td>
                          <td>Vinay</td> <td>2200</td>
                          <td>9022500101796701</td>
                          <td>KARB0000347</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/3/2026, 10:00:09 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>26</td>
                          <td>charv123</td>
                          <td>Vinay</td> <td>1400</td>
                          <td>9022500101796701</td>
                          <td>KARB0000347</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/3/2026, 6:30:27 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>27</td>
                          <td>shivu777</td>
                          <td>Manjunatha cn</td> <td>10000</td>
                          <td>12202101007851</td>
                          <td>PKGB0012202</td>
                          <td>mavip -&gt; manjanna009b</td>
                          <td>-</td>
                          <td>7/3/2026, 4:59:23 PM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>28</td>
                          <td>raghukagi</td>
                          <td>K RAGHAVENDRA KU</td> <td>12000</td>
                          <td>0591101050458</td>
                          <td>CNRB0000591</td>
                          <td>mavip -&gt; agvip</td>
                          <td>-</td>
                          <td>7/3/2026, 11:40:46 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>29</td>
                          <td>rajesh4977</td>
                          <td>Rajeshkumarbhosle</td> <td>3700</td>
                          <td>99980101490568</td>
                          <td>FDRL0001582</td>
                          <td>mavip -&gt; rakesh hsd</td>
                          <td>-</td>
                          <td>7/3/2026, 11:30:38 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>30</td>
                          <td>shaik</td>
                          <td>Shaik</td> <td>35000</td>
                          <td>520101036305185</td>
                          <td>UBIN0913855</td>
                          <td>mavip -&gt; ambu010</td>
                          <td>-</td>
                          <td>7/3/2026, 10:21:50 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>31</td>
                          <td>shivu777</td>
                          <td>Manjunatha cn</td> <td>185</td>
                          <td>12202101007851</td>
                          <td>PKGB0012202</td>
                          <td>mavip -&gt; manjanna009b</td>
                          <td>-</td>
                          <td>7/3/2026, 12:08:54 AM</td>
                          <td>Approve</td>
                        </tr>
                        <tr>
                          <td>32</td>
                          <td>dundappa</td>
                          <td>Dundappa</td> <td>50000</td>
                          <td>32627785626</td>
                          <td>SBIN0015639</td>
                          <td>mavip -&gt; guru001</td>
                          <td>-</td>
                          <td>7/3/2026, 12:01:30 AM</td>
                          <td>Approve</td>
                        </tr>{" "}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            {/* <h3 className="card-title text-white">
              Withdraw Date List
            </h3> */}
            <h3 className="card-title text-white">Withdrawal Reports</h3>
            <div className="">
              <button className="btn btn-light" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-2">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">

                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">End Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedEndDate}
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={handleFilter} // Or any function you want to trigger
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Total Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                          <td>{item.date}</td>
                          <td>₹ {item.totalAmount}</td>
                          <td>{item.totalCount}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                navigate(
                                  `/withdrawal_datewise_details/${item.date}`
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data.length >= 0 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, data.length)} of{" "}
                    {data.length}
                  </span>

                  <ul className="custom-pagination pagination mb-0">
                    {/* Prev */}
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        &laquo;
                      </button>
                    </li>

                    {/* Pages */}
                    {[currentPage - 1, currentPage, currentPage + 1]
                      .filter((p) => p > 0 && p <= totalPages)
                      .map((p) => (
                        <li
                          key={p}
                          className={`page-item ${currentPage === p ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(p)}
                          >
                            {p}
                          </button>
                        </li>
                      ))}

                    {/* Next */}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* 🔍 Date Filters */}
    </section>
  );
};

export default WithdrowDatewiseList;
