import { Image, ImageProps } from 'expo-image'
import React, { useState } from 'react'

import { images } from '@/configs/images'

type Props = {
  src?: string
} & Partial<ImageProps>
const MyImage = ({ src, ...props }: Props) => {
  const [urlFinal, setUrlFinal] = useState(src)
  try {
    return (
      <Image
        placeholder={images.icons.unknown}
        onError={(e) => {
          setUrlFinal(images.icons.unknown)
        }}
        source={urlFinal ?? images.icons.unknown}
        {...props}
      />
    )
  } catch {
    try {
      return (
        <Image
          placeholder={images.icons.unknown}
          onError={(e) => {
            setUrlFinal(images.icons.unknown)
          }}
          source={urlFinal ? { uri: urlFinal } : images.icons.unknown}
          {...props}
        />
      )
    } catch {
      return <Image source={images.icons.unknown} {...props} />
    }
  }
}

export default MyImage
