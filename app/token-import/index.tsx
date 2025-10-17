import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { erc20Abi } from 'viem'

import HeaderScreen from '@/components/Header'
import MyImage from '@/components/MyImage'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { images } from '@/configs/images'
import useChainSelected from '@/hooks/useChainSelected'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import EVMServices from '@/services/EVM'
import { isAddress } from '@/utils/nvm'

import { getStyles } from './styles'

const TokenImportScreen = () => {
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenIcon, setTokenIcon] = useState('')

  const { isDark } = useMode()
  const { text, colorIcon } = useTheme()
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()
  const styles = getStyles(isDark)
  console.log({ placeholder: images.icons.placeholder, chainId })

  const handleImport = () => {
    // Handle import logic here
    router.back()
  }

  const handlePaste = async () => {
    const clipText = await Clipboard.getStringAsync()
    if (clipText && isAddress(clipText) && wallet) {
      const client = EVMServices.getClient(chainId)
      const [decimals, symbol, name, balanceOf, totalSupply] = await client.multicall({
        contracts: [
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
            args: [],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'symbol',
            args: [],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'name',
            args: [],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [wallet.address as `0x${string}`],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'totalSupply',
            args: [],
          },
        ],
      })
      console.log({ decimals, symbol, name, balanceOf, totalSupply })

      // const token: Partial<Token> = {
      //   token_address: clipText,
      //   decimals: decimals && decimals.status === 'success' ? (decimals.result as number) : 0,
      //   symbol: symbol && symbol.status === 'success' ? (symbol.result as string) : '0',
      //   name: name && name.status === 'success' ? (name.result as string) : '0',
      //   balance: balanceOf && balanceOf.status === 'success' ? (balanceOf.result as bigint).toString() : '0',
      //   balance_formatted:
      //     balanceOf && balanceOf.status === 'success' && decimals && decimals.status === 'success'
      //       ? convertWeiToBalance(balanceOf.result as bigint, decimals.result as number)
      //       : '0',
      //   total_supply: totalSupply && totalSupply.status === 'success' ? (totalSupply.result as bigint).toString() : '0',
      //   logo: images.icons.unknown, // Default icon, you might want to fetch a real one
      //   is_imported: true,
      // }
      if (decimals && decimals.status === 'success') {
        setTokenDecimals((decimals.result as number).toString())
      }
      if (symbol && symbol.status === 'success') {
        setTokenSymbol(symbol.result as string)
      }
      if (name && name.status === 'success') {
        setTokenName(name.result as string)
      }

      setTokenAddress(clipText)
    }
  }

  return (
    <View style={styles.container}>
      <HeaderScreen title='Import Token' />

      <ScrollView style={styles.content}>
        {/* Token Address Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Address</Text>
          <View style={styles.inputWrapper}>
            <ThemedInput
              noBorder
              style={styles.input}
              placeholder='Enter token contract address'
              value={tokenAddress}
              onChangeText={setTokenAddress}
            />
            <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
              <Feather name='clipboard' size={20} color={colorIcon.colorDefault} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Token Symbol Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Symbol</Text>
          <ThemedInput
            noBorder
            style={[styles.input, { flex: 1 }]}
            placeholder='Enter token symbol'
            value={tokenSymbol}
            onChangeText={setTokenSymbol}
          />
        </View>

        {/* Token Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Name</Text>
          <ThemedInput noBorder style={styles.input} placeholder='Enter token name' value={tokenName} onChangeText={setTokenName} />
        </View>

        {/* Token Decimals Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Decimals</Text>
          <ThemedInput
            noBorder
            style={styles.input}
            placeholder='Enter token decimals'
            value={tokenDecimals}
            onChangeText={setTokenDecimals}
            keyboardType='numeric'
          />
        </View>

        {/* Token Icon Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Icon URL</Text>
          <View style={styles.iconContainer}>
            <ThemedInput
              noBorder
              style={[styles.input, { flex: 1 }]}
              placeholder='Enter token icon URL'
              value={tokenIcon}
              onChangeText={setTokenIcon}
            />
            <MyImage src={images.icons.placeholder} style={styles.iconPreview} />
          </View>
        </View>
      </ScrollView>

      {/* Import Button */}
      <View style={styles.bottomContainer}>
        <ThemeTouchableOpacity style={styles.importButton} onPress={handleImport}>
          <Text style={styles.importButtonText}>Import Token</Text>
        </ThemeTouchableOpacity>
      </View>
    </View>
  )
}

export default TokenImportScreen
