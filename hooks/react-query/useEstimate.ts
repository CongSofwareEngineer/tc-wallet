import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'

import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import EVMServices from '@/services/EVM'
import { IQueryKey } from '@/types/reactQuery'
import { ChainId, RawTransactionEVM } from '@/types/web3'
import { convertWeiToBalance } from '@/utils/functions'

import useChainSelected from '../useChainSelected'

const estimateGasEVM = async ({ queryKey }: IQueryKey) => {
  try {
    const transaction = queryKey[1] as RawTransactionEVM
    const chainId = queryKey[2] as ChainId
    const raw = { ...transaction, chainId } as any

    const [gasPrice, estimatedGas] = await Promise.all([EVMServices.getGasPrice(chainId, 1.5), EVMServices.estimateGas(raw)])

    const totalFee = convertWeiToBalance(BigNumber(estimatedGas.toString()).multipliedBy(gasPrice.toString()).toFixed(), 18)
    const totalFeeUpToHight = BigNumber(totalFee).multipliedBy(1.2).toFixed() // add 20% buffer

    return {
      totalFee: totalFeeUpToHight,
      gasPrice: convertWeiToBalance(gasPrice.toString(), 18),
      estimatedGas: estimatedGas.toString(),
    }
  } catch (error: any) {
    return {
      error: error?.message || 'Error estimating gas',
    }
  }
}

const useEstimateGas = (transaction?: RawTransactionEVM | null) => {
  const { chainId } = useChainSelected()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [KEY_REACT_QUERY.getEstimateGas, transaction, chainId],
    queryFn: estimateGasEVM,
    enabled: !!transaction,
  })

  return { data, isLoading, refetch }
}

export default useEstimateGas
