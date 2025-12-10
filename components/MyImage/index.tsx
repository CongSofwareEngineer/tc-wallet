import { Image, ImageProps } from 'expo-image'
import React, { useEffect, useState } from 'react'

import { images } from '@/configs/images'

type Props = {
  src?: string
} & Partial<ImageProps>
const MyImage = ({ src, ...props }: Props) => {
  const [caseImage, setCaseImage] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  // Set timeout for 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        if (caseImage < 3) {
          setCaseImage(caseImage + 1) // Show unknown image after 5 seconds
        }
      }
    }, 5000)

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [isLoaded, caseImage])

  useEffect(() => {
    if (!src) {
      setCaseImage(3)
    }
  }, [src])

  switch (caseImage) {
    case 1:
      return (
        <Image
          contentFit='contain'
          {...props}
          placeholder={images.gifs.loading}
          placeholderContentFit='contain'
          onLoad={() => setIsLoaded(true)}
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
          onLoad={() => setIsLoaded(true)}
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
