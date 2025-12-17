import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import ModalWarning from '@/components/ModalWarning'
import ThemedText from '@/components/UI/ThemedText'
import { PADDING_DEFAULT } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useModal from '@/hooks/useModal'
import { useAppSelector } from '@/redux/hooks'
import WalletKit from '@/utils/walletKit'

import ListConnect from './Components/ListConnect'
import styles from './styles'

const ManageConnectScreen = () => {
  const sessions = useAppSelector((state) => state.sessions)
  const { translate } = useLanguage()

  const router = useRouter()
  const { openModal } = useModal()

  const handleDisconnectAll = async () => {
    const callback = async () => {
      await WalletKit.sessionDeleteAll()
    }
    openModal({
      content: <ModalWarning onConfirm={callback} />,
      maskClosable: false,
      showIconClose: false,
    })
  }

  return (
    <View style={{ flex: 1, padding: PADDING_DEFAULT.Padding16, gap: 30 }}>
      <View style={[styles.container]}>
        <View style={[styles.containerHeader]}>
          <ThemedText type='subtitle'> </ThemedText>

          <ThemedText type='subtitle'>{translate('manageConnect.title')}</ThemedText>
          <TouchableOpacity onPress={() => router.push('/connect-dapp')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <AntDesign name='plus-circle' size={20} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {Object.keys(sessions || {}).length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText style={{ textAlign: 'center', color: '#888' }}>{translate('manageConnect.empty')}</ThemedText>
        </View>
      ) : (
        <>
          <ListConnect />
        </>
      )}
    </View>
  )
}

export default ManageConnectScreen
