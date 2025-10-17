import React from 'react'
import WebView, { WebViewProps } from 'react-native-webview'
type Props = {
  src: string
} & Partial<WebViewProps>
const MyIframe = ({ src, ...rest }: Props) => {
  return <WebView useWebView2 originWhitelist={['*']} source={{ uri: src }} {...rest} style={[{ flex: 1 }, rest?.style]} />
}

export default MyIframe
