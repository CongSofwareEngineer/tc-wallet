import React, { IframeHTMLAttributes, useEffect, useRef } from 'react'

type Props = {
  src: string
} & IframeHTMLAttributes<HTMLIFrameElement>

const MyIframe = ({ src, ...rest }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Add message event listener for communication with iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin
      if (event.origin === 'https://widget.moralis.com') {
        console.log('Received message from widget:', event.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      allow='*'
      {...rest}
      src={src}
      sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
      security='restricted'
      referrerPolicy='origin'
      style={{
        width: '100%',
        border: 'none',
        ...rest?.style,
      }}
    />
  )
}

export default MyIframe
