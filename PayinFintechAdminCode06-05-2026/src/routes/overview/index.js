import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Typography, Row, Col, Table } from "antd";
// css
import "assets/styles/overview.scss";
import "assets/styles/statistic.scss";
import OverviewCardByDate from "./OverviewCardByDate";
// request

const { Title } = Typography;

const PayoutOverview = () => {
  const authUser = useSelector((state) => state.auth.authUser);

  return (
    <div className="overview-content border-red">
      <div className="overview-main">
        <OverviewCardByDate />
      </div>
    </div>
  );
};

export default PayoutOverview;
