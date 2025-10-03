// Web polyfill for React Native Alert
export const Alert = {
  alert: (title: string, message?: string, buttons?: any[]) => {
    if (typeof window !== 'undefined') {
      if (message) {
        window.alert(`${title}\n\n${message}`)
      } else {
        window.alert(title)
      }
    }
  },
}
