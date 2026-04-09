import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import api from 'utils/api';
import { toast } from 'react-toast';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import { formatDateTime, generateServiceName } from 'utils/common';
import $ from 'jquery';

const OrderListView = ({ records, isTableLoading, pagination, selectedRecords, onChangeTable, onSelectRecords }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const shoot = (a) => {
        // $('#popup1').attr('disabled', 'true'); 
        const button = document.getElementById(a);
        // ✅ Set the disabled attribute
        button.setAttribute('disabled', '');
        // $(this).setAttribute('disabled', '');
        api.post('/webhook/payment/ChkOrderStatus',{
            orderid:a
        })
        .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    // location.reload();
                    window.location.reload(); 
                }
                // resolve(response.data);
            })
            .catch((err) => {
               
            });
          
    }
    const config = useSelector(state => state.config);

    const columns = [



        {
            title: 'Order Id/ Transaction Id',
            width: '26%',
            render: (text, record) => (
                <div>

                    <div>{record.order_number}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.transaction ? record.transaction.tx_id : null}</div>
                    <div>{record.transaction ? record.transaction.data.utr : null}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.id ? record.id : null}</div>

                </div>
            )
        },


        // {
        //     title: 'Order Id/ Transaction Id',
        //     width: '26%',
        //     render: (text, record) => (
        //       <div>
        //         {record.order_number !== null && record.order_number !== undefined && record.order_number !== "" ? (
        //           <div>{record.order_number}</div>
        //         ) : null}
        //         {record.transaction && record.transaction.tx_id !== null && record.transaction.tx_id !== undefined && record.transaction.tx_id !== "" ? (
        //           <div style={{ color: '#6C5DD3' }}>{record.transaction.tx_id}</div>
        //         ) : null}
        //         {record.transaction && record.transaction.data && record.transaction.data.utr !== null && record.transaction.data.utr !== undefined && record.transaction.data.utr !== "" ? (
        //           <div>{record.transaction.data.utr}</div>
        //         ) : null}
        //         {record.order_number === null && record.transaction === null ? (
        //           <div style={{ color: '#6C5DD3' }}>{record.id !== null && record.id !== undefined && record.id !== "" ? record.id : null}</div>
        //         ) : null}
        //       </div>
        //     )
        //   },
          


       
        {
            title: 'Customer Details',
            key: 'email',
            width: '26%',
            dataIndex: 'email',
            render: (text, record) => {
                return (
                    <div>
                        {
                            record.email ? <div><a href={`tel:${record.email}`}>{record.email}</a></div> : null
                        }
                        {
                            record.phone ? <div>{record.phone}</div> : null
                        }
                        {/* {
                            text ? <div><a href={`mailto:${text}`}>{text}</a></div> : null
                        } */}
                        
                    </div>
                )
            }
        },
        {
            title: 'Amount',
            key: 'total',
            width: '16%',
            dataIndex: 'total',
            render: (text, record) => (
                <span>{record.currency} {record.total}</span>
            )
        },
       
        {
            title: 'Status',
            key: 'payment_status',
            width: '16%',
            dataIndex: 'payment_status',
            render: (text, record) => (
                <div>
                    <OrderPaymentStatusDropdown
                        orderId={record.id}
                        defaultValue={text}
                        readonly={true}
                        />
                    {text == '1' ? (
                        <a id={record.id} style={{border: "1px solid",
                            padding: "3px",
                            marginTop: "0px",
                            borderRadius: "5px",
                            width: "100%",
                            display: "block",
                            textAlign: "center"}}  onClick={(e) => {
                                e.preventDefault(); 
                                shoot(record.id); 
                                // window.location.reload(); 
                            }} >Check Status</a>
                    ) : (
                        ""
                    )}
                </div>

            ),

        },
       

        {
            title: 'Created at',
            key: 'created_at',
            width: '16%',
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