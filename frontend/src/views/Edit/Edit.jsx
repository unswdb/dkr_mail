import React, { Component } from "react";

import axios from "@/api";
import { API } from "@/api/config";
import process_response from "@/utils/response";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import { message, Table, Button, Modal, Input, Select } from "antd";

const { Option } = Select;

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: [],
      nnext: [],
      users: []
    };
  }

  componentDidMount() {
    axios
      .get(`${API}/user/next`, {})
      .then(res => {
        this.setState({
          next: res.data.data
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    axios
      .get(`${API}/user/nnext`, {})
      .then(res => {
        this.setState({
          nnext: res.data.data
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    axios
      .get(`${API}/user/get-user-info`, {})
      .then(res => {
        this.setState({
          users: res.data.users
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  }

  update_next = record => {
    let email = this.state.users.filter(item => item.name === record.name);
    record.email = email[0]["email"];

    console.log(record);

    const formData = new FormData();
    formData.append("name", record.name);
    formData.append("email", record.email);
    formData.append("institution", record.institution);

    axios
      .put(`${API}/user/next`, formData, {})
      .then(res => {
        message.success(res.data.message);
        this.setState({
          visible: false
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    let { next } = this.state;
    next.forEach(item => {
      if (item.institution === record.institution) {
        item.email = record.email;
        item.name = record.name;
      }
    });

    this.setState({
      next: next
    });
  };

  update_nnext = record => {
    let email = this.state.users.filter(item => item.name === record.name);
    record.email = email[0]["email"];

    const formData = new FormData();
    formData.append("name", record.name);
    formData.append("email", record.email);
    formData.append("institution", record.institution);

    axios
      .put(`${API}/user/nnext`, formData, {})
      .then(res => {
        message.success(res.data.message);
        this.setState({
          visible: false
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    let { nnext } = this.state;
    nnext.forEach(item => {
      if (item.institution === record.institution) {
        item.email = record.email;
        item.name = record.name;
      }
    });

    this.setState({
      nnext: nnext
    });
  };

  get_options = institution => {
    const { users } = this.state;
    let options = [];

    users.forEach(user => {
      if (user.institution === institution) {
        options.push(<Option key={user.name}>{user.name}</Option>);
      }
    });
    return options;
  };

  edit_next = record => {
    const options = this.get_options(record.institution);
    console.log(record);
    Modal.info({
      title: "Edit Next Week Presenter",
      content: (
        <div>
          <div style={{ marginTop: "2%" }}>
            <div>Name: </div>
            <Select
              showSearch
              defaultValue={record.name}
              placeholder={"Student Name"}
              onChange={value => {
                record.name = value;
              }}
              style={{ width: "100%" }}
            >
              {options}
            </Select>
          </div>
          <div style={{ marginTop: "3%" }}>
            <div>Institution</div>
            <Input
              defaultValue={record.institution}
              placeholder={"Institution"}
              disabled
            />
          </div>
          <Button
            type={"primary"}
            style={{ marginTop: "2%", textAlign: "center", width: "100%" }}
            onClick={this.update_next.bind(this, record)}
          >
            Update
          </Button>
        </div>
      ),
      okText: "Cancel"
    });
  };

  edit_nnext = record => {
    const options = this.get_options(record.institution);
    console.log(record);
    Modal.info({
      title: "Edit Next Week Presenter",
      content: (
        <div>
          <div style={{ marginTop: "2%" }}>
            <div>Name: </div>
            <Select
              showSearch
              defaultValue={record.name}
              placeholder={"Student Name"}
              onChange={value => {
                record.name = value;
              }}
              style={{ width: "100%" }}
            >
              {options}
            </Select>
          </div>
          <div style={{ marginTop: "3%" }}>
            <div>Institution</div>
            <Input
              defaultValue={record.institution}
              placeholder={"Institution"}
              disabled
            />
          </div>
          <Button
            type={"primary"}
            style={{ marginTop: "2%", textAlign: "center", width: "100%" }}
            onClick={this.update_nnext.bind(this, record)}
          >
            Update
          </Button>
        </div>
      ),
      okText: "Cancel"
    });
  };

  render() {
    const columns1 = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Institution",
        dataIndex: "institution",
        key: "institution"
      },
      {
        title: "Date",
        dataIndex: "present",
        key: "present"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Button
              onClick={this.edit_next.bind(this, record)}
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

    const columns2 = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Institution",
        dataIndex: "institution",
        key: "institution"
      },
      {
        title: "Date",
        dataIndex: "present",
        key: "present"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Button
              onClick={this.edit_nnext.bind(this, record)}
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
        <div style={{ margin: "3%" }}>
          <div>
            <h3 style={{ marginBottom: "2%" }}>Next Week</h3>
            <Table
              columns={columns1}
              dataSource={this.state.next}
              pagination={{ pageSize: 100 }}
              scroll={{ y: 340 }}
            />
          </div>

          <div style={{ marginTop: "5%" }}>
            <h3 style={{ marginBottom: "2%" }}>Next Next Week</h3>
            <Table
              columns={columns2}
              dataSource={this.state.nnext}
              pagination={{ pageSize: 100 }}
              scroll={{ y: 340 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;
