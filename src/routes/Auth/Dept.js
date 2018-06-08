import React, { PureComponent } from 'react';
import {
  Card,
  Table,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  TreeSelect,
  Switch,
  InputNumber,
  Popconfirm,
  Radio,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ dept, loading }) => ({
  dept,
  loading: loading.models.dept,
}))
@Form.create()
export default class Dept extends PureComponent {
  state = {
    modalVisible: false,
    treeData: [{ label: '顶级部门', value: '0', key: 0 }],
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.props.dispatch({
      type: 'dept/fetch',
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: flag,
    });
  };
  handlerDelete = id => {
    this.props.dispatch({
      type: 'dept/remove',
      payload: id,
      callback: this.handleSubmitResult,
    });
  };
  formatTreeSelect = () => {
    let data = this.props.dept.list;
    function format(data) {
      let treeData = [];
      data.map((item, index) => {
        if (item.status === 0) return false;
        let obj = {};
        obj.label = item.name;
        obj.value = item.id + '';
        obj.key = item.key;
        if (item.children) {
          obj.children = format(item.children);
        }
        treeData[index] = obj;
      });
      return treeData;
    }
    let formatTreeData = format(data);
    formatTreeData.unshift(this.state.treeData[0]);
    this.setState({ treeData: formatTreeData });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'dept/save',
          payload: values,
          callback: this.handleSubmitResult,
        });
      }
    });
  };
  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.getData();
  };
  // 点击编辑或者新增按钮
  handleAddOrEdit = record => {
    this.formatTreeSelect();
    const { setFieldsValue, resetFields } = this.props.form;
    if (!record) {
      // 新增
      resetFields();
    } else {
      // 编辑
      setFieldsValue({
        id: record.id,
        pid: record.pid + '',
        name: record.name,
        status: record.status,
        sort: record.sort,
      });
    }
    this.handleModalVisible(true);
  };

  onChangeStatus = record => {
    this.props.dispatch({
      type: 'dept/changeStatus',
      payload: record.id,
    });
    record.status = record.status * -1 + 1;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dept: { list: data }, loading } = this.props;
    const columns = [
      { title: '部门名称', dataIndex: 'name' },
      {
        title: '状态',
        dataIndex: 'status',
        render: (val, record) => (
          <Switch checked={val ? true : false} onChange={() => this.onChangeStatus(record)} />
        ),
      },
      { title: '排序', dataIndex: 'sort' },
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
        <Card title="部门" bordered={false}>
          <Button icon="plus" type="primary" onClick={() => this.handleAddOrEdit()}>
            新建
          </Button>
          <Table columns={columns} dataSource={data} loading={loading} />
        </Card>
        <Modal
          title="新增"
          visible={this.state.modalVisible}
          onCancel={() => this.handleModalVisible(false)}
          onOk={this.handleSubmit}
          confirmLoading={loading}
          width={600}
        >
          <Form>
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <FormItem label="上级部门" {...formItemLayout}>
              {getFieldDecorator('pid', {
                rules: [{ required: true, message: '请选择上级部门' }],
              })(<TreeSelect treeData={this.state.treeData} treeDefaultExpandAll />)}
            </FormItem>
            <FormItem label="部门名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写部门名称', whitespace: true }],
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
