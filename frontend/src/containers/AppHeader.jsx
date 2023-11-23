import React from "react";
import PropTypes from "prop-types";
import { Icon, Layout, Badge, Row, Col } from "antd";

const { Header } = Layout;

const AppHeader = props => {
  let { menuClick, menuToggle, loginOut } = props;

  return (
    <Header className="header">
      <Row style={{ width: "100%" }}>
        <Col span={2}>
          <div className="left">
            <Icon
              style={{ fontSize: "2rem" }}
              onClick={menuClick}
              type={menuToggle ? "menu-unfold" : "menu-fold"}
            />
          </div>
        </Col>

        {/* right part */}
        <Col span={20} />
        <Col span={2}>
          <div className="right">
            <div className="mr15" style={{ marginRight: "0.5em" }}>
              <Badge dot={true} offset={[-2, 0]}>
                <Icon type="logout" onClick={loginOut} />
              </Badge>
            </div>
          </div>
        </Col>
      </Row>
    </Header>
  );
};

AppHeader.propTypes = {
  menuClick: PropTypes.func,
  avatar: PropTypes.string,
  menuToggle: PropTypes.bool,
  loginOut: PropTypes.func
};

export default React.memo(AppHeader);
