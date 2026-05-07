import React, { useEffect, useRef, useState } from "react";
import { Tabs,} from "antd";
import OrderList from "routes/order/OrderList";
import TransactionPayoutList from "routes/payout/TransactionPayoutList";
const Transaction = () => {

  const onChange = (key) => {
    console.log(key);
  };

 
  const items = [
    
    {
      key: "2",
      label: "Payout Transaction",
      children: (
        <>
         <TransactionPayoutList/>
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

export default Transaction;
