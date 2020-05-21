import { Button } from 'antd';
import { If } from 'app/ui';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { any } from 'prop-types';
import React from 'react';
import ApplicationStore from '../store/ApplicationStore';
import { QuestionModal, ReceiveInfoModal } from './index';
import styles from './SecendStep.less';
import SecondStepTable from './SecondStepTable';

@observer
export default class SecendStep extends React.Component<any> {
  store: ApplicationStore;
  constructor(props: any) {
    super(props);
    this.store = this.props.store;
  }

  showQuetionModal = () => {
    this.store.state.modal.questionModalVisable = true;
  };

  showReceiveInfoModal = () => {
    this.store.state.isBatchUpdateReceive = true;
    this.store.changeReceiveData();
  };

  showSingleReceiveInfoModal = (obj: any) => {
    this.store.state.isBatchUpdateReceive = false;
    this.store.changeReceiveData(obj);
  };

  handleQuetionModalOk = () => {
    this.store.updateMalfunction();
  };

  handlereceiveInfoModalOk = () => {
    this.store.updateReceiveInfo();
  };

  handlereceiveInfoCancle = () => {
    this.store.state.modal.receiveInfoModalVisable = false;
  };

  handleQuetionModalCancle = () => {
    this.store.state.modal.questionModalVisable = false;
  };

  handleQuestionModalCascaderChange = (value: any) => {
    this.store.state.malFunction.mal_a_id = value[0];
    this.store.state.malFunction.mal_b_id = value[1];
  };

  editSingleQuestion = (obj: any) => {
    this.store.state.userSelectMachineData.map((item: any) => {
      if (item.cache_id === obj.cache_id) {
        item.showCascader = true;
      } else {
        item.showCascader = false;
      }
    });
    this.store.getMalfunctionBySn({ sn_list: [`${obj.sn}`] });
  };

  handleCascaderChange = (value: any, options: any, obj: any) => {
    const data: any = this.store.state.userSelectMachineData.find(
      (item: any) => item.cache_id === obj.cache_id
    );
    if (data) {
      data.mal_a_id = value[0];
      data.mal_b_id = value[1];
      data.mal_a_name = options[0].fault_name;
      data.mal_b_name = options[1].fault_name;
      data.showCascader = false;
    }
    this.store.state.malFunction.cache_id_list.length = 0;
    this.store.state.malFunction = {
      ...{
        cache_id_list: [data.cache_id],
        mal_a_id: value[0],
        mal_b_id: value[1]
      }
    };
    this.store.updateMalfunction();
  };

  selectedRowKeys = (keys: [], rows: []) => {
    if (keys.length > 0) {
      this.store.state.manFunctionBtnDisable = false;
      const arr: any = [];
      this.store.state.malFunction.cache_id_list = [];
      this.store.state.receiveP.cache_id_list = [];
      rows.forEach((item: any) => {
        if (item.sn) {
          arr.push(item.sn);
          this.store.state.malFunction.cache_id_list.push(item.cache_id);
          this.store.state.receiveP.cache_id_list.push(item.cache_id);
        }
      });
      this.store.getMalfunctionBySn({ sn_list: arr });
    } else {
      this.store.state.manFunctionBtnDisable = true;
    }
  };

  handleReceiveModalNameInputChange = (e: any) => {
    if (!this.store.state.isBatchUpdateReceive) {
      this.store.changeReceiveData({ receive_name: e.target.value });
    } else {
      this.store.state.receiveP.receive_name = e.target.value;
    }
  };

  handleReceiveModalPhoneInputChange = (e: any) => {
    if (!this.store.state.isBatchUpdateReceive) {
      this.store.changeReceiveData({ receive_phone: e.target.value });
    } else {
      this.store.state.receiveP.receive_phone = e.target.value;
    }
  };

  handleReceiveModaladdressCascaderChange = (value: any) => {
    if (!this.store.state.isBatchUpdateReceive) {
      this.store.changeReceiveData({
        receive_p_id: value[0],
        receive_c_id: value[1],
        receive_a_id: value[2]
      });
    } else {
      this.store.state.receiveP.receive_p_id = value[0];
      this.store.state.receiveP.receive_c_id = value[1];
      this.store.state.receiveP.receive_a_id = value[2];
      this.store.state.receiveP.receive_id = value;
    }
  };

  handleReceiveModaladdressInputChange = (e: any) => {
    if (!this.store.state.isBatchUpdateReceive) {
      this.store.changeReceiveData({
        receive_address: e.target.value
      });
    } else {
      this.store.state.receiveP.receive_address = e.target.value;
    }
  };

  handlePopupVisibleChange = (value: any) => {
    if (!value) {
      this.store.state.userSelectMachineData = 
      this.store.state.userSelectMachineData.map(
        (item: any) => ({
          ...item,
          ...{ showCascader: false }
        })
      );
    }
  };

  goToBack = () => {
    this.props.goBack('2');
  };

  goToNext = () => {
    this.props.goNext('2');
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <Button
            className={styles.btn}
            type="primary"
            disabled={this.store.state.manFunctionBtnDisable}
            onClick={this.showQuetionModal}
          >
            调整故障类别
          </Button>
          <Button
            className={styles.btn2}
            type="primary"
            disabled={this.store.state.manFunctionBtnDisable}
            onClick={this.showReceiveInfoModal}
          >
            调整收件人信息
          </Button>
        </div>
        <SecondStepTable
          dataSource={toJS(this.store.state.userSelectMachineData)}
          showModal={this.showSingleReceiveInfoModal}
          edit={this.editSingleQuestion}
          changeSelectedRowKeys={this.selectedRowKeys}
          handleCascaderChange={this.handleCascaderChange}
          cascaderData={toJS(this.store.state.currentSnMalfunctionData)}
          onPopupVisibleChange={this.handlePopupVisibleChange}
        />
        <div className={styles.bottom}>
          <Button className={styles.nextStep} onClick={this.goToBack}>
            上一步
          </Button>
          <Button
            type="primary"
            className={styles.nextStep}
            onClick={this.goToNext}
          >
            下一步
          </Button>
        </div>
        <If data={this.store.state.modal.questionModalVisable}>
          <QuestionModal
            visible={this.store.state.modal.questionModalVisable}
            handleOk={this.handleQuetionModalOk}
            handleCancel={this.handleQuetionModalCancle}
            handleCascaderChange={this.handleQuestionModalCascaderChange}
            options={toJS(this.store.state.currentSnMalfunctionData)}
          />
        </If>
        <ReceiveInfoModal
          visible={this.store.state.modal.receiveInfoModalVisable}
          handleOk={this.handlereceiveInfoModalOk}
          handleCancel={this.handlereceiveInfoCancle}
          nameInputChange={this.handleReceiveModalNameInputChange}
          phoneInputChange={this.handleReceiveModalPhoneInputChange}
          addressCascaderChange={this.handleReceiveModaladdressCascaderChange}
          addressDetailInputChange={this.handleReceiveModaladdressInputChange}
          nameInputValue={this.store.state.receiveP.receive_name}
          phoneInputValue={this.store.state.receiveP.receive_phone}
          addressCascaderValue={toJS(this.store.state.receiveP.receive_id)}
          addressDetailInputValue={this.store.state.receiveP.receive_address}
          options={toJS(this.store.state.regionData)}
        />
      </div>
    );
  }
}
