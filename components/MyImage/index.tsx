import { Image, ImageProps } from 'expo-image'
import React, { useState } from 'react'

import { images } from '@/configs/images'

type Props = {
  src?: string
} & Partial<ImageProps>
const MyImage = ({ src, ...props }: Props) => {
  const [caseImage, setCaseImage] = useState(1)
  switch (caseImage) {
    case 1:
      return (
        <Image
          onError={() => {
            setCaseImage(2)
          }}
          placeholder={images.icons.unknown}
          source={src ?? images.icons.unknown}
          {...props}
        />
      )
    case 2:
      return (
        <Image
          onError={() => {
            setCaseImage(3)
          }}
          placeholder={images.icons.unknown}
          source={src ? { uri: src } : images.icons.unknown}
          {...props}
        />
      )
    case 3:
      return <Image source={images.icons.unknown} {...props} />
    default:
      return <Image source={images.icons.unknown} {...props} />
  }
}

export default MyImage
