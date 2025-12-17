import AntDesign from '@expo/vector-icons/AntDesign'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ModalWarning from '@/components/ModalWarning'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import useAuth from '@/hooks/useAuth'
import useLanguage from '@/hooks/useLanguage'
import useModal from '@/hooks/useModal'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Wallet } from '@/types/wallet'
import { decodeData } from '@/utils/crypto'
import { copyToClipboard, ellipsisText } from '@/utils/functions'

import MyImage from '@/components/MyImage'
import { images } from '@/configs/images'
import { IsIos } from '@/constants/app'
import { width } from '@/utils/systems'
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'

const WalletDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { text } = useTheme()
  const { wallets, setWallets } = useWallets()
  const { passPhase } = usePassPhrase()
  const { handleAuth } = useAuth()
  const { closeModal, openModal } = useModal()
  const { translate } = useLanguage()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showPassPhrase, setShowPassPhrase] = useState(false)

  const walletSelected: Wallet & { passPhrase: string } = useMemo(() => {
    const walletCurrent = wallets[parseInt(id || '0')]
    const passPhraseWallet = walletCurrent?.indexMnemonic !== undefined ? passPhase[walletCurrent.indexMnemonic] : ''
    return {
      ...walletCurrent,
      passPhrase: passPhraseWallet,
    }
  }, [wallets, passPhase, id])

  useEffect(() => {
    const getData = async () => {
      setEditName(walletSelected?.name || '')
      const pKey = await decodeData(walletSelected?.privateKey || '')

      setPrivateKey(pKey)
    }

    if (walletSelected) {
      getData()
    }
  }, [walletSelected])

  const getAvatarColor = (seed: string) => {
    try {
      let hash = 0
      for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
      const c = (hash & 0x00ffffff).toString(16).toUpperCase()
      return '#' + '00000'.substring(0, 6 - c.length) + c
    } catch (error) {
      return '#000000'
    }
  }

  const handleSaveName = () => {
    const walletIndex = parseInt(id || '0')
    const updatedWallets = [...wallets]
    updatedWallets[walletIndex] = { ...updatedWallets[walletIndex], name: editName }
    setWallets(updatedWallets)
    setIsEditing(false)
  }

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text)
  }

  const handleShowPrivateKey = async () => {
    setShowPrivateKey(!showPrivateKey)
  }

  const handleShowPassPhrase = async () => {
    setShowPassPhrase(!showPassPhrase)
  }

  const handleDeleteAccount = () => {
    const callback = async () => {
      const walletIndex = parseInt(id || '0')
      const updatedWallets = [...wallets]
      updatedWallets[walletIndex] = { ...updatedWallets[walletIndex], isDelete: true }
      setWallets(updatedWallets)
      closeModal()
      router.replace('/wallet')
    }

    openModal({
      showIconClose: false,
      maskClosable: false,
      content: <ModalWarning onConfirm={callback} />,
    })
  }

  const renderAvatar = () => {
    return (
      <View style={styles.header}>
        <View style={{ position: 'relative' }}>
          {!walletSelected?.avatar ? (
            <MyImage src={images.icons.placeholder} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(walletSelected?.address) }]} />
          )}
          <View style={{ position: 'absolute', bottom: width(11) - 10, right: width(11) - 10, backgroundColor: 'rgba(1, 1, 1, 0.5)' }}>
            <TouchableOpacity>
              <AntDesign name='edit' size={20} color={text.color} />
            </TouchableOpacity>
          </View>
        </View>
        <ThemedText style={styles.headerTitle}>{walletSelected?.name || `Account ${parseInt(id || '0') + 1}`}</ThemedText>
        <ThemedText style={styles.headerTitle}>{translate('walletDetail.title')}</ThemedText>
      </View>
    )
  }

  if (walletSelected) {
    return (
      <View style={{ flex: 1 }}>
        <HeaderScreen title={walletSelected?.name || `Account ${parseInt(id || '0') + 1}`} />
        <ScrollView style={[styles.container]}>
          {/* Header with Avatar */}
          {renderAvatar()}

          {/* Account Name Section */}
          <View style={styles.section}>
            <View style={styles.row}>
              {!isEditing && <ThemedText style={styles.label}>{translate('walletDetail.name')}</ThemedText>}
              {isEditing ? (
                <View style={styles.editRow}>
                  <ThemedInput value={editName} onChangeText={setEditName} style={styles.input} placeholder='Tên tài khoản' />
                  <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                    <AntDesign name='check' size={16} color='#22C55E' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                    <AntDesign name='close' size={16} color='#EF4444' />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.valueRow}>
                  <ThemedText style={styles.value}>{editName}</ThemedText>
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <AntDesign name='edit' size={16} color={text.color} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Account Address Section */}
          <View style={styles.section}>
            <View style={styles.row}>
              <ThemedText style={styles.label}>{translate('walletDetail.address')}</ThemedText>
              <TouchableOpacity style={styles.valueRow} onPress={() => handleCopy(walletSelected.address, translate('walletDetail.address'))}>
                <ThemedText style={styles.addressValue} numberOfLines={1}>
                  {ellipsisText(walletSelected.address, 4, 6)} <Ionicons name='copy-outline' size={16} color={text.color} />
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wallet Type Section */}
          <View style={styles.section}>
            <View style={styles.row}>
              <ThemedText style={styles.label}>{translate('walletDetail.walletType')}</ThemedText>
              <View style={styles.valueRow}>
                <ThemedText numberOfLines={1} style={styles.value}>
                  {walletSelected?.indexMnemonic === -1 ? translate('walletDetail.imported') : translate('walletDetail.mnemonic')}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Private Key Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={handleShowPrivateKey}>
              <ThemedText style={styles.label}>{translate('walletDetail.privateKey')}</ThemedText>
              <AntDesign name='right' size={16} color={text.color} />
            </TouchableOpacity>
            {showPrivateKey && (
              <TouchableOpacity style={styles.hiddenContent} onPress={() => handleCopy(privateKey, translate('walletDetail.privateKey'))}>
                <ThemedText style={styles.hiddenText}>
                  {privateKey}{' '}
                  <Ionicons style={{ position: 'relative', top: 4, paddingHorizontal: 2 }} name='copy-outline' size={14} color={text.color} />
                  {!IsIos && <View style={{ width: '100%' }} />}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Pass Phrase Section */}
          {walletSelected.passPhrase && (
            <View style={styles.section}>
              <TouchableOpacity style={styles.row} onPress={handleShowPassPhrase}>
                <ThemedText style={styles.label}>{translate('walletDetail.seedPhrase')}</ThemedText>
                <AntDesign name='right' size={16} color={text.color} />
              </TouchableOpacity>
              {showPassPhrase && (
                <TouchableOpacity style={styles.hiddenContent} onPress={() => handleCopy(walletSelected.passPhrase, translate('walletDetail.seedPhrase'))}>
                  <ThemedText style={styles.hiddenText} selectable>
                    {walletSelected.passPhrase}{' '}
                    <Ionicons style={{ position: 'relative', top: 4, paddingHorizontal: 4 }} name='copy-outline' size={14} color={text.color} />
                    {!IsIos && <View style={{ width: '100%' }} />}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Delete Account Section */}
          <View style={[styles.section, styles.dangerSection, { marginBottom: 40 }]}>
            <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
              <ThemedText style={[styles.label, styles.dangerText]}>{translate('walletDetail.delete')}</ThemedText>
              <AntDesign name='delete' size={16} color='#EF4444' />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
  return <></>
}

export default WalletDetailScreen
