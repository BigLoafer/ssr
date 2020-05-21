import { LocaleProvider } from 'antd';
import 'antd/dist/antd.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import App, { Container } from 'next/app';
import React from 'react';
import Head from '../app/ui/head';
moment.locale('zh-cn');

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }: any) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <LocaleProvider locale={zh_CN}>
        <Container>
          <Head title="商米服务" />
          <Component {...pageProps} />
        </Container>
      </LocaleProvider>
    );
  }
}
