import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Col, Row, Statistic } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Line } from '@ant-design/plots';
// request
import { getPaymentMethodSummary } from 'requests/statistic';

const handleData = (rawData) => {
    let data = [...rawData];

    const availableModes = _.uniq(_.map(rawData, 'payment_mode'));
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    availableModes.forEach(mode => {
        months.forEach(month => {
            let idx = data.findIndex(item => item.payment_mode == mode && item.month == month);
            if (idx < 0) {
                data.push({
                    "sum_total": 0,
                    "payment_mode": mode,
                    "month": month,
                })
            } else {
                delete data[idx].type_txt;
                data[idx].month = data[idx].month;
            }
        });
    });

    data = _.sortBy(data, 'month');
    data = data.map(item => ({...item, month: String(item.month)}))

    return data;
}



const PaymentChart = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getPaymentMethodSummary();
            const data = handleData(response.records);
            setRecords(data);
        }

        getData();
    }, []);

    return (
        <Card
            title='Payment Overview'
        >
            {
                records.length && (
                    <Line
                        data={records}
                        xField='month'
                        yField='sum_total'
                        seriesField='payment_mode'
                        xAxis={{
                            label: {
                                formatter: (v) => `${dayjs().set('month', v - 1).format('MMM YYYY')}`,
                            }
                        }}
                        yAxis={{
                            label: {
                                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                            }
                        }}
                    />
                )
            }
        </Card>
    )
}

export default PaymentChart;