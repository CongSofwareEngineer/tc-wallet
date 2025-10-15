import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  renderError?: () => ReactNode
  language?: {
    messages?: {
      supportDevice?: string
    }
  }
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.renderError ? this.props.renderError() : <></>
    }

    return this.props.children
  }
}

export default ErrorBoundary
