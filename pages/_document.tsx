import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document<any> {
  static async getInitialProps(ctx: any) {
    const props = await Document.getInitialProps(ctx);
    return { ...props };
  }

  render() {
    return (
      <html>
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
        </body>
      </html>
    );
  }
}
