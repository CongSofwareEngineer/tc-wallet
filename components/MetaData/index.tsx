import Head from 'expo-router/head'
import React from 'react'
const META_DATA = {
  title: 'TC Wallet',
  description: 'An application for managing your wallet',
  image: 'https://tc-wallet.expo.app/favicon.ico',
  url: 'https://tc-wallet.expo.app/',
  phone: '+84392225405',
  email: 'hodiencong2000@gmail.com',
}
const MetaData = () => {
  return (
    <Head>
      <title>{META_DATA.title}</title>
      <meta name='description' content={META_DATA.description} />

      <meta itemProp='name' content={META_DATA.title} />
      <meta itemProp='description' content={META_DATA.description} />
      <meta itemProp='image' content={META_DATA.image} />

      <meta property='og:url' content={META_DATA.url} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={META_DATA.title} />
      <meta property='og:description' content={META_DATA.description} />
      <meta property='og:image' content={META_DATA.image} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={META_DATA.title} />
      <meta name='twitter:description' content={META_DATA.description} />
      <meta name='twitter:image' content={META_DATA.image} />

      <meta property='og:phone_number' content={META_DATA.phone} />
      <meta property='og:email' content={META_DATA.email} />
      <link rel='bookmarks' href={META_DATA.url} />
      <meta name='googlebot' content='index, follow' />
      <meta name='robots' content='index, follow, nocache' />
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
    </Head>
  )
}

export default MetaData
