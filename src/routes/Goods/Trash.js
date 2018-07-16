import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';

import { Card, Button, Popconfirm, Divider, Input } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { getUserId } from '../../utils/global';

const Search = Input.Search;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
export default class Trash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      selectedRows: [],
      searchValues: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params) => {
    this.props.dispatch({
      type: 'goods/fetchTrash',
      payload: Object.assign({}, { userId: this.state.userId }, params),
    });
  };

  handleChangeStatus = (record, statusEnum) => {
    this.props.dispatch({
      type: 'goods/changeStatus',
      payload: { id: record.id, userId: this.state.userId, statusEnum },
      callback: this.fetchData,
    });
  };

  handleDelete = record => {
    this.props.dispatch({
      type: 'goods/remove',
      payload: { id: record.id, userId: this.state.userId},
      callback: this.fetchData,
    });
  };

  handleSelectRows = rows => {
    this.setState({ selectedRows: rows });
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

  render() {
    const { goods: { trashData }, loading } = this.props;

    const columns = [
      { title: '商品名称', dataIndex: 'goodsName', key: 'goodsName' },
      { title: '货号', dataIndex: 'goodsSn', key: 'goodsSn' },
      { title: '价格', dataIndex: 'shopPrice', key: 'shopPrice' },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              size="small"
              onClick={() => this.handleChangeStatus(record, 'DELETE')}
            >
              还原
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="你确定要删除吗？"
              onConfirm={() => this.handleDelete(record)}
            >
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
        <Card bordered={false} >
          <div style={{marginBottom: '20px'}}>
            <Search
              placeholder="请输入商品名称"
              onSearch={value => this.fetchData({goodsName: value})}
              style={{ width: 200 }}
            />
          </div>
          <StandardTable
            loading={loading}
            selectedRows={this.state.selectedRows}
            data={trashData}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
