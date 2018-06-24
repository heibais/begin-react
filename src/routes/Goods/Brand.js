import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
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
  InputNumber,
} from 'antd';
import {connect} from 'dva/index';
import { getUserId } from '../../utils/global';
import ImgUpload from '../../components/Upload/ImgUpload';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

@connect(({ brand, loading }) => ({
  brand,
  loading: loading.models.brand,
}))
@Form.create()
class Brand extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      selectedRows: [],
      currBrandLogo: '',
      modalVisible: false,
    }
  }

  componentDidMount() {
    this.fetchData({userId: this.state.userId});
  }

  fetchData = params => {
    this.props.dispatch({
      type: 'brand/fetch',
      payload: params,
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
      setFieldsValue(record);
      this.setState({ currBrandLogo: record.brandLogo });
    }
    this.handleModalVisible(true);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'brand/save',
          payload: Object.assign({}, values, {userId: this.state.userId}),
          callback: this.handleSubmitResult,
        });
      }
    });
  };
  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.fetchData({userId: this.state.userId});
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { brand: { data }, loading } = this.props;
    const columns = [
      {
        title: '品牌logo',
        dataIndex: 'brandLogo',
        key: 'brandLogo',
        render: val => (val ? <Avatar src={val} /> : <Avatar icon="user" />),
      },
      { title: '品牌名称', dataIndex: 'brandName', key: 'brandName' },
      { title: '品台网址', dataIndex: 'siteUrl', key: 'siteUrl' },
      {
        title: '是否显示',
        dataIndex: 'show',
        key: 'show',
        render: (val, record) => (
          <Switch checked={val ? true : false} onChange={() => this.onChangeStatus(record)} />
        ),
      },
      { title: '排序', dataIndex: 'sort', key: 'sort' },
      {
        title: '操作',
        key: 'action',
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
    return(
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Button icon="plus" type="primary" onClick={() => this.handleAddOrEdit()}>
              新建
            </Button>
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
            <FormItem label="品牌logo" {...formItemLayout}>
              {getFieldDecorator('brandLogo', {
                initialValue: this.state.currBrandLogo,
                getValueFromEvent: res => {
                  return res.msg;
                },
              })(<ImgUpload />)}
            </FormItem>
            <FormItem label="品牌名称" {...formItemLayout}>
              {getFieldDecorator('brandName', {
                rules: [{ required: true, message: '请填写品牌名称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="品牌网址" {...formItemLayout}>
              {getFieldDecorator('siteUrl', {
                rules: [{ type: 'url', message: '请填写正确的url', whitespace: true }],
              })(<Input autoComplete="off" placeHolder="http://" />)}
            </FormItem>
            <FormItem label="品牌简介" {...formItemLayout}>
              {getFieldDecorator('brandDesc')(<TextArea autoComplete="off" />)}
            </FormItem>

            <FormItem label="是否显示" {...formItemLayout}>
              {getFieldDecorator('show', {
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

export default Brand;
