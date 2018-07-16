import { message } from 'antd/lib/index';
import {
  findBrandListNoPage,
  findCategoryList,
  findSupplierListNoPage,
  findGoodsList,
  findGoodsOne,
  saveGoods,
  removeGoods,
  changeGoodsStatus,
  findGoodsTrashList,
} from '../../services/admin';

export default {
  namespace: 'goods',

  state: {
    data: {},
    trashData: {},
    goods: {},
    brandList: [],
    supplierList: [],
    categoryList: [],
  },

  effects: {
    *fetchCategory({ payload, callback }, { call, put }) {
      const response = yield call(findCategoryList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryCategory',
        payload: response.data,
      });
      if (callback) callback();
    },
    *fetchBrand({ payload }, { call, put }) {
      const response = yield call(findBrandListNoPage, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryBrand',
        payload: response.data,
      });
    },
    *fetchSupplier({ payload }, { call, put }) {
      const response = yield call(findSupplierListNoPage, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'querySupplier',
        payload: response.data,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(findGoodsList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *fetchTrash({ payload }, { call, put }) {
      const response = yield call(findGoodsTrashList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryTrashList',
        payload: response.data,
      });
    },
    *fetchOne({ payload, callback }, { call, put }) {
      const response = yield call(findGoodsOne, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryOne',
        payload: response.data,
      });
      if (callback) callback();
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveGoods, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeGoods, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload, callback }, { call }) {
      const response = yield call(changeGoodsStatus, payload);
      if (response.code === 500) return message.error(response.msg);
      if (callback) callback();
    },
  },

  reducers: {
    queryCategory(state, action) {
      return {
        ...state,
        categoryList: action.payload,
      };
    },
    queryBrand(state, action) {
      return {
        ...state,
        brandList: action.payload,
      };
    },
    querySupplier(state, action) {
      return {
        ...state,
        supplierList: action.payload,
      };
    },
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
    queryTrashList(state, action) {
      const result = action.payload;
      const trashData = {
        list: result.records,
        pagination: {
          total: result.total,
          pageSize: result.size,
          current: result.current,
        },
      };
      return {
        ...state,
        trashData,
      };
    },
    queryOne(state, action) {
      return {
        ...state,
        goods: action.payload,
      };
    },
  },
};
