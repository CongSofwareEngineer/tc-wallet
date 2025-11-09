import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_DEFAULT, PADDING_DEFAULT } from '@/constants/style'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    // flex: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: PADDING_DEFAULT.Padding16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS_DEFAULT.Radius12,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  attributeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  attributeItem: {
    width: '50%',
    padding: 6,
  },
  attributeBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
  },
  attributeType: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  attributeRarity: {
    fontSize: 12,
    marginTop: 4,
    color: '#00D09C',
  },
})
