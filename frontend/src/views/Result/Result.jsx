import React, { Component } from "react";
import { Column } from "@ant-design/plots";
import axios from "@/api";
import { API } from "@/api/config";
import process_response from "@/utils/response";
import CustomBreadcrumb from "@/components/CustomBreadcrumb/CustomBreadcrumb";
import "./index.scss";

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        data: [],
        xField: "name",
        yField: "number",
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
            alias: "number"
          }
        }
      }
    };
  }

  componentDidMount() {
    axios
      .get(`${API}/user/history`, {})
      .then(res => {
        let temp = [];
        res.data.data.forEach(c => {
          temp.push({
            name: c.name,
            number: c.number
          });
        });

        let config = { ...this.state.config };
        config.data = temp;
        this.setState({
          config: config
        });

        console.log(this.state.config);
      })
      .catch(function(error) {
        process_response(error, error.response.data.message);
      });
  }

  render() {
    // const {config} = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={["result"]} />
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

export default Result;
