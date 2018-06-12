import {
  findUserList,
  removeUser,
  saveUser,
  changeUserStatus,
  findSimpleRoleList,
  saveUserRole,
  changeUserPwd,
  queryCurrent,
} from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'users',

  state: {
    data: [],
    allRoles: [],
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findUserList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *fetchRoles({ payload, callback }, { call, put }) {
      const response = yield call(findSimpleRoleList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryRoles',
        payload: response.data,
      });
      if (callback) callback();
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveUser, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *saveRole({ payload, callback }, { call }) {
      const response = yield call(saveUserRole, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeUser, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload }, { call }) {
      const response = yield call(changeUserStatus, payload);
      if (response.code === 500) return message.error(response.msg);
    },
    *changePwd({ payload, callback }, { call }) {
      const response = yield call(changeUserPwd, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      const result = action.payload;
      const data = {
        list: result.content,
        pagination: {
          total: result.totalElements,
          pageSize: result.size,
          current: parseInt(result.number + 1, 10) || 1,
        },
      };
      return {
        ...state,
        data,
      };
    },
    queryRoles(state, action) {
      return {
        ...state,
        allRoles: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
