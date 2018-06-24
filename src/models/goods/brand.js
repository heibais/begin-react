import { findBrandList, removeCategory, saveBrand, changeCategoryStatus, changeCategoryRecommend } from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'brand',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findBrandList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveBrand, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeCategory, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload }, { call }) {
      const response = yield call(changeCategoryStatus, payload);
      if (response.code === 500) return message.error(response.msg);
    },
    *changeRecommend({ payload }, { call }) {
      const response = yield call(changeCategoryRecommend, payload);
      if (response.code === 500) return message.error(response.msg);
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
