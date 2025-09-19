import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'

const ApproveScreen = () => {
  const router = useRouter()
  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
      <SafeAreaView style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Approve</Text>
        {/* Content goes here */}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
})

export default ApproveScreen
