import { createAction, NavigationActions } from '../utils'
import * as authService from '../services/auth'

export default {
  namespace: 'app',
  state: {
    fetching: false,
    login: false,
  },
  reducers: {
    loginStart(state, { payload }) {
      console.log('输出state',state);
      console.log('输出payload',payload);
      return { ...state, ...payload }
    },
    loginEnd(state, { payload }) {
      console.log('输出结束state',state);
      console.log('输出结束payload',payload);
      return { ...state, ...payload }
    },
  },
  effects: {
    * login({ payload }, { call, put }) {
      console.log('输出put',put);
      yield put(
        createAction('loginStart')({
          fetching: true,
        }),
      )
      const login = yield call(authService.login, payload)
      if (login) {
        yield put(
          NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          }),
        )
      }
      yield put(
        createAction('loginEnd')({
          login,
          fetching: false,
        }),
      )
    },
  },
}
