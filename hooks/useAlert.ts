import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

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
    (alert: MyAlert) => {
      dispatch(
        openAlert({
          ...alert,
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
