 import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import api from 'utils/api';
import { toast } from 'react-toast';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import { formatDateTime, generateServiceName } from 'utils/common';

const RecentTransactionList = ({ records, isTableLoading, selectedRecords, onChangeTable, onSelectRecords }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const shoot = (a) => {
        // $('#popup1').attr('disabled', 'true'); 
        const button = document.getElementById(a);
        // ✅ Set the disabled attribute
        button.setAttribute('disabled', '');
        // $(this).setAttribute('disabled', '');
        api.post('/webhook/payment/ChkOrderStatus', a)
        .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    // location.reload();
                }
                // resolve(response.data);
            })
            .catch((err) => {
               
            });
          
    }
    const config = useSelector(state => state.config);

    const columns = [
        {
            title: 'Transaction Detail',
            width: '20%',
            render: (text, record) => (
                <div>
                    <div>{record.order_number}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.payment_tx_id ? record.payment_tx_id : null}</div>
                    <div>{record.transaction ? record.transaction.data.utr : null}</div>
                    <div>{record.id ? record.id : null}</div>

                </div>
            )
        },
        // {
        //     title: 'Transaction ID',
        //     key: 'payment_tx_id',
        //     dataIndex: 'payment_tx_id'
        // },
        {
            title: 'Customer Details',
            key: 'email',
            width: '20%',
            dataIndex: 'email',
            width: 180,
            render: (text, record) => {
                return (
                    <div>
                        {
                            record.email ? <div>{record.email}</div> : null
                        }
                        {/* {
                            text ? <div><a href={`mailto:${text}`}>{text}</a></div> : null
                        } */}
                        {
                            record.phone ? <div><a href={`tel:${record.phone}`}>{record.phone}</a></div> : null
                        }
                    </div>
                )
            }
        },
        {
            title: 'Amount',
            width: '20%',
            key: 'total',
            dataIndex: 'total',
            render: (text, record) => (
                <span>{record.currency} {record.total}</span>
            )
        },
        // {
        //     title: 'Fees',
        //     key: 'management_fee',
        //     dataIndex: 'management_fee',
        //     render: (text, record) => {
        //         if (Number(record.payment_status) === 2) {
        //             return (
        //                 <span>{record.currency} {record.management_fee}</span>
        //             )
        //         }

        //         return null;
        //     }
        // },
        {
            title: 'Status',
            width: '20%',
            key: 'payment_status',
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
                            textAlign: "center"}} onClick={(e) => {
                                e.preventDefault(); 
                                shoot(record.id); 
                                window.location.reload(); 
                            }} >Check Status</a>
                    ) : (
                        ""
                    )}
                </div>

            ),

        },
        // {
        //     title: 'Payment method',
        //     key: 'payment_mode',
        //     dataIndex: 'payment_mode',
        //     render: (text, record) => {
        //         let vpa = '';
        //         if (record.params && record.params.hasOwnProperty('vpa')) {
        //             vpa = record.params.vpa;
        //         }

        //         return (
        //             <div>
        //                 <div><b>{text}</b></div>
        //                 <div><small>{vpa}</small></div>
        //             </div>
        //         )
        //     }
        // },
        // {
        //     title: 'Gateway / Payment ID',
        //     key: 'payment_tx_id',
        //     dataIndex: 'payment_tx_id',
        //     render: (text, record) => (
        //         <div>{text}</div>
        //     )
        // },

        // {
        //     title: 'Created at',
        //     key: 'created_at',
        //     dataIndex: 'created_at',
        // },

        {
            title: 'Created at',
            key: 'created_at',
            width: '20%',
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
                rowKey='id'
                columns={columns}
                dataSource={records}
                loading={isTableLoading}
            />
        </div>
    )
}

export default RecentTransactionList;