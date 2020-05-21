import { Button, Cascader, Input, message, Modal, Steps } from 'antd';
import { If, withPartnerAuth } from 'app/ui';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import SecondStep from './component/SecendStep';
import ThreeStep from './component/ThreeStep';
import styles from './index.less';
import ApplicationStore from './store/ApplicationStore';
const Step = Steps.Step;
const confirm = Modal.confirm;

const cmessage = [
  '您需要在下方完善申请人信息。您仅可以申请归属于该账户及其子账户的机具。',
  '请选择故障类别;默认收件人与申请人相同。如果需要批量调整故障类别或收件人，可选择要修改的机具，点击右上角的按钮来进行调整',
  '请选择受理站点'
];

@observer
export default class AfterSaleApplication extends React.Component<any> {
  store: ApplicationStore;
  constructor(props: any) {
    super(props);
    this.store = new ApplicationStore();
  }

  componentDidMount() {
    this.store.getRepairInfo();
    this.store.getRegion();
  }

  handleCascaderChange = (value: any) => {
    this.store.state.cascaderValue = value;
    if (value.length > 0) {
      this.store.state.repair.repair_p_id = value[0];
      this.store.state.repair.repair_c_id = value[1];
      this.store.state.repair.repair_a_id = value[2];
    } else {
      this.store.state.repair.repair_p_id = '';
      this.store.state.repair.repair_c_id = '';
      this.store.state.repair.repair_a_id = '';
    }
  };

  handleSnInputChange = (e: any) => {
    const str: string = e.target.value.replace(/[^\d,，a-zA-Z]/g, '');
    this.store.state.snInputValue = str.toUpperCase();
    let arr = [] as any;
    if (str.indexOf('，') !== -1) {
      arr = str.split('，');
      this.store.state.snInputValue = '';
    } else if (str.indexOf(',') !== -1) {
      arr = str.split(',');
      this.store.state.snInputValue = '';
    }
    arr.map((item: string) => {
      if (item.length > 0) {
        this.store.state.repair.sn_list.push(item);
      }
    });
  };

  handleSnInputOnBlur = (e: any) => {
    const str: string = e.target.value.replace(/[^\d,，a-zA-Z]/g, '');
    this.store.state.snInputValue = str.toUpperCase();
    let arr = [] as any;
    if (str.indexOf('，') !== -1) {
      arr = str.split('，');
      this.store.state.snInputValue = '';
    } else if (str.indexOf(',') !== -1) {
      arr = str.split(',');
      this.store.state.snInputValue = '';
    } else {
      arr.push(str);
      this.store.state.snInputValue = '';
    }
    arr.map((item: string) => {
      if (item.length > 0) {
        this.store.state.repair.sn_list.push(item);
      }
    });
  };

  onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      if (this.store.state.snInputValue) {
        this.store.changeSnData();
      }
    }
  };

  deleteSn = (index: any) => {
    this.store.state.repair.sn_list.splice(index, 1);
  };

  renderSelectedSn = () => {
    return this.store.state.repair.sn_list.map((item: any, index: any) => (
      <div key={index} className={styles.snItemCon}>
        <div className={styles.snItem}>{item}</div>
        <div className={styles.deleteCon} onClick={() => this.deleteSn(index)}>
          <span className={styles.delete}>x</span>
        </div>
      </div>
    ));
  };

  goToNext = (flag?: any) => {
    switch (flag) {
      case '2':
        const arr = this.store.state.userSelectMachineData.filter(
          (item: any) => item.repair_status === 1
        );
        if (arr.length === 0) {
          message.error('至少需要有一个可报修的机具');
          return;
        }
        const obj = arr.find((item: any) => item.mal_a_id === 0);
        if (obj) {
          message.error('请确保所有可报修机具都选择了故障类别');
          return;
        }
        this.store.state.currentStep = 2;
        break;

      default:
        if (!this.store.state.repair.repair_name) {
          message.error('请先输入姓名');
          return;
        }
        if (!this.store.state.repair.repair_phone) {
          message.error('请先输入电话号码');
          return;
        }
        if (
          !this.store.state.repair.repair_address ||
          this.store.state.cascaderValue.length === 0
        ) {
          message.error('请先输入地址');
          return;
        }
        if (this.store.state.repair.sn_list.length > 20) {
          message.error('最多支持报修20台机具');
          return;
        }
        if (this.store.state.repair.sn_list.length === 0) {
          message.error('请先输入SN');
          return;
        }
        this.store.addMachine();
        break;
    }
  };

  showRightContent = (flag: any) => {
    confirm({
      title: '',
      content: '数据未保存，离开后需要重新录入数据，确定离开吗？',
      onOk: () => {
        switch (flag) {
          case '2':
            this.store.state.currentStep = 0;
            break;
          case '3':
            this.store.state.currentStep = 1;
            break;
          default:
            break;
        }
      },
      onCancel() {
        return;
      }
    });
  };

  handleNameChange = (e: any) => {
    this.store.state.repair.repair_name = e.target.value;
  };

  handlePhoneChange = (e: any) => {
    this.store.state.repair.repair_phone = e.target.value.replace(
      /[^\d-()]/g,
      ''
    );
  };

  handleAddressDetailChange = (e: any) => {
    this.store.state.repair.repair_address = e.target.value;
  };

  render() {
    return (
      <div className="application">
        <div className={styles.AppContainer}>
          <span className={styles.afterText}>售后申请</span>
          <span className={styles.message}>
            {cmessage[this.store.state.currentStep]}
          </span>
          <div className={styles.stepContainer}>
            <Steps current={this.store.state.currentStep}>
              <Step title="录入设备" />
              <Step title="输入故障" />
              <Step title="选择站点" />
            </Steps>
          </div>
          <If data={this.store.state.currentStep === 0}>
            <div className={styles.first}>
              <div className={styles.formContainer}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <span className={styles.leftText}>申请人姓名:</span>
                  </div>
                  <Input
                    value={this.store.state.repair.repair_name}
                    placeholder="请输入您的姓名"
                    className={styles.input}
                    allowClear={true}
                    maxLength={50}
                    onChange={this.handleNameChange}
                  />
                </div>
                <div className={styles.item2}>
                  <div className={styles.left}>
                    <span className={styles.leftText}>申请人电话:</span>
                  </div>
                  <Input
                    value={this.store.state.repair.repair_phone}
                    placeholder="请输入您的电话号码"
                    maxLength={30}
                    className={styles.input}
                    allowClear={true}
                    onChange={this.handlePhoneChange}
                  />
                </div>
                <div className={styles.item2}>
                  <div className={styles.left}>
                    <span className={styles.leftText}>申请人地址:</span>
                  </div>
                  <Cascader
                    options={toJS(this.store.state.regionData)}
                    onChange={this.handleCascaderChange}
                    placeholder="请选择省市区"
                    value={toJS(this.store.state.cascaderValue)}
                    allowClear={true}
                    className={styles.cas}
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                      children: 'children'
                    }}
                  />
                </div>
                <div className={styles.item2}>
                  <div className={styles.left}>
                    <span className={styles.leftText}>{''}</span>
                  </div>
                  <Input
                    value={this.store.state.repair.repair_address}
                    placeholder="请输入详细地址"
                    className={styles.input}
                    allowClear={true}
                    onChange={this.handleAddressDetailChange}
                  />
                </div>
                <div className={styles.item2}>
                  <div className={styles.left}>
                    <span className={styles.leftText}>申请机具:</span>
                  </div>
                  <div className={styles.sns}>
                    <div className={styles.minContentCon}>
                      <div className={styles.content}>
                        {this.renderSelectedSn()}
                        <input
                          type="text"
                          className={styles.snInput}
                          onChange={this.handleSnInputChange}
                          value={this.store.state.snInputValue}
                          onKeyUp={this.onKeyUp}
                          onBlur={this.handleSnInputOnBlur}
                        />
                      </div>
                    </div>
                    <span className={styles.notice}>
                      请输入SN，多个请用逗号隔开例如：T1088888888，T102888888；最多可同时报修20台机具。
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.nextCon} onClick={this.goToNext}>
                <span className={styles.btn}>下一步</span>
              </div>
            </div>
          </If>
          <If data={this.store.state.currentStep === 1}>
            <SecondStep
              goBack={this.showRightContent}
              store={this.store}
              goNext={this.goToNext}
            />
          </If>
          <If data={this.store.state.currentStep === 2}>
            <ThreeStep goBack={this.showRightContent} store={this.store} />
          </If>
        </div>
      </div>
    );
  }
}
