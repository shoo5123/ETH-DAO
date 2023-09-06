import * as React from 'react';
import Head from 'next/head';

export default function HeadComponent(): JSX.Element {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#000000" />

      <title>Create a DAO tool from scratch</title>
      <meta name="title" content="Create a DAO tool from scratch" />
      <meta name="description" content="DAO🤝" />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.shiftbase.xyz/" />
      <meta property="og:title" content="Create a DAO tool from scratch" />
      <meta property="og:description" content="DAO🤝" />
      <meta property="og:image" content="/banner.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.shiftbase.xyz/" />
      <meta property="twitter:title" content="Create a DAO tool from scratch" />
      <meta property="twitter:description" content="DAO🤝" />
      <meta property="twitter:image" content="/banner.png" />
    </Head>
  ); 
}