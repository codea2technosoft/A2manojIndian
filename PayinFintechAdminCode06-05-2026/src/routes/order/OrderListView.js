import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Switch } from 'antd';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import { formatDateTime, generateServiceName } from 'utils/common';
import { getOrders } from 'requests/order';
import { updatemerchantordersdata } from 'requests/user';
import api from 'utils/api';

const OrderListView = ({ records, isTableLoading, pagination, selectedRecords, onChangeTable, onSelectRecords }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [status, setStatus] = useState([]);


    const config = useSelector(state => state.config);

    // const CustomTitle1 = () => (
    //     <div>
    //         Order ID / <br /> Transaction ID
    //     </div>
    // );

    const CustomTitle = () => (
        <div>
            User Details
        </div>
    );

    const CustomTitle2 = () => (
        <div>
            Gateway / <br /> Payment ID
        </div>
    );

    const columns = [
       
        {
            title: <CustomTitle />,
            render: (text, record) => (
                <div>
                    <div>
                   
                       
                    <div>{record.email}</div>
                </div>
                    {/* <span>{record.phone}</span> */}
                </div>
            )
        },

        
        {
            title: 'Amount',
            key: 'total',
            dataIndex: 'total',
            render: (text, record) => (
                <span>{record.currency} {record.total}</span>
            )
        },
       
        {
            title: 'Transaction Status',
            key: 'payment_status',
            dataIndex: 'payment_status',
            render: (text, record) => (
                <div>
                    <OrderPaymentStatusDropdown
                        orderId={record.id}
                        defaultValue={text}
                        readonly={false}
                    />
                </div>
            )
        },
        {
            title: 'Charge Back Status',
            key: 'chargeback_status',
            dataIndex: 'chargeback_status',
            render: (text, record) => (
                <div>
                    <select style={{ width: 230, marginLeft: 20 }} onChange={handleChange} className='payout-select'>
                        <option value=" ">Status</option>
                        {record.chargeback_status == 'open' ? <option value="open" data-id={record.id} selected>Open</option>: <option value="open" data-id={record.id}>Open</option> }
                        {record.chargeback_status == 'close' ? 
                        <option value="close" data-id={record.id} selected>Close</option>
                        :
                        <option value="close" data-id={record.id}>Close</option>
                        }
                    </select>

                </div>
            )
        },
        {
            title: 'Push Charge Back',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => (
                <>
                    <Switch
                        defaultChecked={record.chargeback == "yes" ? true : false}
                        onClick={() => payin_change_status(record.id, record.chargeback)}
                    />
                </>
            )
        },
        {
            title: 'Gateway Id/Gateway Name',
            key: 'getway_order_id',
            dataIndex: 'getway_order_id',
            render: (text, record) => (
                <>
                <span> {record.getway_order_id}</span><br></br>
                <span> {record.getway_name}</span>
                </>
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
        getOrders();
    }, [selectedRecords]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            onSelectRecords(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({}),
    };
    const payin_change_status = async (id, data) => {
        // alert(id+"and"+data);
        if (data == 'yes') {
            var key = 'no';
        } else {
            var key = 'yes';
        }
        id = {
            order_id: id,
            status: key,
        }
        await updatemerchantordersdata(id);
        getOrders();
    }
    // const onChangePaymentStatus = (value) => {
    //     try {
    //         const response = await api.get('/beneficiary-data-manager',);
    //         let query = parseQueryParams(location);
    //         // alert(value.target.value);
    //         if (value.target.value != ' ') {
    //             query = {
    //                 ...query,
    //                 chargeback_status: value.target.value
    //             };
    //         } else {
    //             delete query.chargeback_status;
    //         }

    //         navigate({
    //             pathname: location.pathname,
    //             search: stringifyQueryParams(query),

    //         });
    //     }
    // }
    // const fetchDatastatus = async (userId) => ({ target }) => {
    //     let value = target.value;
    //   console.warn('sddsd');
    //     // you can use userId and value here.
    //   }
    // const fetchDatastatus = async (id, data) => {

    //     // console.warn(data+'sdfs');

    //     if (data == 'open') {
    //         var key = 'close';
    //     } else {
    //         var key = 'open';
    //     }
    //     id = {
    //         // order_id: id,
    //         status: key,
    //     }
    //     alert(key.data);

    //     try {
    //         const response = await api.post('/admin/merchant-orders-chargeBack-open-close', {

    //             order_id: key,
    //             chargeback_status: key
    //           });
        
    //         // const response = await api.post('/admin/merchant-orders-chargeBack-open-close');
    //         setStatus(response.data.chargeback_status);
    //           alert(response.data.chargeback_status);
    //     } catch (error) {
    //         console.error("Error fetching open/close status:", error);
    //     }
    //     getOrders()
    // }
    const handleChange = async (event) => {
        const selectedValue = event.target.value;
        const selectedId = event.target.options[event.target.selectedIndex].dataset.id;
        console.warn(selectedId);
        console.warn(selectedValue);
        // Do something with the selected value and id
        try {
                    const response = await api.post('/merchant-orders-chargeBack-open-close', {
        
                        order_id: selectedId,
                        chargeback_status: selectedValue
                      });
                
                    // const response = await api.post('/admin/merchant-orders-chargeBack-open-close');
                    setStatus(response.data.chargeback_status);
                    //   alert(response.data.chargeback_status);
                } catch (error) {
                    console.error("Error fetching open/close status:", error);
                }
                getOrders()
      };
    
    return (
        <div >
            <Table
                // rowSelection={rowSelection}

                rowKey='id'
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
    )
}

export default OrderListView;