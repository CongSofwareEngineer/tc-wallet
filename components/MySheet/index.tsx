import React from 'react'
import { StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'

import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { BORDER_RADIUS_DEFAULT, COLORS } from '@/constants/style'
import useSheet from '@/hooks/useSheet'
import { height } from '@/utils/systems'

const MySheet = () => {
  const { sheet, closeSheet } = useSheet()

  return (
    <>
      {sheet?.isOpen && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
      <Modal
        avoidKeyboard
        backdropColor='transparent'
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        swipeDirection='down'
        isVisible={sheet?.isOpen || false}
        onSwipeComplete={(e) => {
          if (e?.swipingDirection === 'down') {
            closeSheet()
          }
        }}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={{ flex: 1, height: height(100), justifyContent: 'flex-end' }}>
          <View style={[styles.container, sheet?.containerContentStyle]}>
            <View style={{ alignItems: 'center' }}>
              <ThemeTouchableOpacity type='text' onPress={closeSheet} activeOpacity={0.7}>
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
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.black3,
    borderTopLeftRadius: BORDER_RADIUS_DEFAULT.Radius16,
    borderTopRightRadius: BORDER_RADIUS_DEFAULT.Radius16,
  },
})
export default MySheet
