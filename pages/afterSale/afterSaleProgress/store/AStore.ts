import { message } from 'antd';
import _ from 'lodash';
import { action, observable, toJS } from 'mobx';
import {
  detail,
  getAllaCcount,
  partnerRepairlist,
  partnrExportTasks,
  process,
  updateExpress
} from '../apis';

export default class AStore {
  @observable state = {
    modalVisable: false,
    picMaskVisable: false,
    stationModalVisable: false,
    updateLogisticsCompany: false,
    updateLogisticsNumber: false,
    detailData: {} as any,
    maskCurrentPicUrl: '',
    listData: [],
    listDataCount: 0,
    accountData: [],
    taskProcessData: [],
    taskProcessCurrentStep: 0
  };
  @observable params = {
    listParams: {
      repair_start_date: '',
      repair_end_date: '',
      account: undefined,
      work_status: 0,
      search_key: '',
      page: 1
    },
    detailParams: {
      task_id: ''
    },
    logistics: {
      task_id: '',
      express_com: '',
      express_no: ''
    }
  };

  @action
  changeState = (newState: any) => {
    this.state = {
      ...this.state,
      ...newState
    };
  };

  @action
  changeListParams = (obj: any) => {
    this.params.listParams = {
      ...this.params.listParams,
      ...obj
    };
    this.getPartnerRepairlist();
  };

  @action
  changeDetailParams = (obj: any) => {
    this.params.detailParams = {
      ...this.params.detailParams,
      ...obj
    };
    this.getTaskDetail();
  };

  @action
  getTaskDetail = async () => {
    try {
      const json: any = await detail(this.params.detailParams);
      this.state.detailData = json.data;
      this.initLogisticsParams({ type: 'all' });
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '未知错误');
    }
  };

  @action
  initLogisticsParams = (obj?: any) => {
    switch (obj.type) {
      case 'num':
        this.params.logistics = {
          ...this.params.logistics,
          ..._.pick(this.state.detailData.task_info, ['task_id', 'express_no'])
        };
        break;
      case 'comp':
        this.params.logistics = {
          ...this.params.logistics,
          ..._.pick(this.state.detailData.task_info, ['task_id', 'express_com'])
        };
        break;

      default:
        this.params.logistics = {
          ...this.params.logistics,
          ..._.pick(this.state.detailData.task_info, [
            'task_id',
            'express_com',
            'express_no'
          ])
        };
        break;
    }
  };

  @action
  updateExpress = async (obj?: any) => {
    try {
      const json: any = await updateExpress(this.params.logistics);
      if (obj.type === 1) {
        this.changeState({ updateLogisticsCompany: false });
      } else {
        this.changeState({ updateLogisticsNumber: false });
      }
      message.success('修改成功');
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '未知错误');
    }
  };

  @action
  getPartnerRepairlist = async () => {
    try {
      const json: any = await partnerRepairlist(this.params.listParams);
      this.state.listDataCount = json.data.count;
      this.state.listData = json.data.result.map((item: any) => ({
        ...item,
        ...{ action: 1 }
      }));
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '未知错误');
    }
  };

  @action
  getAllaCcount = async () => {
    try {
      const json: any = await getAllaCcount();
      this.state.accountData = json.data;
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '未知错误');
    }
  };

  @action
  export = async () => {
    try {
      const json: any = await partnrExportTasks(this.params.listParams);
      window.location.href = json.data.replace('http', 'https');
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '未知错误');
    }
  };

  @action
  getProcess = async (options?: any) => {
    try {
      const json: any = await process(options);
      this.state.taskProcessData = json.data.process.process;
      this.state.taskProcessCurrentStep = json.data.process.index - 1;
    } catch (error) {
      message.error(error.msg ? `${error.msg}` : '未知错误');
    }
  };
}
