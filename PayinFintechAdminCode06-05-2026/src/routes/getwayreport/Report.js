import React, { useState, useEffect } from "react";
import {Tabs } from "antd";
import GatewayReport from "../../../src/routes/getwayreport/GetwayReport";
import PaymentPayoutReport from "../../../src/routes/getwaypayoutreport/PaymentPayoutReport";
import Payintopayout  from "../../../src/routes/payinto_payout/Payintopayout";

const Report = () => {
  
  const onChange = (key) => {
    console.log(key);
  };
 
  const items = [
    {
      key: "1",
      label: "PayIN",
      children: (
        <>
          <GatewayReport />
        </>
      ),
    },
    {
      key: "2",
      label: "Payout",
      children: (
        <>
          <PaymentPayoutReport />
        </>
      ),
    },

    {
      key: "3",
      label: "PayIn to Payout",
      children: (
        <>
          <Payintopayout  />
        </>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};
export default Report;
