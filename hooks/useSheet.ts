import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { closeSheet as closeSheetSlice, openSheet as openSheetSlice, SheetProps } from '@/redux/slices/sheetSlice'

const useSheet = () => {
  const sheet = useAppSelector((state) => state.sheet)
  const dispatch = useDispatch()

  const openSheet = (props: SheetProps) => {
    const init: SheetProps = {
      maskClosable: true,
      isOpen: true,
      ...props,
    }
    dispatch(openSheetSlice(init))
  }
  const closeSheet = () => {
    sheet?.afterClose?.()
    sheet?.onClose?.()
    dispatch(closeSheetSlice())
  }

  return { sheet, openSheet, closeSheet }
}
export default useSheet
