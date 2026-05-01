import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Switch } from "antd";
// requests
import { getModules } from 'requests/module';
import { getServices } from 'requests/service';

const CarrierTable = (props) => {
    const { platform, orderType, mode, data, onChange } = props;

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const config = useSelector(state => state.config);

    useEffect(() => {
        const getData = async () => {
			const moduleResponse = await getModules({ type: 2 }); // get shipment modules
			const moduleIds = moduleResponse.records.map(module => module.id);

			let services = [];
			for (let i = 0; i < moduleIds.length; i++) {
				const serviceResponse = await getServices(moduleIds[i], { is_paginate: 0 });
				services = services.concat(serviceResponse.records);
			}
			setServices(services);
			setLoading(false);
		}

		getData();
    }, []);

    useEffect(() => {
        let columns = services.map(service => {
            return {
                title: service.name,
                dataIndex: service.name.replace(' ', '_'),
                render: (text, record) => (
                    <Switch 
                        defaultChecked={text} 
                        onChange={(checked) => onToggleCarrier(service.id, record, checked)}
                    />
                )
            }
        });
        columns = [
            {
                title: 'Carrier',
                dataIndex: 'carrier'
            },
            ...columns
        ];
        setColumns(columns);

        const rows = config.carriers.map(carrier => {
            let item =  {
                carrier: carrier.display,
                key: carrier.value,
                index: `${carrier.value}_${Date.now()}`,
            };

            services.forEach(service => {
                const propertyName = service.name.replace(' ', '_');

                if (Object.keys(data).length && data[service.id]) {
                    item[propertyName] = !data[service.id].includes(item.key);
                } else {
                    item[propertyName] = true;  // <== default is enabled
                }
            });

            return item;
        });
        // move other option to the last
        if (rows[0].key === 0) {
            const otherItem = rows[0];
            rows.shift();
            rows.push(otherItem);
        }
        setRows(rows);
    }, [data, services]);

    const onToggleCarrier = (serviceId, record, checked) => {
        const originExcludeCarriers = data || {};

        if (checked) {
            if (originExcludeCarriers[serviceId]) {
                originExcludeCarriers[serviceId] = originExcludeCarriers[serviceId].filter(carrierId => carrierId != record.key);
            } else {
                originExcludeCarriers[serviceId] = [];
            }
        } else {
            if (originExcludeCarriers[serviceId]) {
                originExcludeCarriers[serviceId] = [...originExcludeCarriers[serviceId], record.key];
            } else {
                originExcludeCarriers[serviceId] = [record.key];
            }
        }
        
        onChange(`${platform}.storefront.${orderType}.${mode}.exclude_carriers`, originExcludeCarriers);
    }

    return (
        <Table 
            rowKey={'index'}
            columns={columns}
            dataSource={rows}
            pagination={false}
            loading={loading}
        />
    )
}

export default CarrierTable;