import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import { Card, Form, Switch, Divider, Popconfirm, Button, Modal, Input, Radio } from 'antd';
import { connect } from 'dva/index';
import { getUserId } from '../../utils/global';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

@connect(({ supplier, loading }) => ({
  supplier,
  loading: loading.models.supplier,
}))
@Form.create()
class Supplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      selectedRows: [],
      currBrandLogo: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.fetchData({ userId: this.state.userId });
  }

  fetchData = params => {
    this.props.dispatch({
      type: 'supplier/fetch',
      payload: params,
    });
  };

  // 表格跳转
  handleStandardTableChange = pagination => {
    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      userId: this.state.userId,
    };

    this.fetchData(params);
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
    }
    this.handleModalVisible(true);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'supplier/save',
          payload: Object.assign({}, values, { userId: this.state.userId }),
          callback: this.handleSubmitResult,
        });
      }
    });
  };
  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.fetchData({ userId: this.state.userId });
  };

  // 删除
  handlerDelete = id => {
    this.props.dispatch({
      type: 'supplier/remove',
      payload: { id, userId: this.state.userId },
      callback: this.handleSubmitResult,
    });
  };
  onChangeStatus = record => {
    this.props.dispatch({
      type: 'supplier/changeStatus',
      payload: { id: record.id, userId: this.state.userId },
    });
    record.status = record.status * -1 + 1;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { supplier: { data }, loading } = this.props;
    const columns = [
      { title: '供应商名称', dataIndex: 'supplierName', key: 'brandName' },
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
            <FormItem label="供应商名称" {...formItemLayout}>
              {getFieldDecorator('supplierName', {
                rules: [{ required: true, message: '请填写供应商名称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="供应商简介" {...formItemLayout}>
              {getFieldDecorator('supplierDesc')(<TextArea autoComplete="off" />)}
            </FormItem>

            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: 1,
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default Supplier;
