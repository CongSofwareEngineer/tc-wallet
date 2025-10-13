import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { resetFilter as resetFilterSlice, setFilter } from '@/store/slices/filterSlice'

export const useFilter = () => {
  const dispatch = useDispatch()
  const filters = useSelector((state: RootState) => state.filter)

  const setFilterToken = (updates: Partial<RootState['filter']['tokens']>) => {
    console.log({ updates })

    dispatch(setFilter({ tokens: updates as any }))
  }

  const setFilterNFTs = (updates: Partial<RootState['filter']['nfts']>) => {
    dispatch(setFilter({ nfts: updates as any }))
  }

  const resetFilter = () => {
    dispatch(resetFilterSlice())
  }

  return {
    filters,
    setFilterToken,
    setFilterNFTs,
    resetFilter,
  }
}

export default useFilter
