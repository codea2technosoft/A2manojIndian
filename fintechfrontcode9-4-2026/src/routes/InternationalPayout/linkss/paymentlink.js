import { useEffect, useState } from 'react';
import { Table} from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import api from 'utils/api';
import { CopyOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
const columns = [

    {
        title: 'Order ID',
        render: (text, records) => (
          <div>
            <div>
            {records.orderid && records.orderid.tx_id}<br/>
           {records.orderid && records.orderid}
            </div>
          </div>
        )
      },


      {
        title: 'Payment Link',
        render: (text, records) => (
          <div>
            <div>
            {records.payment_link && records.payment_link} 
              <span onClick={() => copyToClipboard(records.payment_link)}>
              <CopyOutlined />
             </span>
            </div>
          </div>
        )
      },


    {
      title: 'Created At',
      render: (text, records) => (
        <div>
          <div>
            {records.created_at}
          </div>
        </div>
      )
    },

   

      // {
      //   title: 'Customer',
      //   render: (text, records) => (
      //     <div>
      //       <div>
      //         {records.email}<br/>
      //         {records.phone}
      //       </div>
      //     </div>
      //   )
      // },

     



  ];


  function copyToClipboard(text) {
  
    const tempInput = document.createElement('input');

    tempInput.value = text;

    document.body.appendChild(tempInput);

    tempInput.select();

    document.execCommand('copy');
   
    document.body.removeChild(tempInput);
    
    alert('url copy');
  }
  



const PaymentLinkTable1 = () => {
const [records, setRecords] = useState([]);
const token = Cookies.get('sob_token');

const paymentlinkurl = async () => {
  
  try {
      // Define headers
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      };

      // Make the API request with headers
      const response = await api.get('/merchant-Paypal-payment-link-list', { headers });

      // Process the response data
      const data = response.data.records;
      console.warn(data);
      setRecords(data);

  } catch (error) {
      console.error('Error fetching TransfarList:', error);
  }
};


useEffect(() => {
    paymentlinkurl();
}, []);

    return (
        <div>
          <Table
            columns={columns}
            dataSource={records}
            style={{ marginTop: '1rem' }}
          />
        </div>
      );
};

export default PaymentLinkTable1;


