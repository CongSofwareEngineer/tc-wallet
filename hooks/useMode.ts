import { modeZustand } from '@/zustand/mode'

const useMode = () => {
  const mode = modeZustand((state) => state)

  return mode
}

export default useMode
