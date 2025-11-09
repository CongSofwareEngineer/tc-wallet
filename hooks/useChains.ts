import { useMemo } from 'react'

import { CHAIN_DEFAULT } from '@/constants/chain'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  addNetwork as addNetworkSlice,
  removeNetwork as removeNetworkSlice,
  resetNetworks as resetNetworksSlice,
  updateNetworks as updateNetworksSlice,
} from '@/redux/slices/chainSlice'
import { ChainId, Network } from '@/types/web3'

const useChains = () => {
  const chains = useAppSelector((state) => state.chains)
  const chainIdCurrent = useAppSelector((state) => state.chainSelected)
  const dispatch = useAppDispatch()

  const chainCurrent = useMemo(() => {
    return chains.find((chain) => chain.id.toString() === chainIdCurrent.toString())
  }, [chains, chainIdCurrent])

  const chainsDefault = useMemo(() => {
    const arrChain = chains.filter((chain) => {
      return CHAIN_DEFAULT.findIndex((item) => item.id.toString() === chain.id.toString()) !== -1
    })
    return arrChain.sort((a, b) => {
      if (a.id.toString() === chainIdCurrent.toString()) {
        return -1
      }
      if (b.id.toString() === chainIdCurrent.toString()) {
        return 1
      }
      return 0
    })
  }, [chains, chainIdCurrent])

  const chainsCustom = useMemo(() => {
    const arrChain = chains.filter((chain) => {
      return CHAIN_DEFAULT.findIndex((item) => item.id.toString() === chain.id.toString()) === -1
    })
    return arrChain.sort((a, b) => {
      if (a.id.toString() === chainIdCurrent.toString()) {
        return -1
      }
      if (b.id.toString() === chainIdCurrent.toString()) {
        return 1
      }
      return 0
    })
  }, [chains, chainIdCurrent])

  const addNetwork = (network: Network) => {
    dispatch(addNetworkSlice(network))
  }

  const removeNetwork = (chainId: ChainId) => {
    dispatch(removeNetworkSlice(chainId))
  }

  const resetNetworks = () => {
    dispatch(resetNetworksSlice())
  }

  const updateNetworks = (network: Network) => {
    dispatch(updateNetworksSlice(network))
  }

  return {
    chainCurrent,
    chainList: chains,
    chainsCustom,
    chainsDefault,
    addNetwork,
    removeNetwork,
    resetNetworks,
    updateNetworks,
  }
}

export default useChains
