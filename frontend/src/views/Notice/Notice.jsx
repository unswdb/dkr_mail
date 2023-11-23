import React, { Component } from "react";
import axios from "@/api";
import { API } from "@/api/config";
import process_response from "@/utils/response";
import { Select, Form, Button, message } from "antd";
import CustomBreadcrumb from "@/components/CustomBreadcrumb/CustomBreadcrumb";

const { Option } = Select;

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      current: []
    };
  }

  componentDidMount() {
    // fetch the user list for xx
    axios
      .get(`${API}/user/get-user`, {})
      .then(res => {
        let temp = [];
        res.data.names.forEach(name => {
          temp.push(<Option key={name}>{name}</Option>);
        });
        this.setState({
          children: temp
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    axios
      .get(`${API}/user/current`, {})
      .then(res => {
        this.setState({
          current: res.data.names
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  }

  handleSizeChange = val => {
    this.setState({
      current: val
    });
  };

  sendMail = () => {
    // TODO send mail api
    const formData = new FormData();
    formData.append("student", this.state.current.join(","));

    axios
      .post(`${API}/user/notice`, formData, {})
      .then(res => {
        message.success(res.data.message);
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  };

  render() {
    const { current, children } = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={["send notice"]} />
        <div
          style={{
            width: "90%",
            marginTop: "5%",
            margin: "auto",
            top: 2,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <Select
            mode="multiple"
            placeholder="Please select"
            value={current}
            size={"large"}
            onChange={this.handleSizeChange}
            style={{ width: "50%", marginLeft: "15%" }}
          >
            {children}
          </Select>

          <div style={{ marginLeft: "15%", marginTop: "2%" }}>
            <Button type={"primary"} onClick={this.sendMail}>
              {" "}
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(Notice);
