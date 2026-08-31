import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { Col, Row, Divider, DatePicker, Select, Space, } from 'antd';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import loadinggg from '../../assets/img/loading-gif.gif';
import moment from "moment";
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [users, setUsers] = useState([]);
  const [betpandingdata, setbetpandingdata] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [date_time, setDate] = useState('');
  const [market_name, setMarketName] = useState('');
  const [loading1, setLoading] = useState(false);
  const [loading21, setLoading21] = useState(false);
  const [jsonData, setJsonData] = useState(undefined);
  const [loading2, setLoading2] = useState(false);
  const [dateRanges, setDateRange] = useState([]);
  const [comxMarket, setComxMarket] = useState([]);
  const [paginate, setpaginate] = useState(1);
  const [loadbuttonshow, setloadbuttonshow] = useState();
  const [ispaginate, setispaginate] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('1');
  const navigate = useNavigate();

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleReload = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };
  const handleDateRangeChange = (dates) => {
    setpaginate('1');
    if (dates && dates.$L && dates.$d) {
      const formattedDate = new Intl.DateTimeFormat(dates.$L, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(dates.$d);
      setDateRange(formattedDate);
      if (selectedMarket == '1') {
        pendingbethistory(formattedDate);
      } else if (selectedMarket == '2') {
        loaduser(formattedDate, selectedValue);
      }
    } else {
      console.error("Invalid 'dates' object");
    }
  };

  const [selectedValue, setSelectedValue] = useState('');


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    if (selectedMarket === '1') {
      pendingbethistory(dateRanges, event.target.value);
    } else if (selectedMarket === '2') {
      loaduser(dateRanges, event.target.value);
    }
  };

  const shoot = (event) => {
    setispaginate(event.target.id);
    if (selectedMarket === '1') {
      pendingbethistory(dateRanges, selectedValue);
    } else if (selectedMarket === '2') {
      loaduser(dateRanges, selectedValue);
    }
  };


  const loaduser = async (formattedDate, tablecode, loaduser) => {
    if (tablecode == undefined) {
      tablecode = 'all';
    }
    if (formattedDate === undefined) {
      var today = moment().format("DD-MM-YYYY")
      formattedDate = today;
    } else {
      formattedDate = moment(formattedDate, "MM/DD/YYYY").format("DD-MM-YYYY");
    }
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    setLoading21(true);
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
      flt_date: formattedDate,
      tbl_code: tablecode,
      paginate: paginate,
      ispaginate: 'loaduser',
    };

    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}bet-history`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };

    try {
      const response = await axios(config);
      const userData = response.data.data;

      setUsers(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    setLoading21(false);
  }

  const deleteCombination = async (id) => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      bet_id: id,
    };

    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}bat-delete`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };

    try {
      const response = await axios(config);
      setLoading2(false);
      if (response.data.success) {
        const userConfirmed = window.confirm('Are you sure you want to remove this Market?');
        if (userConfirmed) {
          const updatedUsers = betpandingdata.filter(item => item.id !== id);
          setbetpandingdata(updatedUsers);

          alert('Market bet removed successfully!');
          // pendingbethistory();
        } else {
          alert('Market bet removal canceled.');
        }
      }
    } catch (error) {
      setLoading2(false);
      console.error('Error deleting market:', error);
      toast.error('Failed to delete Market!');
    }
  };

  var firstNumbers = [];

  const pendingbethistory = async (formattedDate, tablecode, pendingbethistory) => {
    const user_id = localStorage.getItem("userid");
    if (tablecode === undefined || !tablecode) {
      tablecode = 'all';
    }
    if (formattedDate === undefined) {
      var today = moment().format("DD-MM-YYYY")
      formattedDate = today;
    } else {
      formattedDate = moment(formattedDate, "MM/DD/YYYY").format("DD-MM-YYYY");
    }
    // let page;
    // if (selectedMarket == '1') {
    //   page = 1;
    // } else {
    //   page = paginate;
    // }
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      date: formattedDate,
      tbl_code: tablecode,
      page: paginate,
    //  page: page,
      // ispaginate: 'pendingbethistory',
    };
    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}pending-bet-history`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };
    try {
      const response = await axios(config);

      if (response.data.data.success === "1") {
        const userData = response.data.data.data;
        setpaginate(response.data.data.pagination);
        var count = paginate * 10;
        setloadbuttonshow(count);
        let merged = firstNumbers.concat(userData);
        let mer = users.concat(userData);
        setbetpandingdata(mer);
      }
      else {
        let mer = [];
        setbetpandingdata(mer);
      }
      // setbetpandingdata(userData);

    }


    catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  const ComxMarket = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const url = `${process.env.REACT_APP_API_URL_NODE}get-market-list`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id
    };

    const config = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: requestData
    };

    try {
      const response = await axios(config);
      const objectRes = response.data.message.data;
      if (objectRes && Array.isArray(objectRes)) {
        setComxMarket(objectRes);
      } else {
        console.error('Invalid data structure:', objectRes);
      }
    } catch (error) {
      console.error('Error during HTTP request:', error.message);
      if (error.response) {
        console.error('Server responded with non-2xx status:', error.response.status, error.response.data);
      }
    }
  }


  useEffect(() => {
    if (selectedMarket == '1') {
      pendingbethistory();
      ComxMarket();
    } else if (selectedMarket == '2') {
      loaduser();
      ComxMarket();
    }
  }, [selectedMarket]);


  return (
    <>
      <section className="margin-bottom-88 margin-bottom-100" id='history'>
        <div className="container-fluid paddingall-5">
          <div className='historybet marketdetails'>
            <div className='padding_5'>
              <Divider orientation="center">History</Divider>
              <Row gutter={1} className='d-flex align-item-center justify-content-between'>
                <Col span={10}>
                  <DatePicker onChange={handleDateRangeChange} className='form-control' />
                </Col>
                <Col className="gutter-row" span={10}>
                  <Space>
                    <select value={selectedValue} onChange={handleSelectChange} className='select_market form-control'>
                      <option value="all" className='font-size-5'>Select On Market</option>
                      {comxMarket.map((item, index) => (
                        <option key={index.id} value={item.id}>
                          {item.id}
                        </option>
                      ))}
                    </select>
                  </Space>
                </Col>

                <Col span={2} className='d-flex align-items-center justify-content-center'>
                  <div className="reloadhistory" onClick={handleReload}>
                    <i class="bi bi-arrow-clockwise"></i>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="bg-white p-2 round_radius">
              <div className="d-flex justify-content-between">
                <div className="width_btn_new">
                  <button value="1" onClick={handleMarketChange} className='btn refresh changeBG'>Pending Bet</button>
                </div>
                <div className='width_btn_new'>
                  <button value="2" onClick={handleMarketChange} className="refresh btn ">Declared Bet</button>
                </div>
              </div>
              {/* <Form.Select aria-label="Default select example" className='' onChange={handleMarketChange} value={selectedMarket}>
                <option value="1">Panding bet</option>
                <option value="2">Success bet</option>
              </Form.Select> */}

            </div>
          </div>
          {selectedMarket === '2' && (
            <div className="table-responsive">
              <div className="table  table-history">
                <Table striped bordered hover className=''>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Number </th>
                      {/* <th>Points </th> */}
                      <th>Earned</th>
                    </tr>
                  </thead>
                  <tbody className=''>
                    {loading21 ? (
                      <div className="loadernew21">
                        <img src={loadinggg} className="px-2 loaderfile" alt="Loading..." />
                      </div>
                    ) : (
                      <>
                        {users && users.length > 0 ? (
                          users.map((user, index) => {
                            const dateTime = new Date(user.date_time);
                            const formattedDate = `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
                            return (
                              <tr key={index} className={`${user.is_result_declared === 0 ? "classcolor" : "classcolor1"}`}>
                                <td>{index + 1}</td>
                                <td>{formattedDate}</td>
                                <td>{user.table_id}</td>
                                <td>{user.tr_value_type}</td>
                                <td>{user.tr_value}</td>
                                <td>{user.win_value}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8">No data available or something went wrong.</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
              {users && users.length >= loadbuttonshow ? (
                <div className='d-flex justify-content-center loadmore'><button className='btn btn-primary w-50  mx-auto text-center' onClick={shoot} id="loadmore">Load More</button>
                </div>
              ) : (
                null
              )}
            </div>
          )}
          {selectedMarket === '1' && (
            <div className="table-responsive">
              <div className="table  table-history">
                <Table striped bordered hover className=''>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Number </th>
                      <th>Points </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className=''>
                    {loading21 ? (
                      <div className="loadernew21">
                        <img src={loadinggg} className="px-2 loaderfile" alt="Loading..." />
                      </div>
                    ) : (
                      <>
                        {betpandingdata && betpandingdata.length > 0 ? (
                          betpandingdata.map((user, index) => {
                            const dateTime = new Date(user.date_time);
                            // const formattedDate = `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
                            return (
                              <tr key={index} className={`${user.is_result_declared === 0 ? "classcolor" : "classcolor1"}`}>
                                <td>{index + 1}</td>
                                <td>{user.datetime}</td>
                                <td>{user.marketname}</td>
                                <td>{user.bettype}</td>
                                <td>{user.pred_num}</td>
                                <td>{user.tr_value}</td>
                                {user.is_deleted === 1 ? (
                                  <td className='text-danger trash d-flex justify-content-center align-items-center ' onClick={() => deleteCombination(user.id)}>
                                    <i className="bi bi-trash3"></i>
                                  </td>
                                ) : (
                                  <td></td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8">No data available or something went wrong.</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
              {betpandingdata && betpandingdata.length >= loadbuttonshow ? (
                <div className='d-flex justify-content-center loadmore'><button className='btn btn-primary w-50  mx-auto text-center' onClick={shoot} id="loadmore">Load More</button>
                </div>
              ) : (
                null
              )}
            </div>
          )}
        </div>
      </section >
      <ToastContainer />
    </>
  )
}
