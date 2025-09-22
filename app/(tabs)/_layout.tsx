import AntDesign from '@expo/vector-icons/AntDesign'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { COLORS, MODE } from '@/constants/style'
import useMode from '@/hooks/useMode'

import HomeScreen from './home'
import ManageConnectScreen from './manage-connect'
import SettingScreen from './setting'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  const { mode } = useMode()
  return (
    <Tab.Navigator
      initialRouteName='home'
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        tabBarActiveTintColor: mode === MODE.Dark ? COLORS.white : COLORS.black,
        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
        },
      }}
    >
      <Tab.Screen
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name='home' size={24} color={color} />,
        }}
        name='home'
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          title: 'Kết nối',
          tabBarIcon: ({ color }) => <AntDesign name='bars' size={24} color={color} />,
        }}
        name='manage-connect'
        component={ManageConnectScreen}
      />
      <Tab.Screen
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => <AntDesign name='setting' size={24} color={color} />,
        }}
        name='setting'
        component={SettingScreen}
      />
    </Tab.Navigator>
  )
}

export default TabNavigation
