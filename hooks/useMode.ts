import { useDispatch } from 'react-redux'

import { MODE } from '@/constants/style'
import { useAppSelector } from '@/redux/hooks'
import { setMode as setModeSlice } from '@/redux/slices/mode'

const useMode = () => {
  const mode = useAppSelector((state) => state.mode)

  const dispatch = useDispatch()

  const setMode = (mode: MODE) => {
    dispatch(setModeSlice(mode))
  }
  return {
    mode,
    setMode,
  }
}

export default useMode
