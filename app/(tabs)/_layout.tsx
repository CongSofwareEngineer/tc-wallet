import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Tabs, usePathname } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Text, View } from 'react-native'

import { COLORS, MODE } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useRequestWC from '@/hooks/useReuestWC'
import useTheme from '@/hooks/useTheme'

const Tab = createBottomTabNavigator()

const TabBarLabel = ({
  title,
  nameIcon,
  url,
  isMaterialIcons = false,
}: {
  title: string
  nameIcon: string
  url: string
  isMaterialIcons?: boolean
}) => {
  const patchName = usePathname()
  const { text } = useTheme()
  const isPageCurrent = patchName === `/${url}` || (patchName === '/' && url === 'home')

  const getStyle = () => {
    if (isPageCurrent) {
      return {
        // shadowColor: '#00d4ff4d',
        // boxShadow: '0px 0px 5px 5px #00d4ff4d',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        gap: 5,

        // Visible rounded background on Android requires a backgroundColor
        // backgroundColor: '#00d4ff1a',
        // Shadows: iOS uses shadow*, Android uses elevation
        // shadowOpacity: 0.3,
        // shadowRadius: 1,
        // shadowOffset: { width: 0, height: 2 },
        // elevation: 1,
      }
    }
    return {
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 10,
      gap: 5,
    }
  }
  return (
    <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'center', padding: 5, opacity: isPageCurrent ? 1 : 0.7 }}>
      <View style={[getStyle() as any]}>
        {isMaterialIcons ? (
          <MaterialIcons name={nameIcon as any} size={20} color={text.color} />
        ) : (
          <AntDesign name={nameIcon as any} size={20} color={text.color} />
        )}
        <Text style={{ color: text.color, fontSize: 12 }}>{title}</Text>
      </View>
    </View>
  )
}

const TabNavigation = () => {
  const [isClient, setIsClient] = useState(false)
  const { mode } = useMode()
  const { translate } = useLanguage()
  const { requestWC } = useRequestWC()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const requestWCApprove = useMemo(() => {
    if (!isClient) {
      return 0
    }
    if (requestWC.length === 0) return 0
    return requestWC.filter((i) => i.type === 'request').length
  }, [requestWC, isClient])
  console.log({ requestWCApprove })

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: mode === MODE.Dark ? COLORS.white : COLORS.black,

        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',

          tabBarIcon: ({ color }) => <AntDesign size={16} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name='manage-connect'
        options={{
          title: 'Connect',
          tabBarIcon: ({ color }) => <AntDesign size={16} name='link' color={color} />,
        }}
      />

      <Tabs.Screen
        name='approve'
        options={{
          tabBarBadge: requestWCApprove > 0 ? requestWCApprove : undefined,
          title: 'Approve',
          tabBarIcon: ({ color }) => <AntDesign size={16} name='info-circle' color={color} />,
        }}
      />
      <Tabs.Screen
        name='setting'
        options={{
          title: 'Setting',
          tabBarIcon: ({ color }) => <AntDesign size={16} name='setting' color={color} />,
        }}
      />
    </Tabs>
  )

  // return (
  //   <Tab.Navigator
  //     initialRouteName='home'
  //     screenOptions={{
  //       animation: 'fade',
  //       headerShown: false,
  //       tabBarActiveTintColor: mode === MODE.Dark ? COLORS.white : COLORS.black,
  //       tabBarStyle: {
  //         height: 70,
  //         paddingBottom: 0,
  //         ...(mode === MODE.Dark
  //           ? {
  //             backgroundColor: '#1a1a24cc',
  //             borderColor: '#ffffff1a',
  //             borderTopWidth: 1,
  //           }
  //           : {}),
  //       },
  //     }}
  //   >
  //     <Tab.Screen
  //       options={{
  //         tabBarLabel: () => {
  //           return <TabBarLabel url='home' nameIcon='home' title={translate('homeScreen.titlePage')} />
  //         },
  //         tabBarIconStyle: {
  //           height: 0,
  //         },
  //         tabBarIcon: () => <></>,
  //       }}
  //       name='home'
  //       component={HomeScreen}
  //     />
  //     <Tab.Screen
  //       options={{
  //         tabBarLabel: () => {
  //           return <TabBarLabel url='manage-connect' nameIcon='bars' title='Kết nối' />
  //         },
  //         tabBarIconStyle: {
  //           height: 0,
  //         },
  //         tabBarIcon: () => <></>,
  //       }}
  //       name='manage-connect'
  //       component={ManageConnectScreen}
  //     />
  //     {isClient && (
  //       <Tab.Screen
  //         options={{
  //           tabBarLabel: () => {
  //             return <TabBarLabel url='approve' nameIcon='info-circle' title={'Duyệt'} />
  //           },
  //           tabBarIconStyle: {
  //             height: 0,
  //           },
  //           tabBarBadge: requestWCApprove > 0 ? requestWCApprove : undefined,
  //           tabBarIcon: () => <></>,
  //         }}
  //         name='approve'
  //         component={ApproveScreen}
  //       />
  //     )}

  //     <Tab.Screen
  //       options={{
  //         tabBarLabel: () => {
  //           return <TabBarLabel url='setting' nameIcon='setting' title={translate('setting.titlePage')} />
  //         },
  //         tabBarIconStyle: {
  //           height: 0,
  //         },
  //         tabBarIcon: () => <></>,
  //       }}
  //       name='setting'
  //       component={SettingScreen}
  //     />
  //   </Tab.Navigator>
  // )
}

export default TabNavigation
