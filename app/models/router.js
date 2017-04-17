import { delay, NavigationActions } from '../utils'
import { routerReducer } from '../router'

const actions = [
  NavigationActions.BACK,
  NavigationActions.INIT,
  NavigationActions.NAVIGATE,
  NavigationActions.RESET,
  NavigationActions.SET_PARAMS,
  NavigationActions.URI,
]

export default {
  namespace: 'router',
  state: {
    ...routerReducer(),
  },
  reducers: {
    apply(state, { payload: action }) {
      console.log('state',state);
      console.log('router输出1',action);
      return routerReducer(state, action)
    },
  },
  effects: {
    watch: [
      function* watch({ take, call, put }) {
        const loop = true
        while (loop) {
          console.log('actions',actions);
          const payload = yield take(actions)
          console.log('payload',payload);
          yield put({
            type: 'apply',
            payload,
          })
          // debounce, see https://github.com/react-community/react-navigation/issues/271
          if (payload.type === 'Navigation/NAVIGATE') {
            yield call(delay, 250)
          }
        }
      },
      { type: 'watcher' },
    ],
  },
}
