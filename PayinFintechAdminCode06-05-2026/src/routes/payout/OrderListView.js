import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentPayoutStatusDropdown from 'components/OrderPaymentPayoutStatusDropdown';
import { formatDateTime, generateServiceName } from 'utils/common';

const OrderListView = ({ records, isTableLoading, pagination, selectedRecords, onChangeTable, onSelectRecords }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const config = useSelector(state => state.config);

    const CustomTitle1 = () => (
        <div>
          Order ID / <br /> Transaction ID
        </div>
      );

      const CustomTitle = () => (
        <div>
          User
        </div>
      );

      const CustomTitle2 = () => (
        <div>
            Gateway / <br /> Payment ID 
        </div>
      );

    const columns = [

        {
            title: <CustomTitle1 />,
            render: (text, record) => (
                <div>
                    <div>{record.orderid}</div>
                    <div style={{color: '#6C5DD3'}}>{record.tid}</div>                    
                </div>
            )
        },

        {
            title: <CustomTitle />,
            render: (text, record) => (
              <div>
                {/* <div><span style={{color: '#6C5DD3'}}></span>{record.userdetails.email}</div> */}
                <a href={`mailto:${record.userdetails.email}`}>{record.userdetails.email}</a>
                <div>{record.userdetails.full_name}</div>
                {/* <div><span style={{color: '#6C5DD3'}}>Merchant:</span>{record.email}</div> */}
              </div>
            )
          },
          
        {
            title: 'Account/IFSC',
            key: 'email',
            dataIndex: 'email',
            width: 180,
            render: (text, record) => {
                return (
                    <div>
                        {
                            record.accountnumber ? <div>{record.accountnumber}</div> : null
                        }
                        {
                            record.Ifsc ? <div>{record.Ifsc}</div> : null
                        }
                       
                    </div>
                )
            }
        },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount',
            render: (text, record) => (
                <span>{record.currency} {record.amount}</span>
            )
        },
      
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => (
                <span>
                    <div style={{color: '#6C5DD3'}}>{record.status}</div>
                </span>
                // <div>
                //     <OrderPaymentPayoutStatusDropdown
                //         orderId={record.id}
                //         defaultValue={text}
                //         readonly={false}
                //     />
                // </div>
            )
        },
            
        {   
            title:<CustomTitle2 />,
            key: 'name',
            dataIndex: 'name',
            render: (text, record) => (
                // <div>
                //     {
                //         record.transaction ? (
                //             <div><strong>{generateServiceName(config.service_types, record.transaction.gateway)}</strong></div>
                //         ) : null
                //     }
                //     <div>{text}</div>
                // </div>
                <div>
                <div>{record.getwayname}</div>
              </div>
            )
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text, record) => {
                const date = new Date(text);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString();
        
                return (
                    <div>
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                    </div>
                );
            },
        }
    ];

    useEffect(() => {
        console.log(selectedRecords)
        setSelectedRowKeys(selectedRecords);
    }, [selectedRecords]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            onSelectRecords(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({}),
    };

    return (
        <div>
            <Table
                // rowSelection={rowSelection}
                rowKey='id'
                columns={columns}
                dataSource={records}
                loading={isTableLoading}
                pagination={pagination}
                onChange={onChangeTable}
                scroll={{
                    x: true
                }}
            />
        </div>
    )
}

export default OrderListView;