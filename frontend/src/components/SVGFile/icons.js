import React from "react";
import {
  MailOutlined,
  SettingOutlined,
  NumberOutlined,
  NotificationOutlined,
  EditOutlined,
  LineChartOutlined
} from "@ant-design/icons";

const mail = () => <MailOutlined />;

const notice = () => <NotificationOutlined />;

const result = () => <NumberOutlined />;

const manage = () => <SettingOutlined />;

const edit = () => <EditOutlined />;

const marking = () => <LineChartOutlined />;

const icons = {
  mail: mail,
  result: result,
  notice: notice,
  manage: manage,
  edit: edit,
  marking: marking
};

export default icons;
