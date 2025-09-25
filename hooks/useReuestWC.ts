import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { removeRequestWC, RequestWC, setRequestWC } from '@/redux/slices/requestWC'

const useRequestWC = () => {
  const dispatch = useDispatch()
  const requestWC = useAppSelector((state) => state.requestWC)

  const setRequest = (data: RequestWC) => {
    dispatch(setRequestWC(data))
  }

  const removeRequest = (id: number) => {
    dispatch(removeRequestWC(id))
  }

  return {
    requestWC,
    setRequest,
    removeRequest,
  }
}

export default useRequestWC
