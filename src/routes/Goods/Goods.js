import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import { routerRedux } from 'dva/router';
import {
  Card,
  Switch,
  Divider,
  Popconfirm,
  Button,
  Dropdown,
  Icon,
  Menu,
  Form,
  Row,
  Col,
  Select,
  Input,
  TreeSelect,
} from 'antd';
import { connect } from 'dva/index';
import { getUserId } from '../../utils/global';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
class Goods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      selectedRows: [],
      searchValues: {},
      categoryTreeData: [],
    };
  }

  componentDidMount() {
    this.fetchData();

    // 查询分类列表
    this.props.dispatch({
      type: 'goods/fetchCategory',
      payload: { userId: this.state.userId },
      callback: this.formatTreeSelect,
    });
    // 查询品牌列表
    this.props.dispatch({
      type: 'goods/fetchBrand',
      payload: { userId: this.state.userId },
    });
    // 查询供应商列表
    this.props.dispatch({
      type: 'goods/fetchSupplier',
      payload: { userId: this.state.userId },
    });
  }

  formatTreeSelect = () => {
    const list = this.props.goods.categoryList;
    function format(data) {
      let treeData = [];
      data.forEach((item, index) => {
        if (item.status === 0) return false;
        const obj = {};
        obj.label = item.name;
        obj.value = item.id.toString();
        obj.key = item.key;
        if (item.children) {
          obj.children = format(item.children);
        }
        treeData[index] = obj;
      });
      return treeData;
    }
    const categoryTreeData = format(list);
    this.setState({ categoryTreeData });
  };

  fetchData = params => {
    this.props.dispatch({
      type: 'goods/fetch',
      payload: Object.assign({}, { userId: this.state.userId }, params),
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { searchValues } = this.state;

    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      ...searchValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchData(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ searchValues: {} });
    this.fetchData();
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, searchValues) => {
      if (err) return;
      this.setState({ searchValues });
      this.fetchData(searchValues);
    });
  };

  handleChangeStatus = (record, statusEnum) => {
    this.props.dispatch({
      type: 'goods/changeStatus',
      payload: { id: record.id, userId: this.state.userId, statusEnum },
      callback: this.fetchData,
    });
  };

  handleSelectRows = rows => {
    this.setState({ selectedRows: rows });
  };

  searchForm = () => {
    const { form: { getFieldDecorator }, goods: { brandList, supplierList } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={8}>
          <Col span={2}>
            {getFieldDecorator('categoryId')(
              <TreeSelect placeholder="请选择分类" treeData={this.state.categoryTreeData} />
            )}
          </Col>
          <Col span={2}>
            {getFieldDecorator('brandId')(
              <Select placeholder="请选择品牌">
                {brandList &&
                  brandList.map((item, index) => {
                    return (
                      <Option key={`brand${index}`} value={item.id}>
                        {item.brandName}
                      </Option>
                    );
                  })}
              </Select>
            )}
          </Col>
          <Col span={2}>
            {getFieldDecorator('supplierId')(
              <Select placeholder="请选择供应商">
                {supplierList &&
                  supplierList.map((item, index) => {
                    return (
                      <Option key={`supplier${index}`} value={item.id}>
                        {item.supplierName}
                      </Option>
                    );
                  })}
              </Select>
            )}
          </Col>
          <Col span={2}>
            {getFieldDecorator('ifOnSale')(
              <Select placeholder="请选择上下架">
                <Option value={true}>上架</Option>
                <Option value={false}>下架</Option>
              </Select>
            )}
          </Col>
          <Col span={2}>
            {getFieldDecorator('recommend')(
              <Select placeholder="请选择推荐">
                <Option value="NEW">新品</Option>
                <Option value="BEST">精品</Option>
                <Option value="HOT">热销</Option>
              </Select>
            )}
          </Col>
          <Col span={4}>
            {getFieldDecorator('goodsName')(<Input placeholder="请输入商品名称" />)}
          </Col>
          <Col span={10}>
            <span>
              <Button type="primary" htmlType="submit" icon="search">
                查询
              </Button>
              <Button
                type="danger"
                icon="reload"
                style={{ marginLeft: 8 }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { goods: { data }, loading } = this.props;
    const columns = [
      { title: '商品名称', dataIndex: 'goodsName', key: 'goodsName' },
      { title: '货号', dataIndex: 'goodsSn', key: 'goodsSn' },
      { title: '价格', dataIndex: 'shopPrice', key: 'shopPrice' },
      {
        title: '上架',
        dataIndex: 'ifOnSale',
        key: 'ifOnSale',
        render: (val, record) => (
          <Switch checked={val} onChange={() => this.handleChangeStatus(record, 'ONSALE')} />
        ),
      },
      {
        title: '精品',
        dataIndex: 'ifBest',
        key: 'ifBest',
        render: (val, record) => (
          <Switch checked={val} onChange={() => this.handleChangeStatus(record, 'BEST')} />
        ),
      },
      {
        title: '新品',
        dataIndex: 'ifNew',
        key: 'ifNew',
        render: (val, record) => (
          <Switch checked={val} onChange={() => this.handleChangeStatus(record, 'NEW')} />
        ),
      },
      {
        title: '热销',
        dataIndex: 'ifHot',
        key: 'ifHot',
        render: (val, record) => (
          <Switch checked={val} onChange={() => this.handleChangeStatus(record, 'HOT')} />
        ),
      },
      { title: '排序', dataIndex: 'sort', key: 'sort' },
      { title: '库存', dataIndex: 'goodsNumber', key: 'goodsNumber' },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.props.dispatch(routerRedux.push(`goods-edit/${record.id}`))}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="你确定要删除吗？"
              onConfirm={() => this.handleChangeStatus(record, 'DELETE')}
            >
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const batchMenu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="batchUp">批量上架</Menu.Item>
        <Menu.Item key="batchDown">批量下架</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false} title={this.searchForm()}>
          <div style={{ marginBottom: '20px' }}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.props.dispatch(routerRedux.push('goods-add'))}
            >
              新建
            </Button>
            {this.state.selectedRows.length > 0 && (
              <span>
                &nbsp;&nbsp;
                <Dropdown overlay={batchMenu}>
                  <Button>
                    批量操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            )}
          </div>
          <StandardTable
            loading={loading}
            selectedRows={this.state.selectedRows}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Goods;
