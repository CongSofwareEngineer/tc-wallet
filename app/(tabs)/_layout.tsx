import AntDesign from '@expo/vector-icons/AntDesign'
import { Tabs } from 'expo-router'

import { COLORS } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'

const TabNavigation = () => {
  const { isDark } = useMode()
  const { translate } = useLanguage()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? COLORS.green600 : COLORS.black,

        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
          backgroundColor: '#1d1d1d',
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: translate('common.home'),

          tabBarIcon: ({ color }) => <AntDesign size={16} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name='manage-connect'
        options={{
          title: translate('manageConnect.title'),
          tabBarIcon: ({ color }) => <AntDesign size={16} name='link' color={color} />,
        }}
      />

      <Tabs.Screen
        name='setting'
        options={{
          title: translate('setting.titlePage'),
          tabBarIcon: ({ color }) => <AntDesign size={16} name='setting' color={color} />,
        }}
      />
    </Tabs>
  )
}

export default TabNavigation
