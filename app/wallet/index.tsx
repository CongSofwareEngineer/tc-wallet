import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { SectionList, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ModalLoading from '@/components/ModalLoading'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import useAuth from '@/hooks/useAuth'
import useModal from '@/hooks/useModal'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Wallet } from '@/types/wallet'
import AllWalletUtils from '@/utils/allWallet'
import { ellipsisText, getRadomColor, sleep } from '@/utils/functions'
import PassPhase from '@/utils/passPhare'

import { styles } from './styles'

const WalletScreen = () => {
  const { wallets: walletList, addWallet, setWalletActive } = useWallets()
  const { colors, text } = useTheme()
  const { handleAuth } = useAuth()
  const router = useRouter()
  const { passPhase, addPassPhrase } = usePassPhrase()
  const { closeModal, openModal } = useModal()
  // wallets available in state

  const [showData, setShowData] = useState(false)

  // Group wallets by mnemonic/pass phrase and collect imported accounts (index* === -1)
  const sectionData = useMemo(() => {
    type WalletRow = Wallet & { indexWallet: number }
    type Section = {
      title: string
      subtitle?: string
      data: WalletRow[]
      indexMnemonic?: number
      fullMnemonic?: string
      isImported?: boolean
    }

    const groups = new Map<
      number,
      {
        indexMnemonic: number
        mnemonic: string
        wallets: WalletRow[]
      }
    >()
    const imported: WalletRow[] = []

    walletList.forEach((wallet, index) => {
      if (wallet.isDelete) return

      const isImported = wallet.indexAccountMnemonic === -1 || wallet.indexMnemonic === -1

      if (isImported) {
        imported.push({ ...wallet, indexWallet: index })
        return
      }

      const key = wallet.indexMnemonic!
      if (groups.has(key)) {
        groups.get(key)!.wallets.push({ ...wallet, indexWallet: index })
      } else {
        groups.set(key, {
          indexMnemonic: key,
          mnemonic: passPhase[key] || 'Unknown',
          wallets: [{ ...wallet, indexWallet: index }],
        })
      }
    })

    const sections: Section[] = []

    if (imported.length > 0) {
      sections.push({
        title: 'Imported Accounts',
        data: imported,
        isImported: true,
      })
    }

    const grouped = Array.from(groups.values()).sort((a, b) => a.indexMnemonic - b.indexMnemonic)
    for (const group of grouped) {
      sections.push({
        title: `Seed Phrase ${group.indexMnemonic + 1}`,
        subtitle: group.mnemonic,
        data: group.wallets,
        indexMnemonic: group.indexMnemonic,
        fullMnemonic: group.mnemonic,
      })
    }

    return sections
  }, [walletList, passPhase])

  // Placeholder avatar generator (replace with your own if needed)

  const handleCreateAccount = async (index: number = 0) => {
    openModal({
      maskClosable: false,
      showIconClose: false,
      content: <ModalLoading />,
    })
    await sleep(1000)

    const mnemonic = sectionData.find((s) => s.indexMnemonic === index)?.fullMnemonic
    const listWalletByMnemonic = walletList.filter((w) => w.indexMnemonic === index)
    const walletNew = await AllWalletUtils.createWalletFromPassPhrase(mnemonic as string, listWalletByMnemonic.length)
    walletNew.indexMnemonic = index
    addWallet(walletNew)
    closeModal()
  }

  const handleCreateWalletAndPassPhrase = async () => {
    openModal({
      maskClosable: false,
      showIconClose: false,
      content: <ModalLoading />,
    })
    await sleep(1000)
    const mnemonic = await PassPhase.getMnemonic(passPhase.length)
    addPassPhrase(mnemonic)
    const walletNew = await AllWalletUtils.createWalletFromPassPhrase(mnemonic as string, 0)
    walletNew.indexMnemonic = passPhase.length
    addWallet(walletNew)
    closeModal()
  }

  const handleActiveAccount = (index: number) => {
    setWalletActive(index)
  }

  const handleShowData = async () => {
    try {
      if (showData) {
        setShowData(false)
        return
      }
      const isAuth = await handleAuth()
      if (isAuth) {
        setShowData(true)
      }
    } catch {
      // ignore
    }
  }

  const handleDetailAccount = async (indexWallet: number) => {
    try {
      if (showData) {
        router.push(`/wallet-detail/${indexWallet}`)
      } else {
        const isAuth = await handleAuth()
        if (isAuth) {
          router.push(`/wallet-detail/${indexWallet}`)
        }
      }
    } catch {
      // ignore
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderScreen title={'Wallets'} />

      <View style={[styles.tableHeader, { gap: GAP_DEFAULT.Gap8 }]}>
        <ThemedText style={styles.headerCellLeft}>Wallet Name</ThemedText>
        <ThemeTouchableOpacity type='default' style={styles.addButton} onPress={handleCreateWalletAndPassPhrase}>
          <AntDesign name='plus' size={20} color={colors.white} />
          {/* <ThemedText style={styles.addButtonText}>Account</ThemedText> */}
        </ThemeTouchableOpacity>
        <ThemeTouchableOpacity type='default' style={styles.addButton} onPress={() => router.push('/import-account')}>
          <AntDesign name='import' size={20} color={colors.white} />
          {/* <ThemedText style={styles.addButtonText}>Account</ThemedText> */}
        </ThemeTouchableOpacity>
      </View>
      <View style={styles.separator} />
      {/* List */}
      <SectionList
        sections={sectionData}
        keyExtractor={(item) => item.address}
        renderItem={({ item, index }) => {
          const isActive = item.isDefault

          return (
            <ThemeTouchableOpacity
              type='text'
              style={[
                styles.row,
                isActive && {
                  backgroundColor: colors.gray2,
                },
                {
                  paddingVertical: PADDING_DEFAULT.Padding16,
                },
              ]}
              activeOpacity={0.7}
            >
              {/* Avatar */}
              <ThemeTouchableOpacity type='text' onPress={() => handleActiveAccount(item.indexWallet)}>
                {/* <AntDesign name='wallet' size={30} color={colors.white} /> */}
                <View style={[styles.avatar, { backgroundColor: getRadomColor(item.address) }]} />
              </ThemeTouchableOpacity>
              {/* Name */}
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <ThemeTouchableOpacity type='text' onPress={() => handleActiveAccount(item.indexWallet)}>
                  <View>
                    <ThemedText numberOfLines={1}>{item.name || `Account ${index + 1}`}</ThemedText>
                    <ThemedText style={{ fontSize: 12 }}>{ellipsisText(item.address, 6, 8)}</ThemedText>
                  </View>
                </ThemeTouchableOpacity>
                <View style={{ flex: 1 }} />
              </View>

              {/* Arrow */}
              <ThemeTouchableOpacity type='text' onPress={() => handleDetailAccount(item.indexWallet)}>
                <AntDesign name='right' size={18} color={text.color} style={{ marginLeft: 8 }} />
              </ThemeTouchableOpacity>
            </ThemeTouchableOpacity>
          )
        }}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
              {!section.isImported && (
                <>
                  {showData ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
                      <ThemedText style={styles.sectionSubtitle}>{ellipsisText(section.subtitle as string, 6, 8)}</ThemedText>
                      <ThemeTouchableOpacity type='text' onPress={handleShowData}>
                        <AntDesign name='eye-invisible' size={16} color={text.color} />
                      </ThemeTouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
                      <ThemedText style={styles.sectionSubtitle}>******************</ThemedText>
                      <ThemeTouchableOpacity type='text' onPress={handleShowData}>
                        <AntDesign name='eye' size={16} color={text.color} />
                      </ThemeTouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
            {!section.isImported && (
              <ThemeTouchableOpacity type='text' style={styles.addAccountButton} onPress={() => handleCreateAccount(section.indexMnemonic!)}>
                <AntDesign name='plus' size={16} color={colors.blue} />
                <ThemedText style={styles.addAccountText}>Add</ThemedText>
              </ThemeTouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <ThemedText>Chưa có ví nào</ThemedText>
          </View>
        }
        contentContainerStyle={{ padding: 0 }}
        style={{ flex: 1 }}
      />
    </View>
  )
}

export default WalletScreen
