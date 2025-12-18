import MessageEN from '../assets/languages/en.json'

export enum LANGUAGE_SUPPORT {
  EN = 'en',
  VN = 'vn',
}

export type TYPE_LANGUAGE = typeof MessageEN

export type PATH_LANGUAGE<T, Prefix extends string = ''> = T extends object
  ? {
    [K in keyof T]: PATH_LANGUAGE<T[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K & string}`>
  }[keyof T]
  : Prefix
