import React, { useState, useEffect } from "react";
import { Table, Card, Spin, Row, Button, Modal, message } from "antd";
import userService from "../../services/userService";

export const TableComponent = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const detail = await userService.getTaskDetailById(id);
    console.log(detail);
    // const data = detail.data.data;
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
      okText: 'Delete',
      onOk: async () => {
        await deleteTask(id);
      },
    });
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
              style={{ margin: "1px" }}
              type="primary"
              //   onClick={() => showEditModal(record)}
            >
              {"Edit"}
            </Button>
            <Button
              onClick={() => confirmModal(record)}
              style={{ margin: "1px" }}
              type="primary"
              danger
            >
              {"Delete"}
            </Button>
          </Row>
        </>
      ),
    },
  ];

  return (
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
  );
};
