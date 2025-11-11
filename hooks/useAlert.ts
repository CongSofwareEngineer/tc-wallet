import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'

import { IsIos } from '@/constants/app'
import { closeAlert, MyAlert, openAlert } from '@/redux/slices/alertSlice'

export const useAlert = () => {
  const dispatch = useDispatch()

  const showAlert = useCallback(
    (alert: MyAlert) => {
      dispatch(openAlert({ duration: 1000, ...alert }))
    },
    [dispatch]
  )

  const showSuccess = useCallback(
    (text: string, duration = 1000) => {
      if (IsIos) {
        Alert.alert(text, text)
        return
      }
      dispatch(
        openAlert({
          text,
          duration,
        })
      )
    },
    [dispatch]
  )

  const showError = useCallback(
    (text: string, duration = 4000) => {
      dispatch(
        openAlert({
          text,
          duration,
        })
      )
    },
    [dispatch]
  )

  const showInfo = useCallback(
    (text: string, duration = 1000) => {
      dispatch(
        openAlert({
          text,
          duration,
        })
      )
    },
    [dispatch]
  )

  const hideAlert = useCallback(() => {
    dispatch(closeAlert())
  }, [dispatch])

  return {
    showAlert,
    showSuccess,
    showError,
    showInfo,
    hideAlert,
  }
}

export default useAlert
