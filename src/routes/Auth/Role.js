import React, { PureComponent } from 'react';
import {
  Card,
  Row,
  Col,
  Tree,
  Table,
  Form,
  Switch,
  Button,
  Popconfirm,
  Divider,
  Modal,
  Input,
  InputNumber,
  Radio,
  Icon,
  message,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class Dept extends PureComponent {
  state = {
    modalVisible: false,
    checkedKeys: [],
    currRoleName: '',
    currRoleId: 0,
  };

  componentDidMount() {
    this.getData();
    this.props.dispatch({
      type: 'role/fetchTree',
    });
  }

  getData = () => {
    this.props.dispatch({
      type: 'role/fetch',
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: flag,
    });
  };
  // 点击编辑或者新增按钮
  handleAddOrEdit = record => {
    const { setFieldsValue, resetFields } = this.props.form;
    if (!record) {
      // 新增
      resetFields();
    } else {
      // 编辑
      setFieldsValue({
        id: record.id,
        name: record.name,
        status: record.status + '',
        sort: record.sort,
      });
    }
    this.handleModalVisible(true);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'role/save',
          payload: values,
          callback: this.handleSubmitResult,
        });
      }
    });
  };
  handlerDelete = id => {
    this.props.dispatch({
      type: 'role/remove',
      payload: id,
      callback: this.handleSubmitResult,
    });
  };
  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.getData();
  };
  onChangeStatus = record => {
    this.props.dispatch({
      type: 'role/changeStatus',
      payload: record.id,
    });
    record.status = record.status * -1 + 1;
  };
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };
  showRoleRuleIds = record => {
    this.setState({
      currRoleName: ' -> ' + record.name,
      currRoleId: record.id,
      checkedKeys: record.permissionIdList,
    });
  };
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };
  handleSaveRules = () => {
    // 保存角色权限
    if (this.state.currRoleId === 0) {
      return message.error('请先选择角色');
    }
    let params = {
      roleId: this.state.currRoleId,
      permissionIds: this.state.checkedKeys.join(','),
    };
    this.props.dispatch({
      type: 'role/saveRules',
      payload: params,
      callback: this.handleSubmitResult,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { role: { list: data, treeData }, loading } = this.props;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        render: (val, record) => (
          <a href="javascript:;" onClick={() => this.showRoleRuleIds(record)}>
            <Icon type="tool" /> {val}
          </a>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (val, record) => (
          <Switch checked={val ? true : false} onChange={() => this.onChangeStatus(record)} />
        ),
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <Button size="small" onClick={() => this.handleAddOrEdit(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm title="你确定要删除吗？" onConfirm={() => this.handlerDelete(record.id)}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <PageHeaderLayout>
        <Row gutter={16}>
          <Col span={9}>
            <Card
              title="角色"
              bordered={false}
              extra={
                <Button icon="plus" type="primary" onClick={() => this.handleAddOrEdit()}>
                  新建
                </Button>
              }
            >
              <Table columns={columns} dataSource={data} loading={loading} />
            </Card>
          </Col>
          <Col span={15}>
            <Card
              title={'权限' + this.state.currRoleName}
              bordered={false}
              extra={
                <Button icon="check" type="danger" onClick={this.handleSaveRules}>
                  授权
                </Button>
              }
            >
              {treeData.length ? (
                <Tree checkable checkedKeys={this.state.checkedKeys} onCheck={this.onCheck}>
                  {this.renderTreeNodes(treeData)}
                </Tree>
              ) : (
                'loading tree'
              )}
            </Card>
          </Col>
        </Row>
        <Modal
          title="新增/编辑"
          visible={this.state.modalVisible}
          onCancel={() => this.handleModalVisible(false)}
          onOk={this.handleSubmit}
          confirmLoading={loading}
          width={600}
        >
          <Form>
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <FormItem label="角色名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写角色名称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: '1',
              })(
                <RadioGroup>
                  <Radio value="1">启用</Radio>
                  <Radio value="0">禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sort', {
                initialValue: 99,
                rules: [{ required: true, message: '请填写排序数字' }],
              })(<InputNumber min={1} max={100} />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
