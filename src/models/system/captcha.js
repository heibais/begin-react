import { sendEmailCaptcha, sendMobileCaptcha } from '../../services/admin';

export default {
  namespace: 'captcha',

  state: {},

  effects: {
    *sendEmail({ payload }, { call }) {
      yield call(sendEmailCaptcha, payload);
    },
    *sendMobile({ payload }, { call }) {
      yield call(sendMobileCaptcha, payload);
    },
  },
};
