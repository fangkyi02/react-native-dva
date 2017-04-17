import React, { PureComponent } from 'react'
import { BackAndroid } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
  TabView,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation'
import { connect } from 'dva'

import Login from './containers/Login'
import Home from './containers/Home'
import Account from './containers/Account'
import Detail from './containers/Detail'

const HomeNavigator = TabNavigator(
  {
    Home: { screen: Home},
    Account: { screen: Account},
  },
  {
    tabBarComponent: TabView.TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: true,
  },
)

const MainNavigator = StackNavigator(
  {
    HomeNavigator: { screen: HomeNavigator },
    Detail: { screen: Detail },
  },
  {
    headerMode: 'float',
  },
)

const AppNavigator = StackNavigator(
  {
    Main: { screen: MainNavigator },
    Login: { screen: Login },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
    },
  },
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  console.log('route.name',route.name);
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}
@connect(({ router }) => ({ router }))
class Router extends PureComponent {
  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  // 添加自定义Navigation
  render() {
    const { dispatch, router } = this.props
    const navigation = addNavigationHelpers({ dispatch, state: router })
    return <AppNavigator navigation={navigation} />
  }
}
// 重载函数
export function routerReducer(state, action = {}) {
  console.log('action, state',action, state);
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
