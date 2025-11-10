import { Image, ImageProps } from 'expo-image'
import React from 'react'

import { images } from '@/configs/images'

type Props = {
  src?: string
} & Partial<ImageProps>
const MyImage = ({ src, ...props }: Props) => {
  try {
    return <Image placeholder={images.icons.unknown} source={src ?? images.icons.unknown} {...props} />
  } catch {
    try {
      return <Image placeholder={images.icons.unknown} source={src ? { uri: src } : images.icons.unknown} {...props} />
    } catch {
      return <Image source={images.icons.unknown} {...props} />
    }
  }
}

export default MyImage
