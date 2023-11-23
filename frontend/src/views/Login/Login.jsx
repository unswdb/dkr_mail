import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "@/api";
import { API } from "@/api/config";
import process_response from "@/utils/response";
import { Layout, Input, Icon, Form, Button, Divider } from "antd";

import "@/style/view-style/login.scss";

class Login extends Component {
  state = {
    loading: false,
    visible: false,
    modalLoading: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { username, password } = values;
        axios
          .post(`${API}/user/login`, { username, password })
          .then(res => {
            localStorage.clear();
            localStorage.setItem("token", res.data.token);
            setTimeout(() => {
              window.location.href = "/";
            }, 200);
          })
          .catch(error => {
            process_response(error, "");
          });
      }
    });
  };

  check_password = (rule, value, callback) => {
    let p1 = this.props.form.getFieldValue("fpassword1");
    let p2 = this.props.form.getFieldValue("fpassword2");

    // console.log(p1, p2);
    if (p1 !== p2) {
      callback(new Error("Password not same"));
    } else {
      callback();
    }
  };

  componentDidMount() {
    window.localStorage.clear();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout className="login animated fadeIn">
        {/* 登陆的div */}
        <div className="model">
          <div className="login-form">
            <h3>DKRMS Login</h3>
            <Divider />
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator("username", {
                  rules: [{ required: true, message: "Username" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Username"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "Password" }]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="Password"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={this.state.loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withRouter(Form.create()(Login));
