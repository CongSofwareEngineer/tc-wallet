import { PixelRatio, Share } from 'react-native'
import RNFS from 'react-native-fs'

import { HEIGHT_SCREEN, IsIos, WIDTH_SCREEN } from '@/constants/app'
import { EncodingType, makeDirectoryAsync, StorageAccessFramework } from 'expo-file-system/legacy'
import { getDataLocal, saveDataLocal } from '../storage'

export const height = (ratio = 100) => {
  return PixelRatio.roundToNearestPixel(HEIGHT_SCREEN * (ratio / 100))
}

export const width = (ratio = 100) => {
  return PixelRatio.roundToNearestPixel(WIDTH_SCREEN * (ratio / 100))
}

export const downloadFile = async (fileName: string, value: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (IsIos) {
        const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`

        await RNFS.writeFile(filePath, value, 'utf8')
          .then(async (success) => {
            try {
              const result = await Share.share({
                url: filePath,
                title: fileName,
              })

              if (result && result.action === Share.sharedAction) {
                resolve(true)
              }
              resolve(true)
            } catch (error) {
              reject(error)
            }
          })
          .catch((_err) => {
            reject('Failed to create backup file. Please try again.')
          })
      } else {
        const urlDefault = getDataLocal('default_backup_location') || null

        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(urlDefault)

        if (permissions.granted) {
          // Gets SAF URI from response
          const uri = permissions.directoryUri
          saveDataLocal('default_backup_location', uri)
          if (!urlDefault) {
            await makeDirectoryAsync(uri)
          }
          const fileUri = await StorageAccessFramework.createFileAsync(uri, fileName, 'text/plain')

          // Gets all files inside of selected directory
          await StorageAccessFramework.writeAsStringAsync(fileUri, value, {
            encoding: EncodingType.UTF8,
          })

          resolve(true)
        } else {
          reject('No location selected. Please try again.')
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}
