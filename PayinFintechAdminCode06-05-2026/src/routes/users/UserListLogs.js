import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Table, Button, Card, Row, Col, Typography, Space, Tag, Tooltip, Badge, Modal } from "antd";
import { 
  ArrowLeftOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  DesktopOutlined, 
  MobileOutlined, 
  TabletOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { getUserLogs } from "requests/user";
import moment from "moment";

const { Title, Text } = Typography;

const UserListLogs = () => {
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE || 10);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 🔥 Map Modal State
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null, email: "" });

  const location = useLocation();
  const navigate = useNavigate();

  console.log("🔵 UserListLogs Component Loaded!");
  console.log("📌 User ID:", userId);

  // 🔥 Open Map Modal
  const openMap = (lat, lng, email) => {
    if (lat && lng) {
      setSelectedLocation({ lat, lng, email });
      setMapModalVisible(true);
    } else {
      // Toast ya notification
      // toast.warning("Location not available for this record");
    }
  };

  // 🔥 All Columns with all fields
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (text, record, index) => (page - 1) * perPage + index + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      render: (text) => <Text copyable>{text || "-"}</Text>,
    },
    {
      title: "Date & Time",
      dataIndex: "date_time",
      key: "date_time",
      width: 170,
      render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "-",
      sorter: true,
    },
    {
      title: "Device Info",
      key: "device_info",
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            {record.is_desktop === "1" && <DesktopOutlined style={{ color: '#1890ff' }} />}
            {record.is_mobile === "1" && <MobileOutlined style={{ color: '#52c41a' }} />}
            {record.is_tablet === "1" && <TabletOutlined style={{ color: '#faad14' }} />}
            <Text strong>{record.device_type || "Unknown"}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.device_name || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "Browser",
      key: "browser",
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.browser || "-"}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>v{record.browser_version || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "OS",
      dataIndex: "os",
      key: "os",
      width: 120,
      render: (text) => text || "-",
    },
    {
      title: "Screen",
      key: "screen",
      width: 120,
      render: (_, record) => (
        <Text>
          {record.screen_width && record.screen_height 
            ? `${record.screen_width} × ${record.screen_height}` 
            : "-"}
        </Text>
      ),
    },
    {
      title: "📍 Location",
      key: "location",
      width: 180,
      render: (_, record) => {
        const hasLocation = record.latitude && record.longitude;
        return hasLocation ? (
          <Button 
            type="link" 
            onClick={() => openMap(record.latitude, record.longitude, record.email)}
            style={{ padding: 0, height: 'auto' }}
          >
            <Space>
              <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
              <span>
                {parseFloat(record.latitude).toFixed(4)}, {parseFloat(record.longitude).toFixed(4)}
              </span>
            </Space>
          </Button>
        ) : (
          <Text type="secondary">Not Available</Text>
        );
      },
    },
    {
      title: "User Agent",
      dataIndex: "user_agent",
      key: "user_agent",
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 180 }}>
            {text || "-"}
          </Text>
        </Tooltip>
      ),
    },
   
  ];

  const getRecords = async (query) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const params = {
        userid: userId,
        page: query.page || page,
        per_page: query.per_page || perPage,
      };
      
      const response = await getUserLogs(params);
      console.log("📊 Logs Response:", response);
      
      if (response && response.records) {
        setRecords(response.records || []);
        setPage(response.page || 1);
        setPerPage(response.per_page || perPage);
        setTotalCount(response.total_record || 0);
      } else {
        setRecords([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("❌ Error fetching logs:", err);
      setRecords([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location, userId]);

  const onChangeTable = (pagination, filters, sorter, extra) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    if (sorter.order) {
      query = {
        ...query,
        order_by: sorter.field,
        order_type: sorter.order === "ascend" ? "asc" : "desc",
      };
    } else {
      delete query.order_by;
      delete query.order_type;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
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

  const goBack = () => {
    navigate("/users");
  };

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
                Back
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                <ClockCircleOutlined /> User Login Logs
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Tag color="blue">User ID: {userId}</Tag>
              {/* <Tag color="green">Total Logins: {totalCount}</Tag> */}
              {records.length > 0 && (
                <Tag color="purple">Showing: {records.length}</Tag>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={12} lg={8}>
            <TableBar showFilter={false} onSearch={onSearch} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={() => getRecords({ page, per_page: perPage })}>
              🔄 Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: perPage,
            total: totalCount,
            current: page,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`,
          }}
          size="middle"
        />
      </Card>

      {/* 🔥 Map Modal */}
      <Modal
        title={
          <Space>
            <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
            <span>Location Map</span>
            <Tag color="blue">{selectedLocation.email}</Tag>
          </Space>
        }
        open={mapModalVisible}
        onCancel={() => setMapModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMapModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="open" 
            type="primary"
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
                '_blank'
              );
            }}
          >
            Open in Google Maps
          </Button>
        ]}
        width={800}
      >
        {selectedLocation.lat && selectedLocation.lng && (
          <div>
            {/* Location Details */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card size="small">
                  <Text type="secondary">Latitude</Text>
                  <br />
                  <Text strong>{selectedLocation.lat}</Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Text type="secondary">Longitude</Text>
                  <br />
                  <Text strong>{selectedLocation.lng}</Text>
                </Card>
              </Col>
            </Row>

            {/* Map iframe */}
            <div style={{ 
              width: '100%', 
              height: '450px', 
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e8e8e8'
            }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedLocation.lat},${selectedLocation.lng}&zoom=15`}
                title="Location Map"
              />
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Space>
                <Button 
                  icon={<GlobalOutlined />}
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
                      '_blank'
                    );
                  }}
                >
                  Open Google Maps
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `https://www.openstreetmap.org/?mlat=${selectedLocation.lat}&mlon=${selectedLocation.lng}&zoom=15`,
                      '_blank'
                    );
                  }}
                >
                  Open OpenStreetMap
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserListLogs;