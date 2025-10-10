import * as DocumentPicker from 'expo-document-picker'
import { EncodingType, getInfoAsync, makeDirectoryAsync, readAsStringAsync, StorageAccessFramework } from 'expo-file-system/legacy'
import { PermissionsAndroid, Platform } from 'react-native'

import { Callback } from '@/types/web3'
import { getDataLocal, saveDataLocal } from '@/utils/storage'

import { useAlert } from './useAlert'

interface FileSystemOptions {
  fileName?: string
  directory?: string
  encoding?: EncodingType
}

// interface SaveOptions extends FileSystemOptions {
//   shareTitle?: string
//   mimeType?: string
// }

interface ReadFileResult {
  content: string | null
  error?: string
}

interface SaveFileResult {
  success: boolean
  path?: string
  error?: string
}

type SaveFileParams = {
  content: string
  saveType?: 'app' | 'downloads' | 'share' | 'custom' | 'web'
  nameFile?: string
  typeFile?: string
} & Callback

export const useFileSystem = () => {
  const { showError } = useAlert()

  // Tạo thư mục nếu chưa tồn tại
  const ensureDirectoryExists = async (dirPath: string): Promise<boolean> => {
    try {
      const dirInfo = await getInfoAsync(dirPath)
      if (!dirInfo.exists) {
        await makeDirectoryAsync(dirPath, { intermediates: true })
      }
      return true
    } catch {
      return false
    }
  }

  // Yêu cầu quyền storage cho Android
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Storage Permission',
          message: 'App needs access to storage to save files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        })
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch {
        return false
      }
    }
    return true
  }

  // Đọc file từ DocumentPicker
  const readFileFromPicker = async (options?: { type?: string }): Promise<ReadFileResult> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: options?.type || 'text/plain',
        copyToCacheDirectory: true,
      })
      // result contains file assets when user selects a file

      if (result.canceled || !result.assets || !result.assets[0]) {
        return { content: null, error: 'No file selected' }
      }

      const file = result.assets[0]
      let content: string
      if (Platform.OS === 'web') {
        // On web, use fetch to read file content
        content = await (await fetch(file.uri)).text()
      } else {
        content = await readAsStringAsync(file.uri, { encoding: EncodingType.UTF8 })
      }
      // File content read successfully

      return { content }
    } catch {
      return { content: null, error: 'Failed to read file' }
    }
  }

  // Đọc file từ path cụ thể
  const readFile = async (filePath: string, options?: FileSystemOptions): Promise<ReadFileResult> => {
    try {
      let content: string
      if (Platform.OS === 'web') {
        content = await (await fetch(filePath)).text()
      } else {
        content = await readAsStringAsync(filePath, {
          encoding: options?.encoding || EncodingType.UTF8,
        })
      }
      return { content }
    } catch {
      return { content: null, error: 'Failed to read file' }
    }
  }

  // Lưu file vào app directory
  const saveToAppDirectory = async (params: SaveFileParams) => {
    // try {
    //   const fileName = options?.fileName || `file_${Date.now()}.txt`
    //   const directory = options?.directory || 'TCWallet'
    //   const appFolder = documentDirectory + directory + '/'
    //   const dirExists = await ensureDirectoryExists(appFolder)
    //   if (!dirExists) {
    //     return { success: false, error: 'Failed to create directory' }
    //   }
    //   const filePath = appFolder + fileName
    //   await writeAsStringAsync(filePath, content, {
    //     encoding: options?.encoding || EncodingType.UTF8,
    //   })
    //   return { success: true, path: filePath }
    // } catch {
    //   return { success: false, error: 'Failed to save file to app directory' }
    // }
  }

  // Lưu file vào Downloads (Android) hoặc Files app (iOS)
  const saveToDownloads = async (params: SaveFileParams) => {
    // try {
    //   const hasPermission = await requestStoragePermission()
    //   if (!hasPermission) {
    //     return { success: false, error: 'Storage permission required' }
    //   }
    //   const fileName = options?.fileName || `file_${Date.now()}.txt`
    //   if (Platform.OS === 'android') {
    //     // Android: Lưu trực tiếp vào Downloads
    //     const downloadPath = '/storage/emulated/0/Download/'
    //     const filePath = downloadPath + fileName
    //     await writeAsStringAsync(filePath, content, {
    //       encoding: options?.encoding || EncodingType.UTF8,
    //     })
    //     return { success: true, path: filePath }
    //   } else {
    //     // iOS: Lưu vào app directory rồi download
    //     const appResult = await saveToAppDirectory(content, options)
    //     if (!appResult.success || !appResult.path) {
    //       return appResult
    //     }
    //     await downloadAsync(appResult.path, documentDirectory + fileName)
    //     return { success: true, path: documentDirectory + fileName }
    //   }
    // } catch {
    //   return { success: false, error: 'Failed to save file to downloads' }
    // }
  }

  // Chia sẻ file qua system sharing
  const shareFile = async (params: SaveFileParams) => {
    // try {
    //   // Trước tiên lưu vào app directory
    //   const appResult = await saveToAppDirectory(content, options)
    //   if (!appResult.success || !appResult.path) {
    //     return appResult
    //   }
    //   // Sau đó share file
    //   if (await Sharing.isAvailableAsync()) {
    //     await Sharing.shareAsync(appResult.path, {
    //       mimeType: options?.mimeType || 'text/plain',
    //       dialogTitle: options?.shareTitle || 'Save File',
    //     })
    //     return { success: true, path: appResult.path }
    //   } else {
    //     return { success: false, error: 'Sharing not available on this device' }
    //   }
    // } catch {
    //   return { success: false, error: 'Failed to share file' }
    // }
  }

  // Chọn vị trí tùy chỉnh và lưu file
  const saveToCustomLocation = async (params: SaveFileParams): Promise<void> => {
    const { content, nameFile, typeFile = 'text/plain', callbackBefore, callbackSuccess, callbackError } = params || {}
    const fileName = nameFile || `file_${Date.now()}.txt`
    callbackBefore?.()
    const urlDefault = getDataLocal('default_backup_location') || null

    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(urlDefault)

    if (permissions.granted) {
      // Gets SAF URI from response
      const uri = permissions.directoryUri
      saveDataLocal('default_backup_location', uri)
      const fileUri = await StorageAccessFramework.createFileAsync(uri, fileName, typeFile)

      // Gets all files inside of selected directory
      await StorageAccessFramework.writeAsStringAsync(fileUri, content, {
        encoding: EncodingType.UTF8,
      })

      callbackSuccess?.()
    } else {
      showError('No location selected. Please try again.')
      callbackError?.()
    }
  }

  // Web: Download file trực tiếp
  const downloadFileWeb = async (params: SaveFileParams): Promise<SaveFileResult> => {
    try {
      const { content, nameFile, typeFile } = params || {}
      const fileName = nameFile || `file_${Date.now()}.txt`
      const mimeType = typeFile || 'text/plain'

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true, path: fileName }
    } catch {
      return { success: false, error: 'Failed to download file' }
    }
  }

  // Hàm chính để lưu file với nhiều options
  const saveFile = async (params: SaveFileParams) => {
    switch (params.saveType || Platform.OS) {
      case 'app':
        saveToAppDirectory(params)
        break
      case 'downloads':
        saveToDownloads(params)
        break
      case 'share':
        shareFile(params)
        break
      case 'custom':
      case 'ios':
      case 'android':
        saveToCustomLocation(params)
        break
      case 'web':
        downloadFileWeb(params)
        break
    }
  }

  // Hiển thị dialog cho user chọn cách lưu file
  const saveFileWithOptions = async (params: SaveFileParams): Promise<void> => {
    // if (Platform.OS === 'web') {
    //   await downloadFileWeb(params)
    //   showSuccess('File downloaded!')
    //   return
    // }
    // Alert.alert(
    //   'Choose Save Location',
    //   'Where would you like to save your file?',
    //   [
    //     {
    //       text: 'Download to Device',
    //       onPress: async () => {
    //         const result = await saveToDownloads(params)
    //         if (result.success) {
    //           showSuccess('File saved to Downloads!')
    //         } else {
    //           showError(result.error || 'Failed to save file')
    //         }
    //       },
    //     },
    //     {
    //       text: 'Share File',
    //       onPress: async () => {
    //         const result = await shareFile(content, options)
    //         if (result.success) {
    //           showSuccess('File shared successfully!')
    //         } else {
    //           showError(result.error || 'Failed to share file')
    //         }
    //       },
    //     },
    //     {
    //       text: 'Keep in App',
    //       onPress: async () => {
    //         const result = await saveToAppDirectory(content, options)
    //         if (result.success) {
    //           showSuccess('File saved to app folder!')
    //         } else {
    //           showError(result.error || 'Failed to save file')
    //         }
    //       },
    //     },
    //     {
    //       text: 'Cancel',
    //       style: 'cancel',
    //     },
    //   ],
    //   { cancelable: true }
    // )
  }

  return {
    // Read operations
    readFile,
    readFileFromPicker,

    // Save operations
    saveFile,
    saveToAppDirectory,
    saveToDownloads,
    shareFile,
    saveToCustomLocation,
    saveFileWithOptions,

    // Utilities
    ensureDirectoryExists,
    requestStoragePermission,
  }
}
