import React, { useState, useEffect } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space } from "antd";
import Table from "react-bootstrap/Table";

export default function Resulthistory() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
      {!isLoading && (
        <section id="Help" className="margin-bottom-88">
          {/* Your iframe code here */}
          <iframe
            src={`https://matkawaale.com/api/app_result.php`}
            style={{ width: "100%", height: "1500px" }}
            className="resulthistorydesign"
          />
        </section>
      )}
    </>
  );
}
