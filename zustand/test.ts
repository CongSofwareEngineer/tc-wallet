import { create } from 'zustand'

type State = {
  count: Record<number, unknown>
  inc: () => void
}

export const useCounterStore = create<State>((set) => ({
  count: {},
  inc: () =>
    set((s) => {
      const newCount = { ...s.count }
      newCount[Object.keys(newCount).length] = true
      return { count: newCount }
    }),
}))
