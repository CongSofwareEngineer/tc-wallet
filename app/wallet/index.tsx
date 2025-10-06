import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SectionList, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import useAuth from '@/hooks/useAuth'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Wallet } from '@/types/wallet'
import AllWalletUtils from '@/utils/allWallet'
import { ellipsisText } from '@/utils/functions'
import PassPhase from '@/utils/passPhare'

import { styles } from './styles'

const WalletScreen = () => {
  const { wallets: walletList, addWallet, setWalletActive } = useWallets()
  const { colors, text } = useTheme()
  const { handleAuth } = useAuth()
  const router = useRouter()
  const { passPhase, addPassPhrase } = usePassPhrase()

  // Group wallets by mnemonic/pass phrase
  const groupedWallets = useMemo(() => {
    const groups = new Map<
      number,
      {
        indexMnemonic: number
        mnemonic: string
        wallets: (Wallet & {
          indexWallet: number
        })[]
      }
    >()

    walletList.forEach((wallet, index) => {
      if (!wallet.isDelete) {
        if (groups.has(wallet.indexMnemonic!)) {
          groups.get(wallet.indexMnemonic!)!.wallets.push({
            ...wallet,
            indexWallet: index,
          })
        } else {
          groups.set(wallet.indexMnemonic!, {
            indexMnemonic: wallet.indexMnemonic!,
            mnemonic: passPhase[wallet.indexMnemonic!] || 'Unknown',
            wallets: [
              {
                ...wallet,
                indexWallet: index,
              },
            ],
          })
        }
      }
    })

    return Array.from(groups.values()).sort((a, b) => a.indexMnemonic - b.indexMnemonic)
  }, [walletList, passPhase])

  // Flatten data for SectionList
  const sectionData = useMemo(() => {
    return groupedWallets.map((group) => ({
      title: `Seed Phrase ${group.indexMnemonic + 1}`,
      subtitle: ellipsisText(group.mnemonic, 6, 6),
      data: group.wallets,
      indexMnemonic: group.indexMnemonic,
      fullMnemonic: group.mnemonic,
    }))
  }, [groupedWallets])

  // Placeholder avatar generator (replace with your own if needed)
  const getAvatarColor = (seed: string = 'default') => {
    try {
      // Simple hash to color
      let hash = 0
      for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
      const c = (hash & 0x00ffffff).toString(16).toUpperCase()
      return '#' + '00000'.substring(0, 6 - c.length) + c
    } catch (error) {
      return '#000000'
    }
  }

  const handleCreateAccount = async (index: number = 0) => {
    const mnemonic = sectionData.find((s) => s.indexMnemonic === index)?.fullMnemonic
    const listWalletByMnemonic = walletList.filter((w) => w.indexMnemonic === index)
    const walletNew = await AllWalletUtils.createWalletFromPassPhrase(mnemonic as string, listWalletByMnemonic.length)
    walletNew.indexMnemonic = index
    addWallet(walletNew)
  }

  const handleCreateWalletAndPassPhrase = async () => {
    const mnemonic = await PassPhase.getMnemonic(passPhase.length)
    addPassPhrase(mnemonic)
    const walletNew = await AllWalletUtils.createWalletFromPassPhrase(mnemonic as string, 0)
    walletNew.indexMnemonic = passPhase.length
    addWallet(walletNew)
  }

  const handleActiveAccount = (index: number) => {
    setWalletActive(index)
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderScreen title={'Wallets'} />

      <View style={styles.tableHeader}>
        <ThemedText style={styles.headerCellLeft}>Wallet Name</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateWalletAndPassPhrase}>
          <AntDesign name='plus' size={20} color={colors.white} />
          <ThemedText style={styles.addButtonText}>Account</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {/* List */}
      <SectionList
        sections={sectionData}
        keyExtractor={(item) => item.address}
        renderItem={({ item, index }) => {
          const isActive = item.isDefault

          return (
            <TouchableOpacity
              style={[
                styles.row,
                isActive && {
                  backgroundColor: colors.gray2,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => handleActiveAccount(item.indexWallet)}
            >
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.address) }]} />
              {/* Name */}
              <View style={styles.nameText}>
                <ThemedText numberOfLines={1}>{item.name || `Account ${index + 1}`}</ThemedText>
                <ThemedText style={{ fontSize: 12 }}>{ellipsisText(item.address, 6, 8)}</ThemedText>
              </View>

              {/* Arrow */}
              <AntDesign
                onPress={() => {
                  router.push(`/wallet-detail/${item.indexWallet}`)
                }}
                name='right'
                size={18}
                color={text.color}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )
        }}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
              <ThemedText style={styles.sectionSubtitle}>{section.subtitle}</ThemedText>
            </View>
            <TouchableOpacity style={styles.addAccountButton} onPress={() => handleCreateAccount(section.indexMnemonic)}>
              <AntDesign name='plus' size={16} color={colors.blue} />
              <ThemedText style={styles.addAccountText}>Add</ThemedText>
            </TouchableOpacity>
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
