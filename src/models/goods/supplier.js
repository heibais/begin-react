import { findSupplierList, removeSupplier, saveSupplier, changeSupplierStatus } from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'supplier',

  state: {
    data: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findSupplierList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveSupplier, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeSupplier, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload }, { call }) {
      const response = yield call(changeSupplierStatus, payload);
      if (response.code === 500) return message.error(response.msg);
    },
  },

  reducers: {
    queryList(state, action) {
      const result = action.payload;
      const data = {
        list: result.records,
        pagination: {
          total: result.total,
          pageSize: result.size,
          current: result.current,
        },
      };
      return {
        ...state,
        data,
      };
    },
  },
};
