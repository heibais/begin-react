import {message} from "antd/lib/index";
import {findBrandListNoPage, findCategoryList, findSupplierListNoPage} from "../../services/admin";

export default {
  namespace: 'goods',

  state: {
    data: {},
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
  },
};
