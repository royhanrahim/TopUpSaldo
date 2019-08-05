import { createStackNavigator } from 'react-navigation'

import Splash from '../components/Splash';
import Home from '../components/Home';
import AddUser from '../components/AddUser';
import DetailBalance from '../components/DetailBalance';
import ListOrder from '../components/ListOrder';

const AppNavigator = createStackNavigator({
	Splash: Splash,
	Home: Home,
	AddUser: AddUser,
	DetailBalance: DetailBalance,
	ListOrder: ListOrder,
},
	{
		initialRouteName: 'Splash',
		headerMode: 'none',
	})

export { AppNavigator }