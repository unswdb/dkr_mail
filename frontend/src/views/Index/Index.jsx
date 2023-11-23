import React, { Component } from "react";

import axios from "@/api";
import moment from "moment";
import { API } from "@/api/config";
import "@/style/view-style/index.scss";
import process_response from "@/utils/response";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import { Button, Form, message, Select, DatePicker } from "antd";

import "./index.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = "MM/DD/YYYY";

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      date: [],
      next_student: [],
      range_date: []
    };
  }

  componentDidMount() {
    // avoid error
    axios.get(`${API}/user/get-user`, {});
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
      .get(`${API}/user/nnext`, {})
      .then(res => {
        let temp = [];
        let temp_date = "";
        res.data.data.forEach(item => {
          temp.push(item.name);
          temp_date = item.present;
        });

        let next_date = res.data.next;
        let drange = [
          moment(next_date, dateFormat),
          moment(temp_date, dateFormat)
        ];

        this.setState({
          next_student: temp,
          range_date: drange,
          date: [next_date, temp_date]
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);

        const formData = new FormData();
        formData.append("nstudents", values.next.join(","));
        formData.append("nnstudents", values.nnext.join(","));
        formData.append("ndate", this.state.date[0]);
        formData.append("nndate", this.state.date[1]);

        axios
          .post(`${API}/user/send`, formData, {})
          .then(res => {
            message.success(res.data.message);
          })
          .catch(function(error) {
            process_response(error, error.response.data.message);
          });
      }
    });
  };
  onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  dateChange = (date, dateString) => {
    this.setState({
      date: dateString
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children } = this.state;
    return (
      <div className="content">
        <div>
          <CustomBreadcrumb arr={["mail"]} />
        </div>

        <Form
          name="basic"
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 16
          }}
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="Next Week" name="next">
            {getFieldDecorator("next", {
              rules: [
                {
                  required: true,
                  message: "Please select next week presenters"
                }
              ],
              initialValue: this.state.next_student
            })(
              <Select
                mode="multiple"
                placeholder="Please select next week presenters"
                onChange={this.handleChange}
                style={{
                  width: "450px"
                }}
              >
                {children}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Next Next Week" name="nnext">
            {getFieldDecorator("nnext", {
              rules: [
                {
                  required: true,
                  message: "Please select next next week presenters"
                }
              ]
            })(
              <Select
                mode="multiple"
                placeholder="Please select next next week presenters"
                onChange={this.handleChange}
                style={{
                  width: "450px"
                }}
              >
                {children}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Present Date" name="time">
            {/* can use initialValue */}
            {getFieldDecorator("time", {
              rules: [
                { required: true, message: "Please select present date" }
              ],
              initialValue: this.state.range_date
            })(
              <RangePicker
                format={"MM/DD/YYYY"}
                style={{
                  width: "450px"
                }}
                onChange={this.dateChange}
              />
            )}
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Index);
