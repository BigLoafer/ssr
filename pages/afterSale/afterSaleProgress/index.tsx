import { Button, DatePicker, Input, Modal, Select, Steps } from 'antd';
import { withPartnerAuth } from 'app/ui';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import AfterSaleTable from './component/AfterSaleTable';
import styles from './index.less';
import AStore from './store/AStore';
const { RangePicker } = DatePicker;
const Option = Select.Option;
const Search = Input.Search;
const Step = Steps.Step;

@observer
export default class AfterSaleProgress extends React.Component<any> {
  store: AStore;

  constructor(props: any) {
    super(props);
    this.store = new AStore();
  }

  componentDidMount() {
    this.store.getPartnerRepairlist();
    this.store.getAllaCcount();
  }

  onRpChange = (date: any, dateString: any) => {
    this.store.changeListParams({
      repair_start_date: dateString[0],
      repair_end_date: dateString[1]
    });
  };

  handleAccountSelectChange = (value: any) => {
    this.store.changeListParams({ account: value });
  };

  handleTypeSelectChange = (value: any) => {
    this.store.changeListParams({ work_status: value });
  };

  handleOnSearch = (value: any) => {
    this.store.changeListParams({ search_key: value });
  };

  onShowSizeChange = (current: any, size: any) => {
    this.store.changeListParams({
      page: current
    });
  };

  onChange = (cpage: any, pageSize: any) => {
    this.store.changeListParams({
      page: cpage
    });
  };

  handleModalClose = () => {
    this.store.state.modalVisable = false;
  };

  handleModalShow = (obj: any) => {
    this.store.getProcess({ task_id: obj.id });
    this.store.state.modalVisable = true;
  };

  exportTask = () => {
    this.store.export();
  };

  renderModal = () => {
    return (
      <Modal
        title="当期状态"
        visible={this.store.state.modalVisable}
        onCancel={this.handleModalClose}
        footer={
          <Button type="primary" onClick={this.handleModalClose}>
            确定
          </Button>
        }
      >
        <Steps
          direction="vertical"
          size="small"
          current={this.store.state.taskProcessCurrentStep}
        >
          {this.store.state.taskProcessData.map((item: any, index: any) => (
            <Step
              title={item.name}
              description={
                item.time ? moment.unix(item.time).format('YYYY-MM-DD') : ''
              }
              key={index}
            />
          ))}
        </Steps>
      </Modal>
    );
  };

  render() {
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
      showQuickJumper: true,
      pageSizeOptions: ['15'],
      onChange: this.onChange,
      total: this.store.state.listDataCount,
      defaultPageSize: 15
    };

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <span className={styles.repairText}>报修时间:</span>
          <RangePicker
            onChange={this.onRpChange}
            disabledDate={(date: any) => date > moment()}
          />
          <Select
            style={{ width: 168, marginLeft: 16 }}
            onChange={this.handleAccountSelectChange}
            placeholder="请选择账户"
          >
            {this.store.state.accountData.map((item: any) => (
              <Option value={item.dId} key={item.dId}>
                {item.brand_name}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: 128, marginLeft: 16 }}
            onChange={this.handleTypeSelectChange}
            defaultValue="0"
          >
            <Option value="0">全部</Option>
            <Option value="2">处理中</Option>
            <Option value="3">已完成</Option>
          </Select>
          <Search
            placeholder="请输入SN,手机号"
            onSearch={this.handleOnSearch}
            style={{ width: 200, marginLeft: 16 }}
          />
          <div className={styles.empty} />
          <Button
            type="primary"
            className={styles.btn}
            onClick={this.exportTask}
          >
            导出
          </Button>
        </div>
        <AfterSaleTable
          pagination={pagination}
          dataSource={this.store.state.listData}
          showModal={this.handleModalShow}
          dId={this.props.query.dId}
        />
        {this.renderModal()}
      </div>
    );
  }
}
