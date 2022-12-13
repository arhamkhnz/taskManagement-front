import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  message,
} from "antd";
import { TableComponent } from "./Common/Table";
import userService from "../services/userService";
const { Content } = Layout;
const { Option } = Select;

export default function BodyComponent() {
  const [form] = Form.useForm();
  const [dataChange, setDataChange] = useState(false);
  const [taskLIst, setTaskList] = useState([]);
  const [showFormModel, setShowFormModel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listTasks();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const add = await userService.addTask(values);
    console.log(add);
    if (add.data.success === true) {
      message.success("Task Added Successfully");
      onClose();
      setLoading(false);
      setDataChange(!false);
      listTasks()
    } else {
      message.info("Error Occured Please Try Again");
      setLoading(false);
    }
  };

  const listTasks = async () => {
    setLoading(true);
    const detail = await userService.listTasks();
    console.log(detail);
    setTaskList(detail.data.data);
    setLoading(false);
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
  };

  return (
    <>
      <div style={{ margin: "1%"}}>
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
          <TableComponent dataChange={dataChange} />
        </Content>

        <div>
          <Modal
            title={"Add Task"}
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
                      Add
                    </Button>
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
