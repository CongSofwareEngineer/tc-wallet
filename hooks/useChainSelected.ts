import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { setChainSelected } from '@/redux/slices/chainSelected'
import { ChainId } from '@/types/web3'

const useChainSelected = () => {
  const chainId = useAppSelector((state) => state.chainSelected)
  const dispatch = useDispatch()

  const setChainId = (id: ChainId) => {
    dispatch(setChainSelected(id))
  }

  return { chainId, setChainId }
}

export default useChainSelected
