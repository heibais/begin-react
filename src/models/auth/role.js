import {
  findRoleList,
  removeRole,
  saveRole,
  changeRoleStatus,
  findPermissionTree,
  savePermissions,
} from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'role',

  state: {
    list: [],
    treeData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findRoleList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(findPermissionTree, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryRuleTree',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveRole, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *saveRules({ payload, callback }, { call }) {
      const response = yield call(savePermissions, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeRole, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload }, { call }) {
      const response = yield call(changeRoleStatus, payload);
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
    queryRuleTree(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
  },
};
