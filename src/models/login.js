import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout } from '../services/admin';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { message } from 'antd';
import {setLoginUser} from "../utils/global";

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // Login successfully
      if (response.code === 200) {
        setAuthority('user');
        setLoginUser(JSON.stringify(response.data));
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      } else {
        message.error(response.msg);
      }
    },
    *logout(_, { call, put }) {
      const response = yield call(accountLogout);
      if (response.code === 200) {
        setAuthority('guest');
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      } else {
        return message.error(response.msg);
      }
    },
  },
};
