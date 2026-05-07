import React, { useEffect, useRef, useState } from "react";
import { Tabs,} from "antd";
import OrderList from "routes/order/OrderList";
import TransactionAccountPayoutReporttList from "routes/payout/TransactionAccountPayoutReporttList";
const AccountPayoutReport = () => {

  const onChange = (key) => {
    console.log(key);
  };

 
  const items = [
    
    {
      key: "2",
      label: "Account Payout Report",
      children: (
        <>
         <TransactionAccountPayoutReporttList/>
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

export default AccountPayoutReport;
