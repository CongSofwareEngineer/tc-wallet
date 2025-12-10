import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import ChainListServices from '@/services/chainList'
import { useQuery } from '@tanstack/react-query'
import { Assign, Chain, ChainFormatters } from 'viem'

const getData = async (): Promise<Assign<Chain<undefined>, Chain<ChainFormatters>>[]> => {
  try {
    const chainLists = await ChainListServices.getAllChains()

    return chainLists
  } catch {
    return []
  }
}

const useChainList = () => {
  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getChainList],
    queryFn: getData,
  })

  return data
}

export default useChainList
