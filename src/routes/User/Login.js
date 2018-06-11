import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';


const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, captcha, loading }) => ({
  login,
  captcha,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'account',
      rememberMe: true,
    };
    this.mobileInput = React.createRef();
  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type, rememberMe } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          rememberMe,
        },
      });
    }
  };

  handleGetCaptcha = () => {
    const mobile = this.mobileInput.current.value;
    this.props.dispatch({
      type: 'captcha/sendMobile',
      payload: '18281774033',
    })
  };

  changeAutoLogin = e => {
    this.setState({
      rememberMe: e.target.checked,
    });
  };

  render() {
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            <UserName name="username" placeholder="用户名/手机" />
            <Password name="password" placeholder="请输入密码" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            <Mobile name="mobile" placeholder="手机号码" ref={this.mobileInput} />
            <Captcha name="captcha" placeholder="验证码" onGetCaptcha={this.handleGetCaptcha} />
          </Tab>
          <div>
            <Checkbox checked={this.state.rememberMe} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
