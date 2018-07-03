import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import { routerRedux } from 'dva/router';
import { Card, Switch, Divider, Popconfirm, Button } from 'antd';
import { connect } from 'dva/index';
import { getUserId } from '../../utils/global';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))

class Goods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  };

  fetchData = (params) => {
    this.props.dispatch({
      type: 'goods/fetch',
      payload: Object.assign({}, {userId: this.state.userId}, params),
    });
  };

  handleChangeStatus = (record, statusEnum) => {
    this.props.dispatch({
      type: 'goods/changeStatus',
      payload: { id: record.id, userId: this.state.userId, statusEnum },
      callback: this.fetchData
    });

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
            <Button size="small" onClick={() => this.props.dispatch(routerRedux.push(`goods-edit/${record.id}`))}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm title="你确定要删除吗？" onConfirm={() => this.handleChangeStatus(record, 'DELETE')}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.props.dispatch(routerRedux.push('goods-add'))}
            >
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
      </PageHeaderLayout>
    );
  }
}

export default Goods;
