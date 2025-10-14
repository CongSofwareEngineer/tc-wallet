import { Modal, StyleSheet, View } from 'react-native'

const Overlay = () => {
  return (
    <Modal transparent visible animationType='none'>
      <View style={styles.overlay} />
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    opacity: 0.5,
    pointerEvents: 'none',
  },
})

export default Overlay
