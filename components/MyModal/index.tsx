import Ionicons from '@expo/vector-icons/Ionicons'
import { Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import useModal from '@/hooks/useModal'
import useTheme from '@/hooks/useTheme'
import { useAppSelector } from '@/redux/hooks'

const MyModal = () => {
  const { background, colors } = useTheme()
  const modals = useAppSelector((state) => state.modals)
  const { closeModal } = useModal()

  return (
    <>
      {modals?.map((modal, index) => (
        <Modal
          {...(modal.config as any)}
          style={{
            backgroundColor: background.backgroundModal,
          }}
          animationType='fade'
          transparent={true}
          visible={modal?.open}
          onRequestClose={() => {
            closeModal()
            modal?.onClose?.()
          }}
          key={`modal-${index}`}
        >
          <ScrollView
            contentContainerStyle={[
              styles.root,
              {
                backgroundColor: background.backgroundModal,
              },
            ]}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                if (modal?.maskClosable) {
                  closeModal()
                  modal?.onClose?.()
                }
              }}
            >
              <SafeAreaView style={styles.root}>
                <TouchableWithoutFeedback>
                  <View
                    style={[
                      styles.content,
                      {
                        backgroundColor: colors.black3,
                      },
                    ]}
                  >
                    {modal?.showIconClose && (
                      <TouchableOpacity
                        style={styles.iconClose}
                        onPress={() => {
                          closeModal()
                          modal?.onClose?.()
                        }}
                      >
                        <Ionicons name='close' size={24} color={'red'} />
                      </TouchableOpacity>
                    )}

                    {modal.content}
                  </View>
                </TouchableWithoutFeedback>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Modal>
      ))}
    </>
  )
}

export default MyModal

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    maxWidth: 500,
    width: '100%',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // flex flex-row justify-end absolute text-right w-full right-[5px] top-[5px]
  iconClose: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    textAlign: 'right',
    position: 'absolute',
    right: 3,
    top: 3,
    padding: 5,
    zIndex: 1,
  },
})
