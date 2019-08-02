import { createStackNavigator } from 'react-navigation'

import Splash from '../components/Splash';
import Home from '../components/Home';
import AddUser from '../components/AddUser';
import DetailBalance from '../components/DetailBalance';

const AppNavigator = createStackNavigator({
	Splash: Splash,
	Home: Home,
	AddUser: AddUser,
	DetailBalance: DetailBalance,
},
	{
		initialRouteName: 'Splash',
		headerMode: 'none',
	})

export { AppNavigator }