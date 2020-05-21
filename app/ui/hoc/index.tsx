import Router from 'next/router';
import React from 'react';

export const withPartnerAuth: any = (WarppedComponent: any) => {
  return class extends React.Component<any, any> {
    static async getInitialProps(ctx: any) {
      const query = ctx.query;
      const token = ctx.query.dId;
      let pageProps = {};
      if (WarppedComponent.getInitialProps) {
        pageProps = await WarppedComponent.getInitialProps(ctx);
      }
      return {
        token,
        query,
        pageProps
      };
    }

    componentDidMount() {
      if (!this.props.token) {
        setTimeout(
          () => {
          Router.push('https://partner.sunmi.com/login');
       }, 1000);
      }
    }

    render() {
      global.dId = this.props.token ? this.props.token : undefined;
      return this.props.token ? (
        <div>
          <WarppedComponent {...this.props} {...this.props.pageProps}/>
        </div>
      ) : (
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '20px',
            lineHeight: '50px'
          }}
        >
          请登录...
        </p>
      );
    }
  };
};
