import React, { useState, useEffect } from 'react';
import { Table, Button} from 'antd';
import axios from "axios";
import Swal from 'sweetalert2';
import { Spinner } from "react-bootstrap";

export default function Resulthistory() {
  const user_id = localStorage.getItem("userid");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalComm, settotalComm] = useState([]);
  const [totalPlayed, settotalPlayed] = useState([]);
  const [Refcomm, setRefcomm] = useState([]);
  const [RefBonus, setRefBonus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [TotalBonus, setTotalBonus] = useState('');
  const [BonusMin, setBonusMin] = useState('');
  const [BonusMax, setBonusMax] = useState('');
  const [error, setError] = useState('');
  const [loadingbutton, setLoadingbutton] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(20);
  // const pageSize = 5;
  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === 'string' &&
          field.toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchText(value);
    setFilteredData(filtered);
    setCurrentPage(1);
  };


  const bonuslist = async () => {
    const user_id = localStorage.getItem("userid");
    const requestData = {
      user_id: user_id,
    };
    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}bonus-report-list`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };
    try {
      const response = await axios(config);
      console.log(response);
      if (response.data.success == '1') {
        setData(response.data.data);
        settotalComm(response.data.total_comm);
        settotalPlayed(response.data.total_played);
        setRefcomm(response.data.commissionRate);
        setRefBonus(response.data.total_comm);
        setTotalBonus(response.data.total_bonus);
        setBonusMin(response.data.bounsmin);
        setBonusMax(response.data.bounsmax);
      }
      else {
        console.log("no record found");
      }
    }
    catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    bonuslist();

  }, []);

  // const formatDateString = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // };

  const columns = [
    {
      title: 'Date',
      dataIndex: '_id',
      key: 'date',
    },

    {
      title: 'Total Played',
      dataIndex: 'totalAmount',
      key: 'total',
    },
    {
      title: 'Comm',
      dataIndex: 'winAmount',
      key: 'winAmount',
      render: (text) => parseFloat(text).toFixed(2)
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    },);
    return () => clearTimeout(timer);
  }, []);


  const redeemBonus = async (event) => {
    event.preventDefault();
    if (!redeemAmount || redeemAmount < BonusMin || redeemAmount > BonusMax) {
      setError('Please enter a valid amount between ' + BonusMin + ' and ' + BonusMax);
      return;
    }
    setError('');
    setLoadingbutton(true);
    const requestData = {
      user_id: user_id,
      amount: redeemAmount
    };
    const config = {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL_NODE}bonus-report-redem`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    };
    try {
      const response = await axios(config);
      if (response.data.success == "1") {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your bonus has been redeemed successfully!',
        });
        bonuslist();
        setLoadingbutton(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error redeeming bonus:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while redeeming your bonus. Please try again later.',
      });
    }
  };

  const loadMore = () => {
    setItemsToShow(itemsToShow + 20);
  };

  return (
    <div>
      {isLoading && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
      {!isLoading && (
        <section id="Help" className='margin-bottom-88'>
          <div className='margin-bottom-49 mb-0'>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="comissionrate">98 के रेट साथ कमीशन नही है
                    95 के रेट के साथ 3 परसेंट कमीशन मिलेगी जिसको चाइए वो deposit chat pe msg करके करवा सकता हैं। </h2>
                  <h5 className="text-dark text-center">Bonus Report</h5>
                </div>
                <div className="col-12">
                  <table className="table bonusreportth">
                    <thead className="bonusreportth">
                      <th>Total Played</th>
                      <th>Total Bonus</th>
                      <th>Remaining Bonus</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{totalPlayed}</td>
                        <td>{TotalBonus}</td>
                        <td>{RefBonus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="col-md-12">
                  <h6 className="text-dark redeem">Enter Redeem Amount<span className="d-block text-danger">(Min - {BonusMin} and Max- {BonusMax} can withdraw)</span></h6>
                  <div className="row align-items-center">
                    <div className="col-8 col-sm-9">
                      <input type="number" required="" onChange={(e) => setRedeemAmount(e.target.value)}
                        placeholder="Enter Amount" name="amount" className="form-control bonusreportinput" />
                    </div>
                    <div className="col-4 col-sm-3">
                      <button type="button" onClick={redeemBonus} className="playgames bonsureport w-100" disabled={loadingbutton}>Submit {loadingbutton && <Spinner animation="border" />}</button>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <Table dataSource={searchText ? filteredData.slice(0, itemsToShow) : data.slice(0, itemsToShow)} columns={columns} pagination={false}/>
                  {data.length > itemsToShow && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <Button onClick={loadMore}>Load More</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </section>
      )}
    </div>
  )
}
