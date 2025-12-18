import { ERROR_TYPE } from '@/constants/erros'
import useLanguage from './useLanguage'

const useErrorWeb3 = () => {
  const { translate } = useLanguage()

  const getError = (error?: any) => {
    try {
      let message: string = ''
      if (typeof error === 'string') {
        message = error
      }

      if (error?.message) {
        message = error.message
      } else {
        if (error?.error) {
          message = error.error
        } else {
          message = JSON.stringify(error)
        }
      }

      switch (true) {
        case message.includes('insufficient funds for gas * price + value'):
        case message.includes('insufficient balance for amount'):
        case message.includes('Missing or invalid parameters'):
        case message.includes('total cost (gas * gas fee + value)'):
        case message.includes(ERROR_TYPE.InsufficientFunds):
          return translate('errorWeb3.insufficientFunds')
        case message.includes('User rejected the request'):
        case message.includes(ERROR_TYPE.UserRejected):
          return translate('errorWeb3.userRejected')
        case message.includes('Transaction was not mined within 750 seconds'):
        case message.includes(ERROR_TYPE.TransactionTimeout):
          return translate('errorWeb3.transactionTimeout')
        case message.includes('replacement transaction underpriced'):
          return translate('errorWeb3.transactionUnderpriced')

        default:
          return translate('somethingWentWrong')
      }
    } catch (error) {
      return translate('somethingWentWrong')
    }
  }

  return { getError }
}

export default useErrorWeb3
