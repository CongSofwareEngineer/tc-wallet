import { useDispatch } from 'react-redux'

import { KEY_STORAGE } from '@/constants/storage'
import { useAppSelector } from '@/redux/hooks'
import { setSetting as setSettingSlice, Setting } from '@/redux/slices/settingsSlice'
import { removeSecureData } from '@/utils/secureStorage'

const useSetting = () => {
  const dispatch = useDispatch()
  const settings = useAppSelector((state) => state.settings)

  const setSetting = (payload: Partial<Setting>) => {
    dispatch(setSettingSlice(payload as Setting))
  }

  const resetSetting = () => {
    removeSecureData(KEY_STORAGE.PasscodeAuth)
    dispatch(
      setSettingSlice({
        isFaceId: false,
        isPasscode: false,
        isBiometric: false,
        isNotification: false,
      } as Setting)
    )
  }

  return { setSetting, settings, resetSetting }
}

export default useSetting
