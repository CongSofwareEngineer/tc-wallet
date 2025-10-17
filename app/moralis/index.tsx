import React from 'react'
import { View } from 'react-native'

import HeaderScreen from '@/components/Header'
import MyIframe from '@/components/MyIframe'
// https://widget.moralis.com/widgets/embed/price-chart?autoSize=true&chainId=0x1&pageUrl=%27https://nft.keyring.app/%27
const MoralisScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <HeaderScreen title='Moralis Chart' />
      <View style={[{ flex: 1 }]}>
        {/* <WebView
          originWhitelist={['*']}
          webviewDebuggingEnabled
          javaScriptEnabled
          javaScriptCanOpenWindowsAutomatically
          source={{
            html: `
                 <html> 
                   <head>
                     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                   </head>
                   <body style="margin: 0; padding: 0;">
                     <h1 style="color: black;">Esta é uma fonte HTML estática!</h1>
                     <p>Coong </p>
                      
                     <div id="price-chart-widget-container" style="width: 100%; height: 100vh; position: absolute; top: 0; left: 0;">
                     <script type="text/javascript">
                        (function() {
                          function loadWidget() {
                            function s(n, r) {
                              let e = document.getElementById(n);
                              if (!e) {
                                console.error('Container element not found');
                                return;
                              }
                              let f = "https://widget.moralis.com";
                              e.innerHTML = "";
                              
                              // Ensure the filter function exists
                              const i = (val) => val != null && val !== '';
                              
                              let l = Object.fromEntries(Object.entries({
                                  ...r,
                                  pageUrl: window.location.href
                                }).filter(([, t]) => i(t)).map(([t, o]) => [t, typeof o == "string" ? o : JSON.stringify(o)])),
                                p = r.autoSize ? "100%" : r.height || "100%",
                                u = r.autoSize ? "100%" : r.width || "100%",
                                c = new URLSearchParams(l).toString(),
                                a = document.createElement("iframe");
                              a.id = "my-widget-iframe";
                              a.src = f + "/widgets/embed/price-chart?" + c;
                              a.style.width = u;
                              a.style.height = p;
                              a.style.border = "none";
                              a.style.overflow = "hidden";
                              a.style.flex = "1";
                              a.style.display = "flex";
                              a.style.flexDirection = "column";
                              e.appendChild(a)
                            }
                            window.createMyWidget = s


                            if (typeof window.createChartWidget === 'function') {
                            alert('Chart widget function is available, creating widget...');
                              window.createChartWidget('price-chart-widget-container', {
                                autoSize: true,
                                chainId: '0x1',
                                pairAddress: '0x56534741cd8b152df6d48adf7ac51f75169a83b2',
                                showHoldersChart: true,
                                defaultInterval: '1D',
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Etc/UTC',
                                theme: 'moralis',
                                locale: 'en',
                                showCurrencyToggle: true,
                                hideLeftToolbar: false,
                                hideTopToolbar: false,
                                hideBottomToolbar: false
                              });
                            } else {
                              alert('Chart widget function not available.');
                              console.log('Chart widget not loaded yet, retrying...');
                              // setTimeout(loadWidget, 1000); // Try again after 1 second
                            }
                          }

                          if (!document.getElementById('moralis-chart-widget')) {
                            try {
                              var script = document.createElement('script');
                              script.id = 'moralis-chart-widget';
                              script.src = 'https://moralis.com/static/embed/chart.js';
                              script.type = 'text/javascript';
                              script.async = true;
                              script.onload = loadWidget;
                              document.body.appendChild(script);
                              alert('Loading chart widget script...');
                            } catch(e) {
                             alert('Error loading chart widget script.');
                              console.error('Error loading chart widget:', e);
                            }
                          } else {
                            alert('Chart widget script already loaded.');
                            loadWidget();
                          }
                        })();
                      </script>
                      </div>
                   </body>
                 </html>
               `,
          }}
          style={{ flex: 1 }}
        /> */}
        <MyIframe src='https://widget.moralis.com/widgets/embed/price-chart?autoSize=true&chainId=0x1&pageUrl=https%3A%2F%2Fdocs.moralis.com&pairAddress=0x56534741cd8b152df6d48adf7ac51f75169a83b2' />
      </View>
    </View>
  )
}

export default MoralisScreen
