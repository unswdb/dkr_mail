import React, { Component } from "react";

import axios from "@/api";
import { API } from "@/api/config";
import { Modal, Button, Select, Upload, Icon, message } from "antd";
import process_response from "@/utils/response";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";

import "./index.scss";
import { Column } from "@ant-design/plots";

const { Option } = Select;
const { Dragger } = Upload;

class Marking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      users: [],
      options: [],
      files: [],
      student: "",
      MainProps: {
        listType: "picture",
        defaultFileList: [],
        multiple: true,
        onRemove: file => {
          this.setState(state => {
            const index = state.files.indexOf(file);
            const newFileList = state.files.slice();
            newFileList.splice(index, 1);
            return {
              files: newFileList
            };
          });
        },
        beforeUpload: file => {
          this.setState(state => ({
            files: [...state.files, file]
          }));
          return false;
        }
        // fileList
      },

      config: {
        data: [],
        xField: "name",
        yField: "score",
        label: {
          // 可手动配置 label 数据标签位置
          position: "middle",
          // 'top', 'bottom', 'middle',
          // 配置样式
          style: {
            fill: "#FFFFFF",
            opacity: 0.6
          }
        },
        xAxis: {
          label: {
            autoHide: false,
            autoRotate: true
          }
        },
        meta: {
          name: {
            alias: "name"
          },
          number: {
            alias: "score"
          }
        }
      }
    };
  }

  componentDidMount() {
    axios
      .get(`${API}/user/get-user-info`, {})
      .then(res => {
        this.setState({
          users: res.data.users
        });

        let options = [];

        res.data.users.forEach(user => {
          options.push(<Option key={user.name}>{user.name}</Option>);
        });
        this.setState({
          options: options
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });

    this.showScore();
  }

  showScore = () => {
    axios
      .get(`${API}/user/marking`, {})
      .then(res => {
        let temp = [];
        res.data.data.forEach(c => {
          temp.push({
            name: c.name,
            score: Math.round(c.score * 100) / 100
          });
        });

        let config = { ...this.state.config };
        config.data = temp;
        this.setState({
          config: config
        });
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  selectStudent = val => {
    this.setState({
      student: val
    });
  };

  submitMarking = () => {
    let { student, files } = this.state;

    if (student === null || student === "") {
      message.error("You need to select student");
      return;
    }

    if (files.length === 0) {
      message.error("You need upload at least one file");
      return;
    }
    const formData = new FormData();
    formData.append("name", student);
    files.forEach(file => {
      formData.append("file", file);
    });

    axios
      .post(`${API}/user/marking`, formData, {})
      .then(res => {
        message.success("Upload Success");
        let { MainProps } = this.state;
        MainProps.defaultFileList = [];
        this.setState({
          MainProps: MainProps
        });
        this.setState({
          student: "",
          files: []
        });
      })
      .catch(function(error) {
        process_response(error, "Error");
      });
  };

  render() {
    const { MainProps } = this.state;

    return (
      <div>
        <CustomBreadcrumb arr={["manage"]} />

        <Modal
          title="Upload Marking"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[]}
        >
          <div>Name: </div>
          <Select
            showSearch
            placeholder={"Student Name"}
            value={this.state.student}
            onChange={this.selectStudent}
            style={{ width: "100%" }}
          >
            {this.state.options}
          </Select>
          <div style={{ marginTop: "3%" }}>
            <div>File: </div>
            <div>
              <Dragger {...MainProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Dragger>
            </div>
          </div>

          <div style={{ marginTop: "3%" }}>
            <Button style={{ width: "100%" }} onClick={this.submitMarking}>
              Submit
            </Button>
          </div>
        </Modal>

        <div style={{ margin: "3%" }}>
          <div className="table-operations">
            <Button onClick={this.showModal}>Upload Marking</Button>
          </div>
        </div>

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
          <Column {...this.state.config} style={{ marginTop: "5%" }} />
        </div>
      </div>
    );
  }
}

export default Marking;
