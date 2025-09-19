import { modalZustand } from '@/zustand/modal'

const useModal = () => {
  const modal = modalZustand((state) => state)

  return modal
}

export default useModal
