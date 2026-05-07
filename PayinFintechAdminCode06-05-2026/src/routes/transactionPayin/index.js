import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "antd";
import OrderList from "routes/order/OrderList";
import TransactionPayInList from "routes/payout/TransactionPayInList";
const TransactionPayin = () => {
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Payin Transaction",
      children: (
        <>
          <TransactionPayInList />
        </>
      ),
    },
  ];
  return (
    <div>
      {/* <PageTitle titles={titles} /> */}
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};

export default TransactionPayin;
