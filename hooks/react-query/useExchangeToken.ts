import { isTokenNative } from '@/utils/nvm'

import fetcher from '@/configs/fetcher'
import { ADDRESS_AFFILIATE, AFFILIATE_FEE_PERCENT, BRIDE_API, REFERRAL_CODE } from '@/constants/debridge'
import { KEY_REACT_QUERY } from '@/constants/reactQuery'
import { Token } from '@/services/moralis/type'
import { ChainId } from '@/types/web3'
import { convertBalanceToWei, stringifyBigInt } from '@/utils/functions'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { zeroAddress } from 'viem'
import useChainSelected from '../useChainSelected'

const getTokenAddress = (token: Token) => {
  return isTokenNative(token.token_address!) ? zeroAddress : token.token_address
}

export default function useExchangeToken({
  amountIn,
  tokenIn,
  tokenOut,
  slippage,
  userAddress,
  chainIdOut,
  isCrossChain,
}: {
  tokenIn: Token
  tokenOut?: Token
  amountIn: string
  slippage: string
  userAddress?: string
  chainIdOut?: ChainId
  isCrossChain?: boolean
}) {
  const { chainId } = useChainSelected()

  return useQuery({
    queryKey: [KEY_REACT_QUERY.getExchangeToken, stringifyBigInt(tokenIn), stringifyBigInt(tokenOut), amountIn, slippage, userAddress, chainId, chainIdOut],
    queryFn: async ({ queryKey }) => {
      const [, tokenIn, tokenOut, amountIn, slippage, userAddress, chainId, chainIdOut] = queryKey as [
        string,
        Token,
        Token,
        string,
        string,
        string,
        ChainId,
        ChainId,
      ]

      if (chainId === chainIdOut) {
        // Single chain
        const res = await fetcher({
          url: `${BRIDE_API.DLN_API}/v1.0/chain/transaction`,
          query: {
            chainId: chainId,
            tokenIn: getTokenAddress(tokenIn),
            tokenInAmount: convertBalanceToWei(amountIn, tokenIn.decimals! as number),
            slippage,
            tokenOut: getTokenAddress(tokenOut),
            tokenOutRecipient: userAddress,
            affiliateFeeRecipient: ADDRESS_AFFILIATE,
            affiliateFeePercent: AFFILIATE_FEE_PERCENT,
          },
          showError: false,
        })

        if (res?.data?.errorMessage) {
          throw Error(res?.data?.errorMessage)
        }

        return {
          amountIn,
          amountOut: res?.data?.tokenOut?.amount,
          minAmountOut: res?.data?.tokenOut?.minAmount,
          affiliateFee: BigNumber(AFFILIATE_FEE_PERCENT).times(amountIn).div(100).toFixed(),
          protocolFee: '0',
          tx: res?.data?.tx as {
            data: `0x${string}`
            to: `0x${string}`
            value: string
          },
        }
      } else {
        // Cross chain
        const res = await fetcher<{
          fixFee?: string
          tx?: any
          estimation?: {
            dstChainTokenOut?: {
              amount?: string
            }
            recommendedAmount?: string
          }
          errorMessage?: string
        }>({
          url: `${BRIDE_API.DLN_API}/v1.0/dln/order/create-tx`,
          query: {
            srcChainId: chainId,
            srcChainTokenIn: getTokenAddress(tokenIn),
            srcChainTokenInAmount: convertBalanceToWei(amountIn, tokenIn.decimals! as number),
            dstChainId: chainIdOut,
            dstChainTokenOut: getTokenAddress(tokenOut),
            dstChainTokenOutRecipient: userAddress,
            srcChainOrderAuthorityAddress: userAddress,
            dstChainOrderAuthorityAddress: userAddress,
            affiliateFeePercent: AFFILIATE_FEE_PERCENT,
            affiliateFeeRecipient: ADDRESS_AFFILIATE,
            referralCode: REFERRAL_CODE,
          },
          showError: false,
        })

        if (res?.data?.errorMessage) {
          throw Error(res?.data?.errorMessage)
        }
        return {
          amountIn,
          amountOut: res?.data?.estimation?.dstChainTokenOut?.amount,
          minAmountOut: res?.data?.estimation?.recommendedAmount,
          protocolFee: res?.data?.fixFee,
          tx: res?.data?.tx as {
            data: `0x${string}`
            to: `0x${string}`
            value: string
          },
          affiliateFee: BigNumber(AFFILIATE_FEE_PERCENT).times(amountIn).div(100).toFixed(),
        }
      }
    },
    retry: false,
    enabled:
      !!tokenIn &&
      !!tokenOut &&
      !!amountIn &&
      !!slippage &&
      !!userAddress &&
      BigNumber(amountIn || 0).gt(0) &&
      BigNumber(slippage || 0).gt(0) &&
      BigNumber(slippage || 0).lte(50) &&
      tokenIn &&
      tokenOut &&
      (isCrossChain ? true : tokenIn?.token_address !== tokenOut?.token_address),
  })
}
