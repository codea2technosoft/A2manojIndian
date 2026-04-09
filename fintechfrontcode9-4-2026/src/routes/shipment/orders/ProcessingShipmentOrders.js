import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Table, Tabs, Alert, Modal, Button, Typography, Tag } from "antd";
import Parse from 'html-react-parser';
import _ from 'lodash';
import { toast } from 'react-toast';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// requests
import { cancelOrders, getSlips, getManifests, reverseOrders } from "requests/shipment";

const ProcessingShipmentOrders = (props) => {
    const { currentTab, warehouses, page, perPage, totalCount, orders, onRefresh } = props;

    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [visibleReverseBtn, setVisibleReverseBtn] = useState(false);

    const config = useSelector(state => state.config);
    const location = useLocation();
    const navigate = useNavigate();

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
            title: "Shipment Order ID",
            key: 'shipment_order_id',
            dataIndex: 'shipment_order_id',
            fixed: true,
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    {
                        record.shipment_id ? <div><small>Shipment ID: {record.shipment_id}</small></div> : null
                    }
                    {
                        record.is_manifest_generated ? <Tag color='green'>Manifest generated</Tag> : null
                    }
                </div>
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
        },
        {
            title: "AWB",
            key: 'awb_code',
            dataIndex: 'awb_code',
            render: (text, record) => (
                <div>
                    <Link to={`/shipment/tracking?awb=${text}`} target="_blank">{text}</Link>
                    <div>
                    {
                        record.raw_data && record.raw_data.pickup_scheduled_date ? <small>Pickup at: <br />{record.raw_data.pickup_scheduled_date}</small> : null
                    }
                    </div>
                </div>
            )
        },
        {
            title: "Order Type",
            key: 'order_type',
            dataIndex: 'order_type',
        },
        {
            title: "Mode",
            key: 'mode',
            dataIndex: 'mode',
        },
        {
            title: "Rebook?",
            key: 'can_rebook',
            dataIndex: 'can_rebook',
            render: (text) => {
                if (text) return <Tag color="purple">available</Tag>;
                return <Tag color="red">unavailable</Tag>;
            }
        },
        {
            title: "Pkg Dimensions",
            width: 150,
            render: (text, record) => (
                <div>
                    <div>{record.package_weight}kg</div>
                    <div><small>{record.package_length}cm x {record.package_breadth}cm x {record.package_height}cm</small></div>
                </div>
            )
        },
        {
            title: "Service",
            key: 'service_id',
            dataIndex: 'service_id',
            render: (text, record) => {
                const service = config.service_types.find(item => item.id === text);
                if (service) return <div>{service.display}</div>;
                return null;
            }
        },
        {
            title: "Warehouse",
            key: 'warehouse_id',
            dataIndex: 'warehouse_id',
            width: 150,
            render: (text, record) => {
                if (warehouses[record.service_id]) {
                    const warehouse = warehouses[record.service_id].find(item => item.value === text);
                    if (warehouse) return <div>{warehouse.label}</div>;
                }

                return null;
            }
        },
        {
            title: "Carrier",
            key: 'carrier',
            dataIndex: 'carrier',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div>
                        {
                            // text ? (
                            //     <React.Fragment>
                            //         {
                            //             text != '0' ? <img src={require(`assets/images/carriers/${text}.png`)} height={30} /> : 'Other'
                            //         }
                            //     </React.Fragment>
                            // ) : null
                        }
                        {
                            record.estimated_cost ? <div><strong><small>{record.order.currency}{record.estimated_cost}</small></strong></div> : null
                        }
                    </div>
                )
            }
        },
    ];

    useEffect(() => {
        setRecords(orders);
    }, [orders]);

    useEffect(() => {
        if (currentTab === '8') setVisibleReverseBtn(true);
    }, [currentTab]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
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

    const onPressReverseButton = () => {
        Modal.confirm({
            title: "Do you want reverse these order(s)?",
            okText: "Yes",
            onOk: async () => {
                await onReverse();
            }
        });
    }

    const onReverse = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const ids = selectedRows.map(row => row.id);
            await reverseOrders({ orderIds: ids });
            await onRefresh();
            setSelectedRows([]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onPressCancelButton = () => {
        Modal.confirm({
            title: "Do you want cancel these order(s) at original platform also?",
            okText: "Yes",
            cancelText: "Cancel shipment order(s) only",
            onOk: async () => {
                await onCancel(true);
            },
            onCancel: async () => {
                await onCancel(false);
            }
        });
    }

    const onCancel = async (isCancelAtPlatform = true) => {
        try {
            setLoading(true);
            setErrorMessage('');
            const ids = selectedRows.map(row => row.id);
            const response = await cancelOrders({ orderIds: ids, isCancelAtPlatform: isCancelAtPlatform });
            if (response.error_ids.length) {
                let message = '<div><div>There are errors when cancelling below order(s):</div>';
                message += `<div>${response.error_ids.join(', ')}</div>`;
                message += '</div>';
                setErrorMessage(message);
            } else {
                toast.success('Cancellation orders is requested');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onGetSlips = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const ids = selectedRows.map(row => row.id);
            const response = await getSlips({ orderIds: ids });
            const errors = [];
            response.results.forEach(result => {
                if (result.status) window.open(result.url, '_blank');
                else errors.push(result);
            });

            if (errors.length) {
                let message = '<div><div>There are errors when download slips of below order(s):</div><ul>';
                errors.forEach(error => {
                    message += `<li><b>${error.service_name}</b>: ${error.order_ids.join(', ')}</li>`;
                });
                message += '</ul></div>';
                setErrorMessage(message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onGetManifests = async () => {
        try {
            setLoading(true);
            setErrorMessage('');
            const ids = selectedRows.map(row => row.id);
            const response = await getManifests({ orderIds: ids });
            const errors = [];
            response.results.forEach(result => {
                if (result.status) window.open(result.url, '_blank');
                else errors.push(result);
            });

            if (errors.length) {
                let message = '<div><div>There are errors when download manifests of below order(s):</div><ul>';
                errors.forEach(error => {
                    message += `<li><b>${error.service_name}</b>: ${error.order_ids.join(', ')}</li>`;
                });
                message += '</ul></div>';
                setErrorMessage(message);
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
                {
                    visibleReverseBtn ? <Button type="primary" className="mr-8" disabled={!selectedRows.length} onClick={onPressReverseButton}>Reverse</Button> : null
                }
                <Button type="primary" className="mr-8" disabled={!selectedRows.length} danger onClick={onPressCancelButton}>Cancel</Button>
                <Button type="default" className="mr-8" disabled={!selectedRows.length} onClick={onGetSlips}>Download Slips</Button>
                <Button type="default" className="mr-8" disabled={!selectedRows.length} onClick={onGetManifests}>Download Manifests</Button>
            </div>
            {
                errorMessage ? (
                    <Alert
                        description={Parse(errorMessage)}
                        type="error"
                        closable
                        className="mb-16"
                    />
                ) : null
            }
            <Table
                rowSelection={rowSelection}
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
        </div>
    )
}

export default ProcessingShipmentOrders;