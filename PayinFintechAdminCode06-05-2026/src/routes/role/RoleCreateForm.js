import { useSelector } from "react-redux";
import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Typography, Form, Input, Select } from "antd";

const { Title } = Typography;

const RoleCreateForm = (props) => {
  const { visible, onClose, onSubmit } = props;

  const [loading, setLoading] = useState(false);

  const config = useSelector((state) => state.config);

  const [formRef] = Form.useForm();

  const typeOptions = config.role_types.map((item) => {
    return { label: item.display, value: item.value };
  });

  const onSubmitData = () => {
    formRef.validateFields().then(async (data) => {
      try {
        setLoading(true);

        await onSubmit(data);
        // close modal
        onCancel();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    });
  };

  const onCancel = () => {
    // clear form
    formRef.resetFields();

    onClose();
  };

  return (
    <Modal
      title={'Create new role'}
      visible={visible}
      closable={false}
      onCancel={onCancel}
      onOk={onSubmitData}
      okButtonProps={{
        loading: loading,
      }}
      okText="Submit"
    >
      {/* <Title level={4}>Create new role</Title> */}
      <Form layout="vertical" form={formRef}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true }]}
          className="mb-0"
        >
          <Select options={typeOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

RoleCreateForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RoleCreateForm;
