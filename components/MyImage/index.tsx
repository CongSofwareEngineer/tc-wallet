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
          contentFit='contain'
          {...props}
          placeholder={images.gifs.loading}
          placeholderContentFit='contain'
          onError={(error) => {
            setCaseImage(2)
          }}
          source={src}
        />
      )

    case 2:
      return (
        <Image
          contentFit='contain'
          {...props}
          placeholder={images.gifs.loading}
          placeholderContentFit='contain'
          onError={(error) => {
            setCaseImage(3)
          }}
          source={{ uri: src }}
        />
      )

    default:
      return <Image {...props} source={images.icons.unknown} contentFit='contain' />
  }
}

export default MyImage
