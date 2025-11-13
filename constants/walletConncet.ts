export const CODE_FUNCTION = {
  ['0x']: 'transfer',
  ['0xa9059cbb']: 'transfer',
  ['0x23b872dd']: 'transferFrom',
  ['0x095ea7b3']: 'approve',
}

export const TYPE_TRANSACTION = {
  '0x0': 'legacy',
  '0x1': 'eip2930',
  '0x2': 'eip1559',
  '0x3': 'eip7702',
} as Record<string, 'legacy' | 'eip2930' | 'eip1559' | 'eip7702' | undefined>
