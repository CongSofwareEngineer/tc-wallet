export const TEXT_SIZE = [12, 16, 24, 32, 40, 80] as const
export const BORDER_RADIUS = [4, 6, 8] as const
export const BORDER_WIDTH = [1, 2, 4] as const

export enum BORDER_RADIUS_DEFAULT {
  Radius4 = 4,
  Radius6 = 6,
  Radius8 = 8,
  Radius12 = 12,
  Radius16 = 16,
}
export enum GAP_DEFAULT {
  Gap4 = 4,
  Gap8 = 8,
  Gap12 = 12,
  Gap16 = 16,
  Gap20 = 20,
  Gap24 = 24,
  Gap32 = 32,
  Gap40 = 40,
}

export enum PADDING_DEFAULT {
  Padding10 = 10,
  Padding12 = 12,
  Padding16 = 16,
  Padding20 = 20,
  Padding24 = 24,
}

export enum MODE {
  Light = 'light',
  Dark = 'dark',
}

export enum COLORS {
  red = 'red',
  red1 = '#610606ff',
  green = 'green',
  green2 = '#16ff091a',
  green600 = '#43A047',
  blue = 'blue',
  yellow = 'yellow',
  yellow1 = '#FFEB3B',
  white = '#d7d5d5ff',
  gray = '#8a8e90ff',
  gray1 = '#d1d5db',
  gray2 = '#4c4e4eff',
  black = 'black',
  black3 = '#272728ff',
  black1 = '#000000cc',
  black2 = '#2e2d2dcc',
}

export const BACKGROUND = {
  [MODE.Light]: {
    background: COLORS.white,
    backgroundModal: COLORS.black1,
    backgroundContentModal: COLORS.gray1,
    backgroundHeaderPage: COLORS.gray1,
    backgroundInput: COLORS.gray1,
  },
  [MODE.Dark]: {
    background: COLORS.black,
    backgroundModal: COLORS.black1,
    backgroundContentModal: COLORS.gray1,
    backgroundHeaderPage: COLORS.gray1,
    backgroundInput: 'transparent',
  },
} as const

export const TEXT = {
  [MODE.Light]: {
    color: COLORS.black,
    colorPlaceholder: COLORS.gray,
  },
  [MODE.Dark]: {
    color: COLORS.white,
    colorPlaceholder: COLORS.gray,
  },
} as const
