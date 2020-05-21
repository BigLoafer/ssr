import { message } from 'antd';
import Des from 'app/services/secure';
import { action, observable, toJS } from 'mobx';
import {
  addMachine,
  createRepairOrder,
  getMalfunctionBysnlist,
  getRepairInfo,
  getRepairstations,
  machineList,
  region,
  updateMalfunction,
  updateReceiveInfo
} from '../apis';

export default class ApplicationStore {
  @observable state = {
    isBatchUpdateReceive: false,
    manFunctionBtnDisable: true,
    submitBtnDisable: true,
    currentStep: 0,
    snInputValue: '',
    showCascader: false,
    stationData: [] as any,
    showLoadMore: false,
    regionData: [] as any,
    cascaderValue: [] as any,
    userSelectMachineData: [] as any,
    currentSnMalfunctionData: [],
    modal: {
      questionModalVisable: false,
      receiveInfoModalVisable: false
    },
    repair: {
      repair_name: '',
      repair_phone: '',
      repair_area: '',
      repair_address: '',
      sn_list: [] as any,
      repair_p_id: '',
      repair_c_id: '',
      repair_a_id: ''
    },
    receiveP: {
      receive_name: '',
      receive_phone: '',
      receive_p_id: '',
      receive_c_id: '',
      receive_a_id: '',
      receive_id: [] as any,
      receive_address: '',
      cache_id_list: [] as any
    },
    malFunction: {
      cache_id_list: [] as any,
      mal_a_id: '',
      mal_b_id: ''
    }
  };
  serviceStationData = [];

  @action
  changeSnData = () => {
    this.state.repair.sn_list.push(this.state.snInputValue);
    this.state.snInputValue = '';
  };

  @action
  changeReceiveData = (obj?: any) => {
    this.state.modal.receiveInfoModalVisable = true;
    if (obj) {
      this.state.receiveP = {
        ...this.state.receiveP,
        ...obj
      };
      if (obj.receive_p_id) {
        this.state.receiveP = {
          ...this.state.receiveP,
          ...{
            receive_id: [obj.receive_p_id, obj.receive_c_id, obj.receive_a_id]
          }
        };
      }
      if (obj.cache_id) {
        this.state.receiveP = {
          ...this.state.receiveP,
          ...{ cache_id_list: [obj.cache_id] }
        };
      }
    } else {
      this.initReceiveP();
    }
  };

  @action
  initReceiveP = () => {
    this.state.receiveP = {
      ...this.state.receiveP,
      ...{
        receive_name: '',
        receive_phone: '',
        receive_p_id: '',
        receive_c_id: '',
        receive_a_id: '',
        receive_address: '',
        receive_id: []
        // cache_id_list: []
      }
    };
  };

  @action
  getRepairInfo = async () => {
    try {
      const json: any = await getRepairInfo();
      this.state.repair = {
        ...this.state.repair,
        ...json.data.repair_info
      };
      if (json.data.repair_info.repair_p_id === 0) {
        this.state.cascaderValue = [];
      } else {
        this.state.cascaderValue = [
          json.data.repair_info.repair_p_id,
          json.data.repair_info.repair_c_id,
          json.data.repair_info.repair_a_id
        ];
      }
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  getRegion = async () => {
    try {
      const json: any = await region();
      this.state.regionData = json.data.list;
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  addMachine = async () => {
    try {
      const json: any = await addMachine(this.state.repair);
      this.state.currentStep = 1;
      this.getMachineList();
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  getMachineList = async () => {
    try {
      const json: any = await machineList();
      this.state.userSelectMachineData = json.data.list.map((item: any) => {
        if (item.repair_status === 1) {
          return {
            ...item,
            ...{ showCascader: false }
          };
        } else {
          return {
            ...item,
            ...{
              showCascader: false,
              mal_a_name: '--',
              mal_b_name: '--',
              receive_name: '--',
              receive_phone: '--',
              receive_province: '',
              receive_city: '',
              receive_area: '',
              receive_address: '--'
            }
          };
        }
      });
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  getMalfunctionBySn = async (options?: any) => {
    try {
      const json: any = await getMalfunctionBysnlist(options);
      this.state.currentSnMalfunctionData = json.data.malfunction_list.map(
        (item: any) => {
          return {
            id: item.id,
            fault_name: item.fault_name,
            items: item.items.map((child: any) => ({
              ...child,
              ...{ id: child.mal_id }
            }))
          };
        }
      );
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  updateReceiveInfo = async () => {
    try {
      const json: any = await updateReceiveInfo(this.state.receiveP);
      message.success('修改成功');
      this.getMachineList();
      this.state.modal.receiveInfoModalVisable = false;
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  updateMalfunction = async () => {
    try {
      if (!this.state.malFunction.mal_a_id) {
        message.error('请现在选择故障类别');
        return;
      }
      const json: any = await updateMalfunction(this.state.malFunction);
      this.state.modal.questionModalVisable = false;
      message.success('修改成功');
      this.getMachineList();
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  getRepairstation = async () => {
    this.state.submitBtnDisable = true;
    try {
      const json: any = await getRepairstations();
      this.serviceStationData = json.data.list.map((item: any) => ({
        ...item,
        ...{ checked: false }
      }));
      if (this.serviceStationData.length > 5) {
        const obj = this.serviceStationData.splice(0, 5);
        this.state.stationData = [...this.state.stationData, ...obj];
        this.state.showLoadMore = true;
      } else {
        this.state.showLoadMore = false;
        this.state.stationData = this.serviceStationData;
      }
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };

  @action
  getLoadMore = () => {
    if (this.serviceStationData.length > 5) {
      const obj = this.serviceStationData.splice(0, 5);
      this.state.stationData = [...this.state.stationData, ...obj];
      this.state.showLoadMore = true;
    } else {
      this.state.showLoadMore = false;
      this.state.stationData = [
        ...this.state.stationData,
        ...this.serviceStationData
      ];
    }
  };

  @action
  createRepairOrder = async (id: any, router: any) => {
    try {
      const json: any = await createRepairOrder({ station_id: id });
      const data = JSON.stringify(json.data.info);
      window.location.href =
        // tslint:disable-next-line:max-line-length
        `/afterSale/afterSaleApplication/success?dId=${
          global.dId
        }&info=${Des.encrypt(data)}`;
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '系统错误');
    }
  };
}
