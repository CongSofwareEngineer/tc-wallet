import React from 'react'
import { StyleSheet, View } from 'react-native'
import ModalBox from 'react-native-modalbox'

import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { BORDER_RADIUS_DEFAULT, COLORS } from '@/constants/style'
import useSheet from '@/hooks/useSheet'
import { height } from '@/utils/systems'
import { SafeAreaView } from 'react-native-safe-area-context'

const MySheet = () => {
  const { sheet, closeSheet } = useSheet()

  return (
    <>
      {sheet?.isOpen && (
        <ModalBox
          {...sheet}
          backdrop
          position={sheet?.position || 'bottom'}
          onClosed={() => closeSheet()}
          swipeToClose
          isOpen={sheet?.isOpen || false}
          backdropColor='rgba(0,0,0,0.8)'
          style={{ margin: 0, justifyContent: 'flex-end', backgroundColor: 'transparent' }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, height: height(100), justifyContent: 'flex-end' }}>
              <View style={[styles.container, sheet?.containerContentStyle]}>
                <View style={{ alignItems: 'center' }}>
                  <ThemeTouchableOpacity
                    type='text'
                    onPress={() => {
                      closeSheet()
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        height: 4,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 2,
                        width: 40,
                        marginBottom: 16,
                      }}
                    />
                  </ThemeTouchableOpacity>
                </View>
                {sheet?.children || sheet?.content}
              </View>
            </View>
          </SafeAreaView>
        </ModalBox>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.black3,
    borderTopLeftRadius: BORDER_RADIUS_DEFAULT.Radius16,
    borderTopRightRadius: BORDER_RADIUS_DEFAULT.Radius16,
    maxHeight: height(100) - 60,
    position: 'relative',
    overflow: 'hidden',
  },
})
export default MySheet
