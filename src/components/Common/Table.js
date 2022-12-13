import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Spin,
  Row,
  Button,
  Modal,
  message,
  Form,
  Select,
  Input,
  Collapse,
  List,
} from "antd";
import userService from "../../services/userService";
const { Option } = Select;
const { Panel } = Collapse;

export const TableComponent = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [taskLIst, setTaskList] = useState([]);
  const [childTaskList, setChildTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  useEffect(() => {
    listTasks();
  }, [props.dataChange]);

  const listTasks = async () => {
    setLoading(true);
    const detail = await userService.listTasks();
    console.log(detail);
    setData(detail.data.data.reverse());
    setTaskList(detail.data.data);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: detail.data.data.length,
      },
    });
    setLoading(false);
  };

  const getTaskDetailById = async (id) => {
    setLoading(true);
    setCurrentTask(id);
    getChildTasks(id)
    // Filter Task List to POP current task from Parent Task dropdown
    const filterData = taskLIst.filter((ele) => ele._id !== id);
    setTaskList(filterData);
    setShowEditForm(true);
    const rawData = await userService.getTaskDetailById(id);
    const data = rawData.data.data;
    form.setFieldsValue({
      name: data.name,
      parentId: data.parentId,
      status: data.status,
    });
    setLoading(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const deleteTask = async (id) => {
    setLoading(true);
    const detail = await userService.deleteTask(id);
    if (detail.data.success === true) {
      listTasks();
      message.success("Task Deleted Successfully");
    } else {
      message.info("Error Occured Please Try Again");
    }
    console.log(detail);
    setLoading(false);
  };

  const confirmModal = (id) => {
    Modal.confirm({
      content: "Are you sure..?",
      okText: "Delete",
      onOk: async () => {
        await deleteTask(id);
      },
    });
  };

  const onClose = () => {
    form.resetFields();
    setCurrentTask(null);
    setShowEditForm(false);
  };

  const getChildTasks = async (id) => {
    const rawChildData = await userService.getChildTasksById(id);
    const detail = rawChildData.data.data;
    setChildTaskList(detail);
  }

  const onFinish = async (values) => {
    setLoading(true);
    console.log(values);
    const update = await userService.updateTask(currentTask, values);
    console.log(update);
    if (update.data.success === true) {
      message.success("Task Updated Successfully");
      onClose();
      setLoading(false);
      listTasks();
    } else {
      message.info("Error Occured Please Try Again");
      setLoading(false);
      onClose();
    }
    listTasks()
  };

  const markComplete = async (id, status) => {
    const data = {status: status}
    const rawData = await userService.updateStatus(id, data)
    console.log(rawData)
    if (currentTask !== null) getChildTasks(currentTask)
    listTasks()
  }

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
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
            <Button
              size="small"
              style={{ margin: "1px" }}
              type="dashed"
              onClick={() => getTaskDetailById(record)}
            >
              {"Edit / View Child Tasks"}
            </Button>
            <Button
              size="small"
              style={{ margin: "1px" }}
              type="primary"
              onClick={() => markComplete(record, 'Completed')}
            >
              {"Mark as Complete"}
            </Button>
            {/* <Button
              size="small"
              onClick={() => confirmModal(record)}
              style={{ margin: "1px" }}
              type="primary"
              danger
            >
              {"Delete"}
            </Button> */}
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
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

      <div>
        <Modal
          title={"Edit Task"}
          open={showEditForm}
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
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="parentId"
                label="Parent Task"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select>
                  {taskLIst &&
                    taskLIst.length > 0 &&
                    taskLIst.map((el) => (
                      <Option value={el._id}>{el.name}</Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ margin: "1px" }}
                  type="primary"
                  htmlType="submit"
                >
                  Update
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
            <Collapse accordion>
              <Panel extra={`Total: ${childTaskList.length}`} header="Child Tasks" key="1">
                <List
                  size="small"
                  bordered
                  dataSource={childTaskList}
                  renderItem={(item) => (
                    <List.Item key={item}>
                      <List.Item.Meta
                        title={item.name}
                        description={item.status}
                      />
                      <div>
                        <Button disabled={item.status == 'Completed'} onClick={() => markComplete(item._id, 'Completed')} type="primary" size="small">
                          Mark as Complete
                        </Button>
                      </div>
                    </List.Item>
                  )}
                />
              </Panel>
            </Collapse>
          </Spin>
        </Modal>
      </div>
    </>
  );
};
