import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

function useAppState(onChange: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange)

    return () => {
      subscription.remove()
    }
  }, [onChange])
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
})

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  useAppState(onAppStateChange)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default ReactQueryProvider
