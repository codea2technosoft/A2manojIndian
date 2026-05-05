import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Col, Row, Statistic } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Line } from '@ant-design/plots';
// request
import { getPaymentMethodSummary } from 'requests/statistic';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const handleData = (rawData) => {
    let data = [...rawData];

    const availableModes = _.uniq(_.map(rawData, 'payment_mode'));
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    availableModes.forEach((mode) => {
        months.forEach((month) => {
            let idx = data.findIndex((item) => item.payment_mode == mode && item.month == month);
            if (idx < 0) {
                data.push({
                    sum_total: 0,
                    payment_mode: mode,
                    month: month,
                });
            } else {
                delete data[idx].type_txt;
                data[idx].month = data[idx].month;
            }
        });
    });

    data = _.sortBy(data, 'month');
    data = data.map((item) => ({ ...item, month: String(item.month) }));

    return data;
};

// const handleData = (rawData) => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentYear = currentDate.getFullYear();

//     const dayWiseData = new Map();

//     rawData.forEach(item => {
//         const date = new Date(item.date);
//         const itemMonth = date.getMonth() + 1;
//         const itemYear = date.getFullYear();

//         if (itemMonth === currentMonth && itemYear === currentYear) {
//             const day = date.getDate();
//             const paymentMode = item.payment_mode;

//             if (!dayWiseData.has(day)) {
//                 dayWiseData.set(day, {});
//             }

//             if (!dayWiseData.get(day).hasOwnProperty(paymentMode)) {
//                 dayWiseData.get(day)[paymentMode] = 0;
//             }
//             dayWiseData.get(day)[paymentMode] += item.sum_total;
//         }
//     });
//     const dayWiseArray = [];
//     dayWiseData.forEach((data, day) => {
//         dayWiseArray.push({
//             date: `${currentYear}-${currentMonth}-${day}`,
//             ...data
//         });
//     });

//     return dayWiseArray;
// }

const PaymentChart = () => {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const response = await getPaymentMethodSummary();
            const data = handleData(response.records);
            setRecords(data);
        };

        getData();
    }, []);

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Transaction Overview',
                backgroundColor: 'rgb(70 7 7 / 77%)',
                borderColor: 'rgb(70 7 7 / 77%)',
                data: [20, 30, 39, 55, 45, 15, 19, 28],
            },
            {
                label: '',
                backgroundColor: '#e39e9e',
                borderColor: '#e39e9e',
                data: [12, 50, 45, 35, 65, 35, 12, 48],
            },
        ],
    };
    return (
        <div>
            {/* <Card title="Payment Overview"> */}
            <Card>
                {/* {
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
            } */}

                <Bar data={data} />
            </Card>
        </div>
    );
};

export default PaymentChart;
