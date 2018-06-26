import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  List,
  Avatar,
  Icon,
  Button,
  Badge,
  Modal,
  Steps,
  message,
  Tabs,
  Timeline,
  Form,
  Input,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Mini.less';

const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const steps = [
  {
    title: '选择类型',
    content: 'First-content',
  },
  {
    title: '申请授权',
    content: 'Second-content',
  },
  {
    title: '提交发布',
    content: 'Last-content',
  },
];

@connect(({ project, activities, chart, loading }) => ({
  project,
  activities,
  chart,
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
@Form.create()
export default class Workplace extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      currentStep: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const { activities: { list } } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  handleModalVisible = flag => {
    this.setState({ modalVisible: flag });
  };

  next() {
    const currentStep = this.state.currentStep + 1;
    this.setState({ currentStep });
  }
  prev() {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  }

  render() {
    const {
      project: { notice },
      projectLoading,
      activitiesLoading,
      form: { getFieldDecorator },
    } = this.props;
    const { currentStep } = this.state;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>早安，曲丽丽，祝你开心每一天！</div>
          <div>交互专家 | 蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>开通小程序</p>
          <p>1</p>
        </div>
        <div className={styles.statItem}>
          <p>系统运营</p>
          <p>
            8<span> 天</span>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>收入</p>
          <p>2,223</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="小程序列表"
              bordered={false}
              extra={
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  创建小程序
                </Button>
              }
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              {notice.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card
                    bodyStyle={{ padding: 0 }}
                    bordered={false}
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                    actions={[
                      <span>
                        <Icon type="area-chart" /> 数据
                      </span>,
                      <span>
                        <Icon type="setting" /> 设置
                      </span>,
                      <span>
                        <Icon type="delete" /> 删除
                      </span>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo} />
                          <Link to={item.href}>{item.title}</Link>
                        </div>
                      }
                    />
                    <div className={styles.projectItemContent}>
                      <span>
                        <Badge status="success" text="已上线" />
                      </span>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          2018-06-17 11:00:00
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>

            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              title="小程序发布指南 "
              loading={activitiesLoading}
            >
              <Row gutter={8}>
                <Col span={8}>
                  <Card bodyStyle={{ background: '#ABCDEF' }} hoverable>
                    <p>新手引导</p>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card hoverable>
                    <p>如何申请微信小程序账号</p>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card hoverable>
                    <p>小程序发布常见问题</p>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="消息通知"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
        </Row>
        <Modal
          title="创建小程序"
          width={900}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={() => this.handleModalVisible(false)}
          footer={false}
        >
          <div>
            <Steps current={currentStep}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.stepsContent}>
              <Tabs
                activeKey={this.state.currentStep.toString()}
                tabBarStyle={{ border: 0, marginBottom: 0 }}
              >
                <TabPane tab="Tab 1" key="0" className={styles.stepsOne}>
                  <Row>
                    <Col span={18} className={styles.leftSide}>
                      <Row>
                        <Col span={12}>
                          <h2>线上商城</h2>
                          <p>适用于线上商城以及线下门店的小程序，包括丰富的营销工具和推广手段。</p>
                          <Timeline>
                            <Timeline.Item>商家管理</Timeline.Item>
                            <Timeline.Item>营销、推广工具</Timeline.Item>
                            <Timeline.Item>会员管理</Timeline.Item>
                            <Timeline.Item>交易数据分析</Timeline.Item>
                            <Timeline.Item>门店展示和基础服务</Timeline.Item>
                          </Timeline>
                        </Col>
                        <Col span={12}>图片</Col>
                      </Row>
                    </Col>
                    <Col span={6} className={styles.rightSide}>
                      <h3>请选择一个小程序的类型</h3>
                      <p>
                        为了节约审核时间，我们会以如图样式为你提交微信审核。你可以在提交发布后自由修改小程序的样式和功能
                      </p>
                      <p>
                        <Button type="primary">线下门店</Button> &nbsp;
                        <Button>线上商城</Button>
                      </p>
                      <p>
                        <Button>线上商城</Button> &nbsp;
                        <Button>线上商城</Button>
                      </p>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Tab 2" key="1" className={styles.stepsTwo}>
                  <Row gutter={16}>
                    <Col span={12} style={{ textAlign: 'center' }}>
                      <img src="https://s.dodoca.com/applet_mch/images/auth/03.png" />
                      <h4>我已经拥有小程序</h4>
                      <p>小程序管理员可以一键将小程序授权给点点客</p>
                      <Button type="primary">我有小程序，立即授权</Button>
                    </Col>
                    <Col span={12} style={{ textAlign: 'center' }}>
                      <img src="https://s.dodoca.com/applet_mch/images/auth/05.png" />
                      <h4>我还没有小程序</h4>
                      <p>
                        <a href="#">如何申请微信小程序？</a>
                      </p>
                      <Button type="primary">去微信公众平台申请</Button>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Tab 3" key="2">
                  <Row>
                    <Col span={12}>图片</Col>
                    <Col span={12}>
                      <Form>
                        <FormItem {...formItemLayout} label="小程序名称">
                          {getFieldDecorator('email')(<span>起风了</span>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="小程序类型">
                          {getFieldDecorator('email')(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="小程序头像">
                          {getFieldDecorator('email')(<span>起风了</span>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="介绍">
                          {getFieldDecorator('email')(<span>这是一个小程序，具体以后介绍...</span>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="微信认证">
                          {getFieldDecorator('email')(<span>未认证</span>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="服务类目">
                          {getFieldDecorator('email')(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="小程序标签">
                          {getFieldDecorator('email')(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="小程序体验码">
                          二维码
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                          <Button type="primary">发布小程序</Button>
                        </FormItem>
                      </Form>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
            <div className="stepsAction" style={{ height: '32px' }}>
              {this.state.currentStep > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
              {this.state.currentStep < steps.length - 1 && (
                <Button type="primary" style={{ float: 'right' }} onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {this.state.currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  style={{ float: 'right' }}
                  onClick={() => message.success('Processing complete!')}
                >
                  确定
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
