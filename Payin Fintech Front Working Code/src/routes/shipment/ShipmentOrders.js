import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Alert, Skeleton } from "antd";
import _ from 'lodash';
import PageTitle from 'components/PageTitle';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import PendingShipmentOrders from "./orders/PendingShipmentOrders";
import ProcessingShipmentOrders from "./orders/ProcessingShipmentOrders";
import UnprocessedShipmentOrders from "./orders/UnprocessedShipmentOrders";
// requests
import { getShipmentOrders, getShipmentWarehouses, getBookingShipmentProgress } from "requests/shipment";
import { getModules } from 'requests/module';
import { getServices } from 'requests/service';
import CancelledShipmentOrders from "./orders/CancelledShipmentOrders";

const { TabPane } = Tabs;

const ShipmentOrders = () => {
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('0');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [services, setServices] = useState([]);
    const [warehouses, setWarehouses] = useState({});
    const [inProgressSessions, setInProgressSessions] = useState(0);
    const [pendingOrderCount, setPendingOrderCount] = useState(0);
    const [totalPendingOrderCount, setTotalPendingOrderCount] = useState(0);

    const config = useSelector(state => state.config);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: '/shipment/orders', title: 'Shipment Orders' }];

    useEffect(() => {
        const getShipmentServices = async () => {
            const moduleResponse = await getModules({ type: 2 }); // get payment modules
            const moduleIds = moduleResponse.records.map(module => module.id);

            let services = [];
            for (let i = 0; i < moduleIds.length; i++) {
                const serviceResponse = await getServices(moduleIds[i], { is_paginate: 0 });
                services = services.concat(serviceResponse.records);
            }
            setServices(services);

            // get warehouses
            const warehouseResponse = await getShipmentWarehouses();
            setWarehouses(warehouseResponse.records);

            // get booking shipment progress
            const shipmentProgressResponse = await getBookingShipmentProgress();
            setInProgressSessions(shipmentProgressResponse.sessions);
            setPendingOrderCount(shipmentProgressResponse.pending);
            setTotalPendingOrderCount(shipmentProgressResponse.total);

            setLoading(false);
        }

        getShipmentServices();
    }, []);

    useEffect(() => {
        const query = parseQueryParams(location);
        if (query.shipment_status) setSelectedTab(query.shipment_status);
        getRecords(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setLoading(true);
            const response = await getShipmentOrders(query);

            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const onChangeTab = (key) => {
        const query = parseQueryParams(location);
        query.shipment_status = key;

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    }

    const renderContent = () => {
        const query = parseQueryParams(location);

        if (selectedTab === '0') { // pending orders
            return (
                <PendingShipmentOrders
                    page={page}
                    perPage={perPage}
                    totalCount={totalCount}
                    orders={records}
                    services={services}
                    warehouses={warehouses}
                    onRefresh={() => getRecords(query)}
                />
            );
        } else if (selectedTab === '9') { // cancelled orders
            return (
                <CancelledShipmentOrders
                    page={page}
                    perPage={perPage}
                    totalCount={totalCount}
                    orders={records}
                    services={services}
                    warehouses={warehouses}
                    onRefresh={() => getRecords(query)}
                />
            );
        } else if (selectedTab === '10') { // unprocessed orders
            return (
                <UnprocessedShipmentOrders
                    page={page}
                    perPage={perPage}
                    totalCount={totalCount}
                    orders={records}
                    services={services}
                    warehouses={warehouses}
                    onRefresh={() => getRecords(query)}
                />
            );
        } else {
            return (
                <ProcessingShipmentOrders
                    currentTab={selectedTab}
                    page={page}
                    perPage={perPage}
                    totalCount={totalCount}
                    orders={records}
                    warehouses={warehouses}
                    onRefresh={() => getRecords(query)}
                />
            )
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            {
                inProgressSessions ? (
                    <Alert
                        message={
                            <div>There are {pendingOrderCount} pending order(s) of total {totalPendingOrderCount} order(s) from latest {inProgressSessions} booking session times.</div>
                        }
                        type="info"
                        closable
                        showIcon
                        className="mb-8"
                    />
                ) : null
            }
            <Alert
                message={"Orders which have gray background are locked, you cannot do anything with these orders until they are unlocked"}
                type="warning"
                closable
                showIcon
                className="mb-8"
            />
            <Tabs activeKey={selectedTab} onChange={onChangeTab}>
                {
                    config.shipment_order_statuses.map(status => (
                        <TabPane key={status.value} tab={status.display}></TabPane>
                    ))
                }
            </Tabs>
            {
                loading ? <Skeleton /> : renderContent()
            }
        </div>
    )
}

export default ShipmentOrders;