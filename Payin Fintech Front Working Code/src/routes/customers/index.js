import { PencilIcon, PlusSmIcon } from "@heroicons/react/solid";
import { Button, Modal, Spin, Table, Tabs } from "antd";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createCustomer, createCustomerAddress, deleteCustomerAddress, getCustomers, updateCustomer } from "requests/customer";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import CurrenViewing from "routes/customers/CurrentViewing";
import CustomerAddressList from "routes/customers/CustomerAddressList";
import CustomerCreateForm from "routes/customers/CustomerCreateForm";
import CustomerUpdateForm from "routes/customers/CustomerUpdateForm";

const { TabPane } = Tabs;

const Customer = () => {

  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = React.useState(0);
  const [records, setRecords] = React.useState([]);
  const [currentRecord, setCurrentRecord] = React.useState([]);
  const [visibleCreateForm, setVisibleCreateForm] = React.useState(false);
  const [visibleAddressList, setVisibleAddressList] = React.useState(false);
  const [visibleUpdateForm, setVisibleUpdateForm] = React.useState(false);
  const [addresses, setAddresses] = React.useState([]);
  const [currentId, setCurrentId] = React.useState(null);


  const location = useLocation();
  const navigate = useNavigate();

  const titles = [{ path: location.pathname, title: "Customers" }];

  const operations = () => (
    <div>
      <Button type="primary" icon={<PlusSmIcon className="icon-btn" />} onClick={onToggleCreateForm}>
        Add new customer
      </Button>
      {/* <Button
        type="ghost"
        icon={<PencilIcon className="icon-btn" />}
        className="ml-8"
      >
        Edit
      </Button> */}
    </div>
  );

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Name",
      width: 150,
      render: (record) => {
        return (
          <div>{record.first_name} {record.last_name}</div>
        )
      },
    },
    {
      title: "Company",
      key: "company",
      dataIndex: "company",
      width: 150,
    },
    {
      title: "Group",
      render: (record) => {
        if (record.group) return record.group.name;
        return null;
      }
    },
    {
      title: 'Address',
      width: 180,
      render: (record) => (
        <div>
          <div>{record.street}</div>
          <div>{record.city}</div>
        </div>
      )
    },
    {
      title: "Country",
      render: (record) => {
        if (record.country) return record.country.name;
        return null;
      },
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      render: (text) => (
        <a href={`mailto:${text}`}>
          {text.length > 24 ? <small>{text}</small> : <div>{text}</div>}
        </a>
      )
    },
    {
      title: "Mobile",
      key: "mobile",
      dataIndex: 'mobile',
      width: 150
    },
    {
      title: "Channel",
      render: (record) => {
        if (record.store) {
          return (
            <img src={process.env.REACT_APP_ASSET_URL + record.store.platform_logo} height={20} className="img-contain" />
          )
        }

        return null;
      }
    },
    {
      title: "Orders",
      key: "order",
      dataIndex: "order_count",
      align: "center",
      render: (text, record) => {
        return (
          <Link to={`/orders?customer_id=${record.id}`}>{text} order(s)</Link>
        )
      }
    },
    // {
    //   title: 'Actions',
    //   render: (text, record) => (
    //     <Button type="link" size="small" onClick={() => {
    //       setCurrentRecord(record);
    //       setCurrentId(record.id);
    //       onToggleUpdateForm();
    //     }}>
    //       <PencilIcon width={24} height={24} />
    //     </Button>
    //   ),
    // },
  ];


  const getRecords = async (query) => {
    try {
      setIsTableLoading(true);
      const response = await getCustomers(query);

      const customers = response.records.map(record => {
        if (record.default_address.length) {
          const { id, ...restAddress } = record.default_address[0];
          return {
            ...record,
            address_id: id,
            ...restAddress
          };
        }

        return record;
      })

      setRecords(customers);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_records);

      setIsTableLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const onCreatCustomer = async (data) => {
    try {
      await createCustomer(data);
      // refresh list
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
    } catch (err) {
      console.log(err);
    }
  }
  const onUpdateCustomer = async (data) => {
    try {
      await updateCustomer(currentId, data);
      // refresh list
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
    } catch (err) {
      console.log(err);
    }
  }

  const onCreateAddress = async (data) => {
    try {
      await createCustomerAddress(currentId, data);
      setVisibleAddressList(false);
      // refresh list
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
    } catch (err) {
      console.log(err);
    }
  }

  const onDeleteAddress = (id) => {
    Modal.confirm({
      title: 'Warning',
      content: 'Are you sure to delete this record?',
      onOk: async () => {
        try {
          await deleteCustomerAddress(currentId, id);
          setAddresses((prevState) => {
            return prevState.filter((item) => item.id !== id);
          });
          // refresh list
          navigate({
            pathname: location.pathname,
            search: stringifyQueryParams({}),
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
  };


  const onToggleCreateForm = () => {
    setVisibleCreateForm(!visibleCreateForm);
  };

  const onToggleUpdateForm = () => {
    setVisibleUpdateForm(!visibleUpdateForm);
  };
  const onToggleAddressLits = (data) => {
    setAddresses(data ? data : []);
    setVisibleAddressList(!visibleAddressList);
  };

  const onSearch = (keyword) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: 1,
      keyword: keyword
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query)
    });
  }

  const onRefresh = () => {
    let query = parseQueryParams(location);
    query = {
      page: 1,
      keyword: query.keyword
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query)
    });
  };

  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]);


  const onChangeTable = (pagination) => {
    console.log(pagination)

    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query)
    });
  }
  return (
    <div>
      <PageTitle titles={titles} />
      <TableBar onSearch={onSearch} showFilter={false} />
      <CurrenViewing onRefresh={onRefresh} />

      <div className="mt-36">
        <Spin spinning={isTableLoading}>
          <Table
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
      </div>

      <CustomerCreateForm visible={visibleCreateForm} onClose={onToggleCreateForm} onSubmit={onCreatCustomer} />
      <CustomerAddressList
        visible={visibleAddressList}
        onClose={onToggleAddressLits}
        data={addresses}
        onDelete={onDeleteAddress}
        onCreate={onCreateAddress}
      />
      <CustomerUpdateForm visible={visibleUpdateForm} onClose={onToggleUpdateForm} onSubmit={onUpdateCustomer} record={currentRecord} />

    </div>
  );
};

export default Customer;
