import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Table, Row, Alert, Modal, Button, Typography } from "antd";
import _ from 'lodash';
import { BaseSelect } from 'components/Elements';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { toast } from "react-toast";
// requests
import { getAvailableCarriers, bookOrders } from "requests/shipment";

const { Title } = Typography;

const PendingShipmentOrders = (props) => {
    const { services, warehouses, page, perPage, totalCount, orders, onRefresh } = props;

    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [availableCarriers, setAvailableCarriers] = useState([]);
    const [visibleCarrierModal, setVisibleCarrierModal] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    const config = useSelector(state => state.config);
    const location = useLocation();
    const navigate = useNavigate();

    const orderTypes = [
        { label: 'Prepaid', value: 'prepaid' },
        { label: 'COD', value: 'cod' },
        { label: 'CCOD', value: 'ccod' }
    ];
    const modes = [
        { label: 'Air', value: 'air' },
        { label: 'Surface', value: 'surface' },
        { label: 'Hyperlocal', value: 'hyperlocal' }
    ];
    // table columns for pending tab
    const columns = [
        {
            title: "Order ID",
            fixed: true,
            render: (text, record) => (
                <Link to={`/orders/${record.order.id}`}>
                    <strong>{record.order_number ? record.order_number : record.order.order_number}</strong>
                </Link>
            )
        },
        {
            title: "Receipient",
            fixed: true,
            width: 200,
            render: (text, record) => {
                const shippingAddressItems = [
                    record.order.shipping_person_street,
                    record.order.shipping_person_city,
                    record.order.shipping_person_state,
                    record.order.shipping_person_portal_code
                ];
                if (record.order.shipping_person_country) shippingAddressItems.push(record.order.shipping_person_country.name);
                const billingAddressItems = [
                    record.order.billing_person_street,
                    record.order.billing_person_city,
                    record.order.billing_person_state,
                    record.order.billing_person_portal_code
                ];
                if (record.order.billing_person_country) billingAddressItems.push(record.order.billing_person_country.name);

                const formattedShippingAddress = shippingAddressItems.filter(item => item).join(', ');
                const formattedBillingAddress = billingAddressItems.filter(item => item).join(', ');

                const companyName = record.order.shipping_company_name ? record.order.shipping_company_name : record.order.billing_company_name;

                return (
                    <div>
                        <div><strong>{record.order.shipping_person_name ? record.order.shipping_person_name : record.order.billing_person_name}</strong></div>
                        <div><small>{companyName ? companyName : null}</small></div>
                        <div><small>{formattedShippingAddress ? formattedShippingAddress : formattedBillingAddress}</small></div>
                    </div>
                )
            }
        },
        {
            title: "Order Total",
            key: 'order_total',
            dataIndex: 'order_total',
            width: 150,
            render: (text, record, index) => (
                <Input size="small" defaultValue={text} onChange={(e) => onChangeRecord(index, 'order_total', e.target.value)} />
            )
        },
        {
            title: "Order Type",
            key: 'order_type',
            dataIndex: 'order_type',
            width: 125,
            render: (text, record, index) => (
                <BaseSelect
                    className="w-100"
                    size="small"
                    options={orderTypes}
                    defaultValue={text}
                    onChange={(value) => onChangeRecord(index, 'order_type', value)}
                />
            )
        },
        {
            title: "Mode",
            key: 'mode',
            dataIndex: 'mode',
            width: 150,
            render: (text, record, index) => (
                <BaseSelect
                    className="w-100"
                    size="small"
                    options={modes}
                    defaultValue={text}
                    onChange={(value) => onChangeRecord(index, 'mode', value)}
                />
            )
        },
        {
            title: "Pkg Weight",
            key: 'package_weight',
            dataIndex: 'package_weight',
            width: 125,
            render: (text, record, index) => (
                <Input size="small" defaultValue={text} suffix="kg" onChange={(e) => onChangeRecord(index, 'package_weight', e.target.value)} />
            )
        },
        {
            title: "Pkg Length",
            key: 'package_length',
            dataIndex: 'package_length',
            width: 125,
            render: (text, record, index) => (
                <Input size="small" defaultValue={text} suffix="cm" onChange={(e) => onChangeRecord(index, 'package_length', e.target.value)} />
            )
        },
        {
            title: "Pkg Breadth",
            key: 'package_breadth',
            dataIndex: 'package_breadth',
            width: 125,
            render: (text, record, index) => (
                <Input size="small" defaultValue={text} suffix="cm" onChange={(e) => onChangeRecord(index, 'package_breadth', e.target.value)} />
            )
        },
        {
            title: "Pkg Height",
            key: 'package_height',
            dataIndex: 'package_height',
            width: 125,
            render: (text, record, index) => (
                <Input size="small" defaultValue={text} suffix="cm" onChange={(e) => onChangeRecord(index, 'package_height', e.target.value)} />
            )
        },
        {
            title: "Service",
            key: 'service_id',
            dataIndex: 'service_id',
            width: 150,
            render: (text, record, index) => (
                <BaseSelect
                    className="w-100"
                    size="small"
                    options={services}
                    optionLabel="name"
                    optionValue="id"
                    defaultValue={text}
                    onChange={(value) => onChangeRecord(index, 'service_id', value)}
                />
            )
        },
        {
            title: "Warehouse",
            key: 'warehouse_id',
            dataIndex: 'warehouse_id',
            width: 200,
            render: (text, record, index) => {
                const availableWarehouses = warehouses[record.service_id] || [];
                let defaultWarehouse = text;
                if (!defaultWarehouse) {
                    let tmp = availableWarehouses.find(item => item.is_default);
                    if (!tmp && availableWarehouses.length) tmp = availableWarehouses[0];
                    if (tmp) defaultWarehouse = tmp.value;
                }

                console.log(availableWarehouses, defaultWarehouse)

                return (
                    <BaseSelect
                        key={record.id}
                        className="w-100"
                        size="small"
                        options={availableWarehouses}
                        optionLabel="label"
                        optionValue="value"
                        value={defaultWarehouse}
                        onChange={(value) => onChangeWarehouse(index, value)}
                    />
                )
            }
        },
        {
            title: "Carrier",
            key: 'carrier',
            dataIndex: 'carrier',
            width: 200,
            render: (text, record, index) => {
                let element = <div className="link" onClick={() => onFetchCarriers(index)}><u>Change carrier</u></div>;
                
                if (text !== '') {
                    const selectedCarrier = config.carriers.find(item => Number(item.value) === Number(text));
                    if (selectedCarrier) {
                        element = (
                            <div>
                                <div>{selectedCarrier.display}</div>
                                {
                                    record.estimated_cost ? <div><strong><small>{record.order.currency}{record.estimated_cost}</small></strong></div> : null
                                }
                                <div className="link" onClick={() => onFetchCarriers(index)}><u>Change carrier</u></div>
                            </div>
                        )
                    }
                }

                return (
                    <div>
                        {
                            record.mode === 'hyperlocal' ? (
                                <small>You cannot choose carrier when mode is hyperlocal</small>
                            ) : element
                        }
                    </div>
                )
            }
        },
    ];

    const carrierColumns = [
        {
            title: "Name",
            dataIndex: 'title',
            render: (text, record) => (
                <div>
                    {
                        // record.carrier ? (
                        //     <img src={require(`assets/images/carriers/${record.carrier}.png`)} height={40} />
                        // ) : (
                        //     <span>{record.title}</span>
                        // )
                    }
                </div>
            )
        },
        {
            title: "Shipping rate",
            dataIndex: 'rate',
            key: 'rate'
        },
        {
            title: "Estimated days",
            dataIndex: 'estimateDays',
            key: 'estimateDays'
        },
        {
            title: "Action",
            render: (text, record) => (
                <Button
                    size="small"
                    type="primary"
                    onClick={() => onSelectCarrier(selectedRecordId, record)}
                >
                    Select
                </Button>
            )
        }
    ];

    useEffect(() => {
        setRecords(orders);
        setSelectedRecordId(null);
        setSelectedRows([]);
    }, [orders]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            const rows = selectedRows.filter(item => !item.is_locked);
            setSelectedRows(rows);
        }
    };

    const onChangeTable = (pagination) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onChangeRecord = _.debounce((index, key, value) => {
        const newRecords = [...records];
        newRecords[index][key] = value;
        newRecords[index]['carrier'] = '';
        newRecords[index]['estimated_cost'] = '';

        if (key === 'service_id') {
            const availableWarehouses = warehouses[value] || [];
            let tmp = availableWarehouses.find(item => item.is_default);
            if (tmp) {
                newRecords[index]['warehouse_id'] = tmp.value;
                newRecords[index]['params'] = { ...newRecords[index]['params'], warehouse: tmp };
            } else {
                if (availableWarehouses.length) {
                    newRecords[index]['warehouse_id'] = availableWarehouses[0].value;
                    newRecords[index]['params'] = { ...newRecords[index]['params'], warehouse: availableWarehouses[0] };
                } else {
                    newRecords[index]['params'] = { ...newRecords[index]['params'], warehouse: {} };
                }
            }
        }

        setRecords(newRecords);
    }, 500);

    const onChangeWarehouse = (index, value) => {
        const newRecords = [...records];
        newRecords[index]['warehouse_id'] = value;
        newRecords[index]['carrier'] = '';
        newRecords[index]['estimated_cost'] = '';

        const selectedWarehouse = warehouses[newRecords[index].service_id].find(item => item.value === value);
        if (selectedWarehouse) {
            if (newRecords[index]['params']) {
                newRecords[index]['params'] = { ...newRecords[index]['params'], warehouse: selectedWarehouse };
            } else {
                newRecords[index]['params'] = { warehouse: selectedWarehouse };
            }
        }

        setRecords(newRecords);
    }

    const onFetchCarriers = async (index) => {
        const record = records[index];

        if (record.order_total != '' && record.order_type && record.mode && record.package_weight && record.package_length != ''
            && record.package_height != '' && record.package_breadth != '' && record.service_id) {
            setSelectedRecordId(index);

            let selectedWarehouse = warehouses[record.service_id][0];
            if (record.warehouse_id) selectedWarehouse = warehouses[record.service_id].find(item => item.value === record.warehouse_id);

            const data = {
                order_id: record.order.id,
                order_total: record.order_total,
                order_type: record.order_type,
                mode: record.mode,
                package_weight: record.package_weight,
                package_length: record.package_length,
                package_breadth: record.package_breadth,
                package_height: record.package_height,
                service_id: record.service_id,
            };

            if (selectedWarehouse) {
                data.pickup_pincode = selectedWarehouse.pincode;
            }

            const response = await getAvailableCarriers(data);
            setAvailableCarriers(response.records);
            setVisibleCarrierModal(true);
        } else {
            toast.error('You have to fill out all fields before fetch available carriers');
        }
    }

    const onSelectCarrier = (index, data) => {
        const newRecords = [...records];
        newRecords[index]['carrier'] = data.carrier;
        newRecords[index]['estimated_cost'] = data.rate;
        if (newRecords[index]['params']) {
            newRecords[index]['params'] = { ...newRecords[index]['params'], carrier: data };
        } else {
            newRecords[index]['params'] = { carrier: data };
        }

        setRecords(newRecords);
        setVisibleCarrierModal(false);
        setSelectedRecordId(null);
    }

    const onBook = async () => {
        try {
            setLoading(true);
            // validate each item
            let isValid = true;
            const items = [];
            selectedRows.forEach(row => {
                if (!(row.order_total != '' && row.order_type && row.mode && row.package_weight && row.package_length != ''
                    && row.package_height != '' && row.package_breadth != '' && row.service_id)) {
                    isValid = false;
                } else {
                    // if user doesn't change default warehouse, then find it and assign to params
                    if (!row.warehouse_id) {
                        let selectedWarehouse = warehouses[row.service_id].find(item => item.is_default);
                        if (!selectedWarehouse) selectedWarehouse = warehouses[row.service_id][0];
                        if (selectedWarehouse) {
                            row.warehouse_id = selectedWarehouse.value;
                            if (!row.params) row.params = { warehouse: selectedWarehouse };
                            else row.params = { ...row.params, warehouse: selectedWarehouse };
                        } else {
                            isValid = false;
                        }
                    } else {
                        if (!row.params || !row.params.warehouse) {
                            let selectedWarehouse = warehouses[row.service_id].find(item => item.value === row.warehouse_id);
                            if (!selectedWarehouse) selectedWarehouse = warehouses[row.service_id][0];
                            if (selectedWarehouse) {
                                if (!row.params) row.params = { warehouse: selectedWarehouse };
                                else row.params = { ...row.params, warehouse: selectedWarehouse };
                            } else {
                                isValid = false;
                            }
                        }
                    }

                    items.push(row);
                }
            });

            if (isValid) {
                await bookOrders({ records: items });
                await onRefresh();
                setSelectedRows([]);
                setVisibleCarrierModal(false);
                setSelectedRecordId(null);
            } else {
                toast.error('Please fill out all fields before book shipments');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="mb-16">
                <Button type="primary" disabled={!selectedRows.length} onClick={onBook}>Book</Button>
            </div>
            <Alert
                className="mb-16"
                message="When you change any information of order, carrier information of this order will be reset. You can choose carrier again or leave it as automatically."
                type="info"
                showIcon
                closable
            />
            <Table
                rowSelection={rowSelection}
                rowClassName={record => record.is_locked ? 'shipment-order-locked' : ''}
                loading={loading}
                dataSource={records}
                columns={columns}
                rowKey={"id"}
                onChange={onChangeTable}
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
                scroll={{
                    x: 'max-content'
                }}
            />
            <Modal
                visible={visibleCarrierModal}
                onCancel={() => setVisibleCarrierModal(false)}
                footer={null}
                width={800}
            >
                <Title level={4} className="mb-16">Available carriers</Title>
                <Table
                    columns={carrierColumns}
                    dataSource={availableCarriers}
                    pagination={false}
                    rowKey={"carrier"}
                />
                {
                    !availableCarriers.length ? (
                        <Row justify="center" className="mt-16">
                            <Button type="primary" onClick={() => setVisibleCarrierModal(false)}>Change order options</Button>
                        </Row>
                    ) : null
                }

            </Modal>
        </div>
    )
}

export default PendingShipmentOrders;