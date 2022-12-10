import React, { useState, useEffect } from "react";
import {
  Table,
  Layout,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  message,
  Row,
} from "antd";
import userService from "../services/userService";
const { Content } = Layout;
const { Option } = Select;

export default function BodyComponent() {
  const [form] = Form.useForm();
  const [showFormModel, setShowFormModel] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  useEffect(() => {
    listTasks();
  }, []);

  const listTasks = async () => {
    setLoading(true);
    const detail = await userService.listTasks();
    console.log(detail);
    setData(detail.data.data.reverse());
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: detail.data.data.length,
      },
    });
    setLoading(false);
  };

  const showEditModal = (id) => {
    getTaskDetailById(id);
    setIsEditModal(true);
    setShowFormModel(true);
  };

  const getTaskDetailById = async (id) => {
    const detail = await userService.getTaskDetailById(id);
    console.log(detail);
    const data = detail.data.data;
    setEditData(data);
    form.setFieldsValue({ name: data.name, status: data.status });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      width: "8%",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "12%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
    },
    {
      title: "ParentId",
      dataIndex: "parentId",
      width: "15%",
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: "10%",
      render: (record) => (
        <>
          <Row>
            <Button style={{margin: '1px'}} type="primary" onClick={() => showEditModal(record)}>
              {"Edit"}
            </Button>
            <Button style={{margin: '1px'}} type="primary" danger>
              {"Delete"}
            </Button>
          </Row>
        </>
      ),
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    const add = await userService.addTask(values);
    console.log(add);
    if (add.data.success === true) {
      message.success("Task Added Successfully");
      onClose();
      setLoading(false);
      listTasks();
    } else {
      message.info("Error Occured Please Try Again");
      setLoading(false);
    }
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const onReset = () => {
    form.resetFields();
  };

  const onClose = () => {
    form.resetFields();
    setShowFormModel(false);
    setIsEditModal(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <>
      <div style={{ margin: "1%" }}>
        <Content>
          <div className="d-flex Justify-content-end">
            <Button
              onClick={() => setShowFormModel(true)}
              type="primary"
              style={{ marginBottom: "5px" }}
            >
              Add Task
            </Button>
          </div>
          <Spin spinning={loading} tip="Please Wait">
            <Card style={{ width: "auto" }}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
              />
            </Card>
          </Spin>
        </Content>

        <div>
          <Modal
            title={isEditModal ? "Edit Task" : "Add Task"}
            open={showFormModel}
            footer={null}
            closable={false}
          >
            <Spin spinning={loading} tip="Please Wait">
              <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
              >
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {isEditModal && (
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                  >
                    <Select onChange={"onGenderChange"} allowClear>
                      <Option value="In Progress">In Progress</Option>
                      <Option value="Done">Done</Option>
                    </Select>
                  </Form.Item>
                )}
                <Form.Item
                  name="parentId"
                  label="Parent Task"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Select
                    placeholder="Optional"
                    onChange={"onGenderChange"}
                    allowClear
                  >
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  {!isEditModal && (
                    <Button
                      style={{ margin: "1px" }}
                      type="primary"
                      htmlType="submit"
                    >
                      Add
                    </Button>
                  )}
                  {isEditModal && (
                    <Button
                      style={{ margin: "1px" }}
                      type="primary"
                      htmlType="submit"
                    >
                      Update
                    </Button>
                  )}
                  <Button
                    style={{ margin: "1px" }}
                    htmlType="button"
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    danger
                    style={{ margin: "1px" }}
                    htmlType="button"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </div>
      </div>
    </>
  );
}
