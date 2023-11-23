import React, { Component } from "react";
import axios from "@/api";
import { API } from "@/api/config";
import process_response from "@/utils/response";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import { message, Table, Button, Divider, Modal, Input, Select } from "antd";

import "./index.scss";

const { confirm } = Modal;
const { Option } = Select;

class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
      data: [],
      visible: false,
      user: {
        name: "",
        email: "",
        institution: "SYD"
      }
    };
  }

  componentDidMount() {
    axios
      .get(`${API}/user/get-user-info`, {})
      .then(res => {
        this.setState({
          data: res.data.users
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  }

  handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    });
  };

  delete_user = record => {
    console.log(record);
    confirm({
      title: `Do you want to delete the user: ${record.name} ?`,
      content: "When clicked the OK button, the user will be deleted",
      onOk() {
        const formData = new FormData();
        formData.append("name", record.name);
        axios
          .post(`${API}/user/delete`, formData, {})
          .then(res => {
            console.log(res.data);
            message.success(res.data.message);
            let { data } = this.state;
            data.filter(item => {
              return item.name !== record.name;
            });
            this.setState({
              data: data
            });
          })
          .catch(error => {
            console.log(error);
            process_response(error, error.response.data.message);
          });
      },
      onCancel() {}
    });
  };

  update_user_info = record => {
    console.log(record);

    if (
      record.name === null ||
      record.email === null ||
      record.institution === null
    ) {
      message.error("User information incomplete!");
      return;
    }

    const formData = new FormData();
    formData.append("name", record.name);
    formData.append("email", record.email);
    formData.append("institution", record.institution);

    axios
      .put(`${API}/user/edit`, formData, {})
      .then(res => {
        message.success(res.data.message);
        this.setState({
          visible: false
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    let { data } = this.state;
    data.forEach(item => {
      if (item.name === record.name) {
        item.email = record.email;
      }
    });

    this.setState({
      data: data
    });
  };

  edit_user = record => {
    console.log(record);
    Modal.info({
      title: "Edit User Information",
      content: (
        <div>
          <div style={{ marginTop: "2%" }}>
            <div>Name: </div>
            <Input
              defaultValue={record.name}
              placeholder={"Student Name"}
              onChange={value => {
                record.name = value.currentTarget.value;
              }}
              disabled
            />
          </div>
          <div style={{ marginTop: "3%" }}>
            <div>Email: </div>
            <Input
              defaultValue={record.email}
              placeholder={"Student Email"}
              onChange={value => {
                record.email = value.currentTarget.value;
              }}
            />
          </div>
          <div style={{ marginTop: "3%" }}>
            <div>Institution</div>
            <Input
              defaultValue={record.institution}
              placeholder={"Institution"}
              disabled={true}
            />
          </div>
          <Button
            type={"primary"}
            style={{ marginTop: "2%", textAlign: "center", width: "100%" }}
            onClick={this.update_user_info.bind(this, record)}
          >
            Update
          </Button>
        </div>
      ),
      okText: "Cancel"
    });
  };

  add_user = () => {
    this.setState({
      visible: true
    });
  };

  confirm_add_user = e => {
    const { user } = this.state;

    if (user.name === "" || user.email === "" || user.institution === "") {
      message.error("User information incomplete!");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("institution", user.institution);

    axios
      .post(`${API}/user/edit`, formData, {})
      .then(res => {
        message.success(res.data.message);
        this.setState({
          visible: false
        });
        Modal.destroyAll();
        let { data } = this.state;
        data.push(user);
        this.setState({
          data: data
        });

        // clear
        let temp = {
          name: "",
          email: "",
          institution: "SYD"
        };

        this.setState({
          user: temp
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  institution_change = value => {
    let user = this.state.user;
    user.institution = value;

    this.setState({
      user: user
    });
  };

  email_change = value => {
    let user = this.state.user;
    user.email = value.target.value;
    this.setState({
      user: user
    });
  };

  name_change = value => {
    let user = this.state.user;
    user.name = value.target.value;
    this.setState({
      user: user
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        ellipsis: true
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Institution",
        dataIndex: "institution",
        key: "institution",
        filters: [
          { text: "SYD", value: "SYD" },
          { text: "ZJ", value: "ZJ" },
          { text: "GZ", value: "GZ" },
          { text: "SH", value: "SH" }
        ],
        filteredValue: filteredInfo.institution || null,
        onFilter: (value, record) => record.institution.includes(value),
        sorter: (a, b) => a.institution.length - b.institution.length,
        sortOrder: sortedInfo.columnKey === "institution" && sortedInfo.order,
        ellipsis: true
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Button
              onClick={this.delete_user.bind(this, record)}
              type="danger"
              icon="delete"
              size="small"
            >
              Delete
            </Button>

            <Divider type="vertical" />

            <Button
              onClick={this.edit_user.bind(this, record)}
              type="primary"
              icon="edit"
              size="small"
            >
              Edit
            </Button>
          </span>
        )
      }
    ];

    return (
      <div>
        <CustomBreadcrumb arr={["manage"]} />
        <Modal
          title="Add User"
          visible={this.state.visible}
          onOk={this.confirm_add_user}
          onCancel={this.handleCancel}
        >
          <Input
            className="add-user"
            value={this.state.user.name}
            placeholder="Student Name"
            onChange={this.name_change}
          />
          <Input
            className="add-user"
            value={this.state.user.email}
            placeholder="Student Email"
            onChange={this.email_change}
          />
          <Select
            className="add-user"
            defaultValue="SYD"
            onChange={this.institution_change}
          >
            <Option value="SYD">SYD</Option>
            <Option value="ZJ">ZJ</Option>
            <Option value="SH">SH</Option>
            <Option value="GZ">GZ</Option>
          </Select>
        </Modal>

        <div style={{ margin: "3%" }}>
          <div className="table-operations">
            <Button onClick={this.add_user}>Add</Button>
            <Button onClick={this.clearAll}>Clear filters</Button>
          </div>
          <Table
            columns={columns}
            dataSource={this.state.data}
            onChange={this.handleChange}
            pagination={{ pageSize: 100 }}
            scroll={{ y: 540 }}
          />
        </div>
      </div>
    );
  }
}

export default Manage;
