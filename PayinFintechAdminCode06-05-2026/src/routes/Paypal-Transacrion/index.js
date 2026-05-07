import React, { useEffect, useRef, useState } from "react";
import { Tabs,} from "antd";
import OrderList from "routes/order/OrderList";
import TransactionPaypalList from "routes/Paypal-Transacrion/TransactionPaypalList";
const PaypalTransaction = () => {

  const onChange = (key) => {
    console.log(key);
  };

 
  const items = [
    
    {
      key: "2",
      label: "Paypal Transaction",
      children: (
        <>
         <TransactionPaypalList/>
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

export default PaypalTransaction;
