import { Button, Icon, message } from 'antd';
import Des from 'app/services/secure';
import { withPartnerAuth } from 'app/ui';
import React from 'react';
import { updateOrderExpress } from './apis';
import { ExpressNumberModal } from './component';
import styles from './success.less';

export default class Success extends React.Component<any, any> {
  static async getInitialProps(ctx: any) {
    const query = ctx.query;
    const info = JSON.parse(Des.decrypt(query.info));
    return {
      info
    };
  }
  options: any;
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      btnDisable: false,
      numberInputValue: ''
    };
    this.options = {
      express_no: '',
      express_com: '',
      order_id: ''
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleModalOk = async () => {
    if (!this.options.express_com) {
      message.error('请先输入物流公司');
      return;
    }
    if (!this.options.express_no) {
      message.error('请先输入物流单号');
      return;
    }
    this.options.order_id = this.props.info.order_id;
    try {
      const json: any = await updateOrderExpress(this.options);
      message.success('操作成功');
      this.setState({
        visible: false,
        btnDisable: true
      });
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  handleModalCancle = () => {
    this.setState({
      visible: false
    });
  };

  handleCompanyInputChange = (e: any) => {
    this.options = { ...this.options, ...{ express_com: e.target.value } };
  };

  handleNumberInputChange = (e: any) => {
    const value = e.target.value.replace(/[\W]/g, '');
    this.setState({ numberInputValue: value });
    this.options = { ...this.options, ...{ express_no: value } };
  };

  render() {
    const {
      station_name,
      station_user,
      station_phone,
      station_prov,
      station_city,
      station_area,
      station_addr
    } = this.props.info;
    return (
      <div className={styles.container}>
        <Icon type="check-circle" className={styles.icon} />
        <span className={styles.successText}>提交成功</span>
        <span className={styles.grayText}>请尽快填写快递单号</span>
        <span className={styles.grayText}>
          您可在售后进度查询处补充快递单号或查询受理站点信息等
        </span>
        <div className={styles.line} />
        <span className={styles.acceptance}>受理站点</span>
        <div className={styles.stationInfo}>
          <span className={styles.name}>{station_name}</span>
          <span className={styles.pName}>{station_user}</span>
          <span className={styles.phone}>{station_phone}</span>
          <span className={styles.address}>
            {`${station_prov}${station_city}${station_area}${station_addr}`}
          </span>
        </div>
        <div className={styles.line} />
        <div className={styles.bottom}>
          <Button
            className={styles.btn1}
            type="primary"
            onClick={this.showModal}
            disabled={this.state.btnDisable}
          >
            填写快递单号
          </Button>
          <a href={`/afterSale/afterSaleApplication?dId=${global.dId}`}>
            <Button className={styles.btn2}>返回首页</Button>
          </a>
          <a href={`/afterSale/afterSaleProgress?dId=${global.dId}`}>
            <Button className={styles.btn1}>查看售后进度</Button>
          </a>
        </div>
        <ExpressNumberModal
          visible={this.state.visible}
          handleOk={this.handleModalOk}
          handleCancel={this.handleModalCancle}
          companyInputChange={this.handleCompanyInputChange}
          numberInputChange={this.handleNumberInputChange}
          numberInputValue={this.state.numberInputValue}
        />
      </div>
    );
  }
}
