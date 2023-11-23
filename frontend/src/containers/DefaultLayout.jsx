import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, BackTop, message } from "antd";
import routes from "../routes";
import { menuToggleAction } from "../store/actionCreators";
import menu from "./menu";
import "@/style/layout.scss";

import AppHeader from "./AppHeader.jsx";
import AppAside from "./AppAside.jsx";
import AppFooter from "./AppFooter.jsx";

const { Content } = Layout;

class DefaultLayout extends Component {
  state = {
    show: true,
    menu: []
  };

  isLogin = () => {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
  };

  loginOut = () => {
    window.localStorage.clear();
    this.props.history.push("/login");
    message.success("Logout!");
  };

  componentDidMount() {
    this.setState({
      menu: menu
    });

    this.isLogin();
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    let { menuClick, menuToggle } = this.props;
    return (
      <Layout className="app">
        <BackTop />
        <AppAside menuToggle={menuToggle} menu={this.state.menu} />
        <Layout
          style={{
            marginLeft: menuToggle ? "80px" : "200px",
            minHeight: "100vh"
          }}
        >
          <AppHeader
            menuToggle={menuToggle}
            menuClick={menuClick}
            avatar={this.state.avatar}
            show={this.state.show}
            loginOut={this.loginOut}
          />
          <Content className="content">
            <Switch>
              {routes.map(item => {
                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    exact={item.exact}
                    render={props => <item.component {...props} />}
                  />
                );
              })}
              <Redirect to="/404" />
            </Switch>
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    );
  }
}

const stateToProp = state => ({
  menuToggle: state.menuToggle
});

const dispatchToProp = dispatch => ({
  menuClick() {
    dispatch(menuToggleAction());
  }
});

export default withRouter(connect(stateToProp, dispatchToProp)(DefaultLayout));
