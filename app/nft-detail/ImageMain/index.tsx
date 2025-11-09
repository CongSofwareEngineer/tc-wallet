import { FontAwesome } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import MyIframe from '@/components/MyIframe'
import MyImage from '@/components/MyImage'
import MyLoading from '@/components/MyLoading'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS } from '@/constants/style'
import useNftMetadataEVM from '@/hooks/react-query/useNftMetadataEVM'
import useTypeUrlImage from '@/hooks/react-query/useTypeUrlImage'
import { NFT } from '@/services/moralis/type'
import { detectUrlImage } from '@/utils/functions'

type Props = {
  nft: NFT
}

const ImageMain = ({ nft }: Props) => {
  const [showAnimation, setShowAnimation] = useState(false)

  const { data: metaData, isLoading } = useNftMetadataEVM(nft)
  const { data: typeUrlImage } = useTypeUrlImage(metaData?.image)
  const { data: typeUrlAnimation } = useTypeUrlImage(metaData?.animation_url)

  const isHasAnimation = useMemo(() => {
    if (metaData?.animation_url) {
      if (typeUrlAnimation === 'IFrame' || typeUrlAnimation === 'Video') {
        return typeUrlAnimation !== typeUrlImage
      }
    }

    return false
  }, [typeUrlAnimation, metaData, typeUrlImage])

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <MyLoading />
        </View>
      ) : (
        <>
          {/* Image View */}
          {!showAnimation && metaData?.image && typeUrlImage === 'Image' && (
            <MyImage src={detectUrlImage(metaData?.image)} style={styles.image} resizeMode='contain' />
          )}

          {!showAnimation && metaData?.image && typeUrlImage === 'Video' && (
            <View style={styles.animationContainer}>
              <MyIframe src={detectUrlImage(metaData?.animation_url!)} style={styles.animation} />
            </View>
          )}
          {!metaData?.image && !typeUrlImage && (
            <View style={[styles.image, { backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' }]}>
              <FontAwesome name='image' size={48} color={COLORS.white} />
            </View>
          )}

          {/* Animation View */}
          {showAnimation && isHasAnimation && (
            <View style={styles.animationContainer}>
              <MyIframe src={metaData?.animation_url!} style={styles.animation} />
            </View>
          )}

          {/* Toggle Button */}
          {isHasAnimation && (
            <ThemeTouchableOpacity type='text' onPress={() => setShowAnimation(!showAnimation)} style={styles.toggleButton}>
              <FontAwesome name={showAnimation ? 'image' : 'play-circle-o'} size={24} color={COLORS.white} />
            </ThemeTouchableOpacity>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.black,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  animationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.black,
  },
  animation: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ImageMain
