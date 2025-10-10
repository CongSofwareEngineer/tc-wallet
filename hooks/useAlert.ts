import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { closeAlert, MyAlert, openAlert } from '@/redux/slices/alertSlice'

export const useAlert = () => {
  const dispatch = useDispatch()

  const showAlert = useCallback(
    (alert: MyAlert) => {
      dispatch(openAlert({ duration: 3000, ...alert }))
    },
    [dispatch]
  )

  const showSuccess = useCallback(
    (text: string, duration = 3000) => {
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
    (text: string, duration = 3000) => {
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
