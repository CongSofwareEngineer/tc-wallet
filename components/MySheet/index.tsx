import React, { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'

import { COLORS } from '@/constants/style'
import useSheet from '@/hooks/useSheet'

const MySheet = () => {
  const { sheet, closeSheet } = useSheet()
  const actionSheetRef = useRef<ActionSheetRef>(null)
  console.log({ sheet })

  useEffect(() => {
    if (sheet.isOpen) {
      actionSheetRef.current?.show()
    } else {
      actionSheetRef.current?.hide()
    }
  }, [sheet])

  return (
    <ActionSheet
      closeOnTouchBackdrop={sheet?.closeOnTouchBackdrop ?? false}
      closeOnPressBack={sheet?.closeOnPressBack ?? false}
      defaultOverlayOpacity={0.3}
      gestureEnabled={sheet?.gestureEnabled ?? false}
      indicatorStyle={{
        maxWidth: 500,
      }}
      onClose={() => {
        // if (sheet?.isOpen) {
        //   closeSheet()
        // }
      }}
      containerStyle={{
        backgroundColor: COLORS.black3,
      }}
      ref={actionSheetRef}
    >
      <View style={styles.container}>{sheet?.children || sheet?.content}</View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
})
export default MySheet
