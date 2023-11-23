"use strict";(self.webpackChunkflink_demo=self.webpackChunkflink_demo||[]).push([[535],{3014:function(e,s,r){r.d(s,{b:function(){return a}});var a="http://unswdb.com:5000"},29396:function(e,s,r){var a=r(18489),t=r(74569),o=r.n(t),n=localStorage.getItem("token"),c=o().create({timeout:1e5,headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}});function i(){var e=new Date,s=Date.UTC(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds());return new Date(s).getTime()}c.interceptors.request.use((function(e){return n&&(e.headers.Authorization=n),e.params=(0,a.Z)({timestamp:i()},e.params),e}),(function(e){return Promise.reject(e)})),c.interceptors.response.use((function(e){return 200===e.status?Promise.resolve(e):Promise.reject(e)}),(function(e){switch(e.response.status){case 400:e.response.message=e.response.data.message;break;case 401:e.response.message="Unauthorized(401)";break;case 403:e.response.message="Access Denied(403)";break;case 404:e.response.message="Request Error(404)";break;case 408:e.response.message="Request Timeout(408)";break;case 500:e.response.message="Server Error(500)";break;case 501:e.response.message="Service Not Implemented(501)";break;case 502:e.response.message="Network Error(502)";break;case 503:e.response.message="Service is not available(503)";break;case 504:e.response.message="Timeout(504)";break;case 505:e.response.message="HTTP does not support(505)";break;default:e.response.message="Connect error(".concat(e.response.status,")!")}return Promise.reject(e)})),s.Z=c},62308:function(e,s,r){r(90224);var a=r(74649),t=void 0;s.Z=function(e){var s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;try{switch("Network Error"===e.response.message&&a.Z.error("\u8bf7\u6c42\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5!"),e.response.status){case 400:s=e.response.data.message;break;case 401:s="\u672a\u6388\u6743\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55(401)",t.props.history.push("/login");break;case 403:s="\u62d2\u7edd\u8bbf\u95ee(403)";break;case 404:s="\u8bf7\u6c42\u51fa\u9519(404)";break;case 408:s="\u8bf7\u6c42\u8d85\u65f6(408)";break;case 500:s="\u670d\u52a1\u5668\u9519\u8bef(500)";break;case 501:s="\u670d\u52a1\u672a\u5b9e\u73b0(501)";break;case 502:s="\u7f51\u7edc\u9519\u8bef(502)";break;case 503:s="\u670d\u52a1\u4e0d\u53ef\u7528(503)";break;case 504:s="\u7f51\u7edc\u8d85\u65f6(504)";break;case 505:s="HTTP\u7248\u672c\u4e0d\u53d7\u652f\u6301(505)";break;default:s="\u8fde\u63a5\u51fa\u9519(".concat(e.response.status,")!")}a.Z.error(s)}catch(r){a.Z.error(s)}}},50685:function(e,s,r){r.r(s),r.d(s,{default:function(){return w}});r(37531);var a=r(25671),t=(r(5819),r(64196)),o=(r(79957),r(35891)),n=(r(78308),r(94830)),c=(r(66420),r(74486)),i=(r(1405),r(91333)),u=r(27853),l=r(84531),m=r(78932),p=r(82625),d=r(72791),g=r(79271),f=r(29396),h=r(3014),k=r(62308),b=r(80184),v=function(e){(0,m.Z)(r,e);var s=(0,p.Z)(r);function r(){var e;(0,u.Z)(this,r);for(var a=arguments.length,t=new Array(a),o=0;o<a;o++)t[o]=arguments[o];return(e=s.call.apply(s,[this].concat(t))).state={loading:!1,visible:!1,modalLoading:!1},e.handleSubmit=function(s){s.preventDefault(),e.props.form.validateFields((function(e,s){if(!e){var r=s.username,a=s.password;f.Z.post("".concat(h.b,"/user/login"),{username:r,password:a}).then((function(e){localStorage.clear(),localStorage.setItem("token",e.data.token),setTimeout((function(){window.location.href="/"}),200)})).catch((function(e){(0,k.Z)(e,"")}))}}))},e.check_password=function(s,r,a){e.props.form.getFieldValue("fpassword1")!==e.props.form.getFieldValue("fpassword2")?a(new Error("Password not same")):a()},e}return(0,l.Z)(r,[{key:"componentDidMount",value:function(){window.localStorage.clear()}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator;return(0,b.jsx)(a.Z,{className:"login animated fadeIn",children:(0,b.jsx)("div",{className:"model",children:(0,b.jsxs)("div",{className:"login-form",children:[(0,b.jsx)("h3",{children:"DKRMS Login"}),(0,b.jsx)(i.Z,{}),(0,b.jsxs)(o.Z,{onSubmit:this.handleSubmit,children:[(0,b.jsx)(o.Z.Item,{children:e("username",{rules:[{required:!0,message:"Username"}]})((0,b.jsx)(n.Z,{prefix:(0,b.jsx)(c.Z,{type:"user",style:{color:"rgba(0,0,0,.25)"}}),placeholder:"Username"}))}),(0,b.jsx)(o.Z.Item,{children:e("password",{rules:[{required:!0,message:"Password"}]})((0,b.jsx)(n.Z,{prefix:(0,b.jsx)(c.Z,{type:"lock",style:{color:"rgba(0,0,0,.25)"}}),type:"password",placeholder:"Password"}))}),(0,b.jsx)(o.Z.Item,{children:(0,b.jsx)(t.Z,{type:"primary",htmlType:"submit",className:"login-form-button",loading:this.state.loading,children:"Login"})})]})]})})})}}]),r}(d.Component),w=(0,g.EN)(o.Z.create()(v))}}]);
//# sourceMappingURL=login.6ff5735e.chunk.js.map