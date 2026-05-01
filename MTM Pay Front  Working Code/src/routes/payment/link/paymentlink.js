import { useEffect, useState } from 'react';
import { Table} from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import api from 'utils/api';
import { CopyOutlined } from '@ant-design/icons';

const columns = [

    {
        title: 'Transaction ID',
        render: (text, records) => (
          <div>
            <div>
            {records.transaction && records.transaction.tx_id}<br/>
           {records.transaction && records.transaction.order_id}
            </div>
          </div>
        )
      },


      {
        title: 'Payment Link',
        render: (text, records) => (
          <div>
            <div>
            {records.payment_link_url && records.payment_link_url} 
              <span onClick={() => copyToClipboard(records.payment_link_url)}>
              <CopyOutlined />
             </span>
            </div>
          </div>
        )
      },


      {
        title: 'Amount',
        render: (text, records) => (
          <div>
            <div>
              {records.total}
            </div>
          </div>
        )
      },

      {
        title: 'Status',
        render: (text, records) => (
          <div>
            <div>
              {records.payment_status === 1 ? 'Pending' : records.payment_status === 2 ? 'Success' : 'Unknown'}
            </div>
          </div>
        ),
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


const paymentlinkurl = async () => {
   
    try {
        
        const response = await api.get(`/partner/orders/partner-payment-link`);

        const data = response.data;
        console.warn(response.data.records);
        setRecords(response.data.records);
        
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


