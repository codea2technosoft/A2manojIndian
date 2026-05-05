import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import api from 'utils/api';
import { toast } from 'react-toast';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import { formatDateTime, generateServiceName } from 'utils/common';

const OrderListView = ({ records, isTableLoading, pagination, selectedRecords, onChangeTable, onSelectRecords }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const shoot = (a) => {
        // $('#popup1').attr('disabled', 'true'); 
        const button = document.getElementById('popup1');

        // ✅ Set the disabled attribute
        button.setAttribute('disabled', '');
        api.post('/webhook/payment/ChkOrderStatus', a)
            .then((response) => {
                if (response.status == 200) {
                    // location.reload();
                }
                // resolve(response.data);
            })
            .catch((err) => {
                // toast.error(err.response.data.message);
                // reject(err);
            });
    }
    const config = useSelector(state => state.config);

    const columns = [

        // {
        //     title: 'Order ID',
        //     key: 'id',
        //     dataIndex: 'id',
        //     render: (text, record) => (
        //         <div>{record.id}</div>
        //     )
        // },


        {
            title: 'Transation Details',
            width: '26%',
            render: (text, record) => (
                <div>

                    <div>{record.order_number}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.transaction ? record.transaction.tx_id : null}</div>
                    <div>{record.transaction ? record.transaction.data.utr : null}</div>

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
            width: '13%',
            dataIndex: 'total',
            render: (text, record) => (
                <span>{record.currency} {record.total}</span>
            )
        },
       



        {
            title: 'Chargeback Status',
            key: 'chargeback',
            width: '22%',
            dataIndex: 'chargeback_status',
        }, 

        {
            title: 'Created at',
            key: 'created_at',
            width: '13%',
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