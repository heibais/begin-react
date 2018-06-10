import { findAuthList, removeAuth, saveAuth, changeAuthStatus } from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'permission',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findAuthList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveAuth, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeAuth, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload }, { call }) {
      const response = yield call(changeAuthStatus, payload);
      if (response.code === 500) return message.error(response.msg);
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
