import React, { Component } from 'react';
import {
  Card,
  Form,
  Switch,
  Divider,
  Popconfirm,
  Button,
  Modal,
  Input,
  Radio,
  Select,
  Avatar,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ImgUpload from '../../components/Upload/ImgUpload';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const SearchForm = Form.create()(props => {
  const { form, getData, handleSerarchParam } = props;
  const handleSearch = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSerarchParam(fieldsValue);
      getData(fieldsValue);
    });
  };
  return (
    <Form onSubmit={handleSearch} layout="inline" style={{ float: 'right' }}>
      <FormItem label="用户名" style={{ position: 'relative', bottom: '4px' }}>
        {form.getFieldDecorator('username')(<Input placeholder="请输入" autoComplete="off" />)}
      </FormItem>
      <Button type="primary" htmlType="submit">
        查询
      </Button>
    </Form>
  );
});

@connect(({ users, loading }) => ({
  users: users,
  loading: loading.models.users,
}))
@Form.create()
export default class User extends Component {
  state = {
    modalVisible: false,
    roleModalVisible: false,
    selectedRows: [],
    isAdd: true,
    allRoles: [],
    defaultSelectedRoles: [],
    currUserId: 0,
    currAvatar: '',
    searchParam: {},
  };

  componentDidMount() {
    this.getAllRoleData();
    this.getData();
  }
  onChangeStatus = record => {
    this.props.dispatch({
      type: 'users/changeStatus',
      payload: record.id,
    });
    record.status = record.status * -1 + 1;
  };
  getData = params => {
    this.props.dispatch({
      type: 'users/fetch',
      payload: params,
    });
  };
  getAllRoleData = () => {
    this.props.dispatch({
      type: 'users/fetchRoles',
      callback: () => {
        const { users: { allRoles } } = this.props;
        const children = [];
        for (let i = 0; i < allRoles.length; i++) {
          children.push(<Option key={allRoles[i].id}>{allRoles[i].name}</Option>);
        }
        this.setState({ allRoles: children });
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: flag,
    });
  };
  handleRoleModalVisible = flag => {
    this.setState({
      roleModalVisible: flag,
    });
  };
  // 点击编辑或者新增按钮
  handleAddOrEdit = record => {
    const { setFieldsValue, resetFields } = this.props.form;
    if (!record) {
      // 新增
      resetFields();
      this.setState({ isAdd: true, currAvatar: '' });
    } else {
      // 编辑
      setFieldsValue(record);
      this.setState({ isAdd: false, currAvatar: record.avatar });
    }
    this.handleModalVisible(true);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'users/save',
          payload: values,
          callback: this.handleSubmitResult,
        });
      }
    });
  };
  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.handleRoleModalVisible(false);
    this.getData();
  };
  // 删除
  handlerDelete = id => {
    this.props.dispatch({
      type: 'users/remove',
      payload: id,
      callback: this.handleSubmitResult,
    });
  };
  // 表格跳转
  handleStandardTableChange = pagination => {
    const params = {
      page: pagination.current - 1,
      size: pagination.pageSize,
    };

    this.getData(Object.assign({}, params, this.state.searchParam));
  };

  handleFetchRoles = record => {
    this.setState({
      defaultSelectedRoles: record.roleIdList,
      currUserId: record.id,
    });
    this.handleRoleModalVisible(true);
  };
  handleSelectedChange = value => {
    this.setState({
      defaultSelectedRoles: value,
    });
  };
  handleSelectedSubmit = () => {
    const roleIds = this.state.defaultSelectedRoles;
    const param = { userId: this.state.currUserId, roleIds: roleIds.join(',') };
    this.props.dispatch({
      type: 'users/saveRole',
      payload: param,
      callback: this.handleSubmitResult,
    });
  };

  handleSerarchParam = searchParam => {
    this.setState({
      searchParam: Object.assign({}, this.state.searchParam, searchParam),
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { users: { data }, loading } = this.props;
    const columns = [
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        render: val => (val ? <Avatar src={val} /> : <Avatar icon="user" />),
      },
      { title: '用户名', dataIndex: 'username', key: 'usernmae' },
      { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '手机', dataIndex: 'mobile', key: 'mobile' },
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
        key: 'action',
        render: (text, record) => (
          <span>
            <Button size="small" onClick={() => this.handleFetchRoles(record)}>
              角色
            </Button>
            <Divider type="vertical" />
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

    const parentMethods = {
      getData: this.getData,
      handleSerarchParam: this.handleSerarchParam,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Button icon="plus" type="primary" onClick={() => this.handleAddOrEdit()}>
              新建
            </Button>
            <SearchForm {...parentMethods} />
          </div>
          <StandardTable
            loading={loading}
            selectedRows={this.state.selectedRows}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
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
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请填写用户名', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="头像" {...formItemLayout}>
              {getFieldDecorator('avatar', {
                initialValue: this.state.currAvatar,
                getValueFromEvent: res => {
                  return res.msg;
                },
              })(<ImgUpload />)}
            </FormItem>
            <FormItem label="昵称" {...formItemLayout}>
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '请填写用户昵称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            {this.state.isAdd ? (
              <FormItem label="密码" {...formItemLayout}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请填写用户密码', whitespace: true }],
                })(<Input type="password" />)}
              </FormItem>
            ) : (
              <FormItem label="密码" {...formItemLayout}>
                {getFieldDecorator('password')(<Input type="password" />)}
              </FormItem>
            )}

            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [{ type: 'email', message: '请填写正确的邮箱' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="手机" {...formItemLayout}>
              {getFieldDecorator('mobile', {
                rules: [{ pattern: /^1[0-9]{10}$/, message: '请填写正确的手机号' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: 1,
              })(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="角色"
          visible={this.state.roleModalVisible}
          onCancel={() => this.handleRoleModalVisible(false)}
          onOk={this.handleSelectedSubmit}
          confirmLoading={loading}
          width={600}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={this.state.defaultSelectedRoles}
            value={this.state.defaultSelectedRoles}
            onChange={this.handleSelectedChange}
          >
            {this.state.allRoles}
          </Select>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
