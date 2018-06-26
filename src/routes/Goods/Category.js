import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
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
  Select,
} from 'antd';
import { connect } from 'dva';
import { getUserId } from '../../utils/global';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
@connect(({ category, loading }) => ({
  category,
  loading: loading.models.category,
}))
@Form.create()
class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      modalVisible: false,
      treeData: [{ label: '顶级分类', value: '0', key: 0 }],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props.dispatch({
      type: 'category/fetch',
      payload: { userId: this.state.userId },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: flag,
    });
  };

  formatTreeSelect = () => {
    let data = this.props.category.list;
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
        pid: record.pid.toString(),
        name: record.name,
        status: record.status,
        recommend: record.recommend,
        sort: record.sort,
      });
    }
    this.handleModalVisible(true);
  };

  onChangeStatus = record => {
    this.props.dispatch({
      type: 'category/changeStatus',
      payload: { id: record.id, userId: this.state.userId },
    });
    record.status = record.status * -1 + 1;
  };

  onChangeRecommend = record => {
    this.props.dispatch({
      type: 'category/changeRecommend',
      payload: { id: record.id, userId: this.state.userId },
    });
    record.recommend = record.recommend * -1 + 1;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'category/save',
          payload: Object.assign({}, values, { userId: this.state.userId }),
          callback: this.handleSubmitResult,
        });
      }
    });
  };
  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.fetchData();
  };

  handleDelete = id => {
    this.props.dispatch({
      type: 'category/remove',
      payload: { id, userId: this.state.userId },
      callback: this.handleSubmitResult,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { category: { list: data }, loading } = this.props;
    const columns = [
      { title: '分类名称', dataIndex: 'name', key: 'name' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (val, record) => (
          <Switch checked={val ? true : false} onChange={() => this.onChangeStatus(record)} />
        ),
      },
      {
        title: '推荐',
        dataIndex: 'recommend',
        key: 'recommend',
        render: (val, record) => (
          <Switch checked={val ? true : false} onChange={() => this.onChangeRecommend(record)} />
        ),
      },
      { title: '排序', dataIndex: 'sort', key: 'sort' },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <Button size="small" onClick={() => this.handleAddOrEdit(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm title="你确定要删除吗？" onConfirm={() => this.handleDelete(record.id)}>
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
        <Card title="权限列表" bordered={false}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleAddOrEdit()}
            style={{ marginBottom: '20px' }}
          >
            新建
          </Button>
          <Table columns={columns} dataSource={data} loading={loading} />
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
            <FormItem label="上级分类" {...formItemLayout}>
              {getFieldDecorator('pid', {
                rules: [{ required: true, message: '请选择上级分类' }],
              })(<TreeSelect treeData={this.state.treeData} />)}
            </FormItem>
            <FormItem label="分类名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请填写分类名称', whitespace: true }],
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
            <FormItem label="是否推荐" {...formItemLayout}>
              {getFieldDecorator('recommend', {
                initialValue: 0,
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
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

export default Category;
