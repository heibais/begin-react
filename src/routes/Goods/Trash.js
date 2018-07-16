import React from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';

import { Card, Button, Popconfirm, Divider } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
export default class Trash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      searchValues: [],
    };
  }

  componentDidMount() {}

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
    // this.fetchData(params);
  };

  render() {
    const { goods: { data }, loading } = this.props;

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
              onClick={() => this.props.dispatch(routerRedux.push(`goods-edit/${record.id}`))}
            >
              还原
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
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
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
