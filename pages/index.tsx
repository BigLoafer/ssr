import { Button } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'next/router';
import React from 'react';
import styles from './index.less';

@observer
class Home extends React.Component<any, any> {
  static async getInitialProps({ req }: any) {
    return {};
  }

  render() {
    return (
      <div>
        <div className={styles.hero}>
          <h1 className={styles.title}>Welcome to Next!</h1>
          <Button type="primary" size="large">
            1111
          </Button>
          <span>{process.env.SP_ENV}</span>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);
