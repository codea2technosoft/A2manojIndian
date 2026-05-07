import React, { useEffect, useRef, useState } from "react";
import { Spin, Table, Button, Tag, Row, Col,Card, Tabs,Modal,Form,Input, message} from "antd";
import { useLocation, useNavigate} from "react-router-dom";
import PageTitle from "components/PageTitle";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';

const IpWhitelistPayout = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newIP, setNewIP] = useState('');
  const segment = window.location.pathname.split("/");
  console.warn(segment[2])
  
  const isValidIP = (ip) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };


  const onSetDatesByDatePicker = (dates) => {
    setMode("custom");
    setDates(dates);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk = () => {
    if (isValidIP(newIP)) {
      addPayINWhitelist(newIP);
    } else {
      message.error('Invalid IP address. Please enter a valid IP.', 2);
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
  };

  
  const columns = [
    {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
    },
    {
        title: 'Name',
        key: 'ip',
        dataIndex: 'ip',
    },


    {
        title: 'Created At',
        key: 'created_at',
        dataIndex: 'created_at',
    },
];


const getRecords = async () => {
  try {
      setIsTableLoading(true);
      const response = await api.get(`/ip-whitelist-payout-list/${segment[2]}`);
      console.warn(response.data.data);
      setIsTableLoading(false);
      setRecords(response.data.data);
     
  } catch (err) {
      console.log(err);
  }
};





  
useEffect(() => {
  const query = parseQueryParams(location);
  getRecords(query);
}, [location]);



const addPayINWhitelist = async (ip) => {
  try {
      const response = await api.post('ip-whitelist-payout-store', {
          ip: ip,
          user_id:segment[2],
      });

      console.log(response.data);
      setSuccessMessage(`${response.data.message}`);
      setIsModalOpen(false);
      // message.success(response.data.message, 2);
  } catch (error) {
      console.error(error);
      setSuccessMessage(`${error.response.data.message}`);
      // message.error(error.response.data.message, 2);
  }
};


  const onSearch = (keyword) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const onRefresh = () => {
    let query = parseQueryParams(location);
    query = {
      page: 1,
      keyword: "",
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });

    if (searchRef.current?.input.value) {
      searchRef.current.handleReset();
    }
  };

  const onChange = (key) => {
    console.log(key);
  };
  const onChangeTable = (pagination) => {
    console.log(pagination);

    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const renderStatus = (text) => {
    switch (text) {
      case "queued":
        return <Tag color="volcano">{text}</Tag>;
      case "pending":
        return <Tag color="gold">{text}</Tag>;
      case "rejected":
        return <Tag color="red">{text}</Tag>;
      case "processing":
        return <Tag color="blue">{text}</Tag>;
      case "processed":
        return <Tag color="green">{text}</Tag>;
      case "cancelled":
        return <Tag color="red">{text}</Tag>;
      case "reversed":
        return <Tag color="purple">{text}</Tag>;
      default:
        return null;
    }
  };

 

  const items = [
    {
      key: "1",
      label: "PayIN",
      children: (
        <>
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col xs={24} sm={24} md={8} lg={8} xl={7}>
              <Card className="small_card">
                <TableBar
                  onSearch={onSearch}
                  showFilter={false}
                  placeholderInput="Search..."
                  inputRef={searchRef}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={4}>
              <Card className="small_card">
                <Button type="primary" size="large" onClick={showModal}>
                  Add New
                </Button>
              </Card>
            </Col>
          </Row>
          <Spin spinning={isTableLoading}>
            <Table
              style={{ marginTop: "10px" }}
              dataSource={records}
              columns={columns}
              onChange={onChangeTable}
              rowKey={"id"}
              pagination={{
                pageSize: perPage,
                total: totalCount,
                current: page,
              }}
            />
          </Spin>
        </>
      ),
    },
    {
      key: "2",
      label: "Payout",
      children: (
        <>
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col xs={24} sm={24} md={8} lg={8} xl={7}>
              <Card className="small_card">
                <TableBar
                  onSearch={onSearch}
                  showFilter={false}
                  placeholderInput="Search..."
                  inputRef={searchRef}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={4}>
              <Card className="small_card">
                <Button type="primary" size="large" onClick={showModal2}>
                  Add New
                </Button>
              </Card>
            </Col>
          </Row>
          <Spin spinning={isTableLoading}>
            <Table
              style={{ marginTop: "10px" }}
              dataSource={records}
              columns={columns}
              onChange={onChangeTable}
              rowKey={"id"}
              pagination={{
                pageSize: perPage,
                total: totalCount,
                current: page,
              }}
            />
          </Spin>
        </>
      ),
    },
  ];

  return (
    <div>

      <div>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          indicatorSize={(origin) => origin - 16}
        />
      </div>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} title="PayIN Whitelist">
        <Form layout="vertical">
          <Input placeholder="Enter IP for PayIn Whitelist" value={newIP} onChange={(e) => setNewIP(e.target.value)}/>
        </Form>
      </Modal>

      <Modal
        title="Payout Whitelist"
        open={isModalOpen2}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Input placeholder="Enter IP for Payout Whitelist" />
        </Form>
      </Modal>
    </div>
  );
};

export default IpWhitelistPayout;
