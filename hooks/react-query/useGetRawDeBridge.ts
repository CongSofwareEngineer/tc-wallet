import fetcher from "@/configs/fetcher"
import { ACCESS_TOKEN, ADDRESS_AFFILIATE, AFFILIATE_FEE_PERCENT, BRIDE_API, REFERRAL_CODE } from "@/constants/debridge"
import { KEY_REACT_QUERY } from "@/constants/reactQuery"
import { Token } from "@/services/moralis/type"
import { IQueryKey } from "@/types/reactQuery"
import { ChainId } from "@/types/web3"
import { convertBalanceToWei, lowercase, stringifyBigInt } from "@/utils/functions"
import { useQuery } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import useChainSelected from "../useChainSelected"
import useWallets from "../useWallets"

type Props = {
  tokenIn?: Token,
  tokenOut?: Token,
  amountIn?: string,
  slippage?: number,
  chainIdOut?: ChainId,
}

type Data = {
  amountIn: string
  amountOut: string
  minAmountOut: string
  affiliateFee: string
  protocolFee: string
  estimatedTransactionFee: {
    total: string
    details: {
      gasLimit: string
      gasPrice: string
    }
    approximateUsdValue: number
  }
  tx: {
    data: `0x${string}`
    to: `0x${string}`
    value: string
  }
}
const getData = async ({ queryKey }: IQueryKey): Promise<Data> => {
  const [_, tokenIn, tokenOut, amountIn, slippage, chainIdIn, chainIdOut, userAddress] = queryKey as [string, Token, Token, string, number, ChainId, ChainId, string]
  const isCrossChain = chainIdOut?.toString() !== chainIdIn?.toString()
  if (isCrossChain) {
    const res = await fetcher({
      url: `${BRIDE_API.DLN_API}/v1.0/chain/transaction`,
      query: {
        srcChainId: chainIdIn,
        srcChainTokenIn: tokenIn.token_address,
        srcChainTokenInAmount: convertBalanceToWei(amountIn, tokenIn.decimals! as number),
        dstChainId: chainIdOut,
        dstChainTokenOut: tokenOut.token_address,
        dstChainTokenOutRecipient: userAddress,
        srcChainOrderAuthorityAddress: userAddress,
        dstChainOrderAuthorityAddress: userAddress,
        affiliateFeePercent: AFFILIATE_FEE_PERCENT,
        affiliateFeeRecipient: ADDRESS_AFFILIATE,
        referralCode: REFERRAL_CODE,
        accesstoken: ACCESS_TOKEN
      }
    })

    return {
      amountIn,
      amountOut: res?.data?.tokenOut?.amount,
      minAmountOut: res?.data?.tokenOut?.minAmount,
      affiliateFee: BigNumber(AFFILIATE_FEE_PERCENT).times(amountIn).div(100).toFixed(),
      protocolFee: '0',
      estimatedTransactionFee: res?.data?.estimatedTransactionFee,
      tx: res?.data?.tx as {
        data: `0x${string}`
        to: `0x${string}`
        value: string
      },
    }

  } else {
    const res = await fetcher({
      url: `${BRIDE_API.DLN_API}/v1.0/chain/transaction`,
      query: {
        chainId: chainIdIn,
        tokenIn: tokenIn.token_address,
        tokenInAmount: convertBalanceToWei(amountIn, tokenIn.decimals! as number),
        slippage,
        tokenOut: tokenOut.token_address,
        tokenOutRecipient: userAddress,
        affiliateFeeRecipient: ADDRESS_AFFILIATE,
        affiliateFeePercent: AFFILIATE_FEE_PERCENT,
        accesstoken: ACCESS_TOKEN
      },
      showError: false,
    })

    return {
      amountIn,
      amountOut: res?.data?.tokenOut?.amount,
      minAmountOut: res?.data?.tokenOut?.minAmount,
      affiliateFee: BigNumber(AFFILIATE_FEE_PERCENT).times(amountIn).div(100).toFixed(),
      protocolFee: '0',
      estimatedTransactionFee: res?.data?.estimatedTransactionFee,
      tx: res?.data?.tx as {
        data: `0x${string}`
        to: `0x${string}`
        value: string
      },
    }
  }

}

const useGetRawDeBridge = ({ tokenIn, tokenOut, chainIdOut, amountIn, slippage }: Props) => {
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()

  const isPareToken = useMemo(() => {
    return lowercase(tokenIn?.token_address) === lowercase(tokenOut?.token_address)
  }, [tokenIn, tokenOut])

  const data = useQuery({
    queryKey: [KEY_REACT_QUERY.getRawDeBridge, stringifyBigInt(tokenIn), stringifyBigInt(tokenOut), amountIn?.toString(), slippage, chainId, chainIdOut, wallet?.address],
    queryFn: getData,
    enabled: !!tokenIn && !!tokenOut && Number(amountIn || '0') > 0 && !!slippage && !!chainId && !!chainIdOut && !!wallet?.address && !isPareToken,
    refetchInterval: 15 * 1000, //15s
  })

  return data
}

export default useGetRawDeBridge
