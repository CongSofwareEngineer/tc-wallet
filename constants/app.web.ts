export const IS_NOTCH_ANDROID = false // Web doesn't have notches in the same way
export const HAS_NOTCH = false // Web doesn't have notches

export const HEIGHT_SCREEN = typeof window !== 'undefined' ? window.innerHeight : 1024
export const WIDTH_SCREEN = typeof window !== 'undefined' ? window.innerWidth : 768

export const IsIos = false // Always false on web
export const IsAndroid = false
export const IsWeb = true

export enum TYPE_URL_IMAGE {
  Image = 'Image',
  Video = 'Video',
  Audio = 'Audio',
  IFrame = 'IFrame',
}
