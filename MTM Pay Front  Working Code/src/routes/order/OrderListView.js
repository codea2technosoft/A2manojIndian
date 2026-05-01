import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Row } from 'antd';
import api from 'utils/api';
import { toast } from 'react-toast';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import { formatDateTime, generateServiceName } from 'utils/common';
import user from '../../assets/images/4.jpg'

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
    };
    const config = useSelector((state) => state.config);

    const columns = [
        {
            title: 'Order ID',
            key: 'id',
            dataIndex: 'id',
            render: (text, record) => <div>{record.id}</div>,
        },

        {
            title: 'Transaction Id',
            // title: 'Order Number/ Transaction Id',
            width: 230,
            render: (text, record) => (
                <div>
                    <div>{record.order_number}</div>
                    <div className='highlight_Text'>{record.transaction ? record.transaction.tx_id : null}</div>
                    <div>{record.transaction ? record.transaction.data.utr : null}</div>
                </div>
            ),
        },
        // {
        //     title: 'Transaction ID',
        //     key: 'payment_tx_id',
        //     dataIndex: 'payment_tx_id'
        // },
        {
            title: 'Customer Details',
            key: 'email',
            dataIndex: 'email',
            render: (text, record) => {
                return (
                    <div>
                        <Row align={'middle'}>
                            <div>
                                <img src={user} alt='user' className='tableUser'/>
                            </div>
                            <div>
                        {record.billing_person_name ? <div>{record.billing_person_name}</div> : null}
                        {record.phone ? (
                            <div>
                                <a className='highlight_Text' href={`tel:${record.phone}`}>{record.phone}</a>
                            </div>
                        ) : null}
                        </div>
                        </Row>
                        {/* {
                            text ? <div><a href={`mailto:${text}`}>{text}</a></div> : null
                        } */}
                    </div>
                );
            },
        },
        {
            title: 'Amount',
            key: 'total',
            dataIndex: 'total',
            render: (text, record) => (
                <span>
                    {record.currency} {record.total}
                </span>
            ),
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
            key: 'payment_status',
            dataIndex: 'payment_status',
            render: (text, record) => (
                <div>
                    <OrderPaymentStatusDropdown orderId={record.id} defaultValue={text} readonly={true} />
                    {text == '1' ? (
                        <div className="status">
                            <a id="popup1" onClick={() => shoot(record.id)}>
                                Check Status
                            </a>
                        </div>
                    ) : (
                        ''
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
        },
    ];

    useEffect(() => {
        console.log(selectedRecords);
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
                rowKey="id"
                columns={columns}
                dataSource={records}
                loading={isTableLoading}
                pagination={pagination}
                onChange={onChangeTable}
                scroll={{
                    x: true,
                }}
            />
        </div>
    );
};

export default OrderListView;
