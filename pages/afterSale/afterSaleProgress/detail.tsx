import { Button, Input, Modal } from 'antd';
import { If, withPartnerAuth } from 'app/ui';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import styles from './detail.less';
import AStore from './store/AStore';

@observer
class Detail extends React.Component<any> {
  store: AStore;
  constructor(props: any) {
    super(props);
    this.store = new AStore();
  }

  componentDidMount() {
    const { id } = this.props.query;
    this.store.changeDetailParams({ task_id: id });
  }

  showPicMask = (url: string) => {
    this.store.changeState({ picMaskVisable: true });
    this.store.state.maskCurrentPicUrl = url;
  };

  closePicMask = () => {
    this.store.changeState({ picMaskVisable: false });
  };

  showStationInfo = () => {
    this.store.changeState({ stationModalVisable: true });
  };

  handleStationModalClose = () => {
    this.store.changeState({ stationModalVisable: false });
  };

  handleCompanyInputChange = (e: any) => {
    this.store.params.logistics.express_com = e.target.value;
  };

  handleNumberInputChange = (e: any) => {
    this.store.params.logistics.express_no = e.target.value;
  };

  updateCompany = () => {
    this.store.changeState({ updateLogisticsCompany: true });
  };

  updateNumber = () => {
    this.store.changeState({ updateLogisticsNumber: true });
  };

  cancleUpdateCompany = () => {
    this.store.changeState({ updateLogisticsCompany: false });
    this.store.initLogisticsParams({ type: 'comp' });
  };

  cancleUpdateNumber = () => {
    this.store.changeState({ updateLogisticsNumber: false });
    this.store.initLogisticsParams({ type: 'num' });
  };

  okUpdateCompany = () => {
    this.store.updateExpress({ type: 1 });
  };

  okUpdateNumber = () => {
    this.store.updateExpress({ type: 2 });
  };

  renderStationModal = () => {
    const { station_info } = this.store.state.detailData;
    const {
      station_address,
      station_area,
      station_city,
      station_province,
      station_tel,
      station_user
    } = station_info ? station_info : '';
    return (
      <Modal
        title="站点"
        visible={this.store.state.stationModalVisable}
        onCancel={this.handleStationModalClose}
        footer={
          <Button type="primary" onClick={this.handleStationModalClose}>
            关闭
          </Button>
        }
        width={640}
      >
        <div className={styles.stationModalContentContainer}>
          <div className={styles.modalItem}>
            <div className={styles.modalItemTitle}>
              <span className={styles.info_itemText}>联系人：</span>
            </div>
            <div className={styles.modalItemDes}>
              <span className={styles.info_itemDes}>{station_user}</span>
            </div>
          </div>
          <div className={styles.modalItem2}>
            <div className={styles.modalItemTitle}>
              <span className={styles.info_itemText}>联系电话：</span>
            </div>
            <div className={styles.modalItemDes}>
              <span className={styles.info_itemDes}>{station_tel}</span>
            </div>
          </div>
          <div className={styles.modalItem2}>
            <div className={styles.modalItemTitle}>
              <span className={styles.info_itemText}>地址：</span>
            </div>
            <div className={styles.modalItemDes}>
              <span className={styles.info_itemDes}>
                {`${station_province}${station_city}${station_area}
                ${station_address}`}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const {
      machine_info,
      receive_info,
      repair_info,
      station_info,
      task_info
    } = this.store.state.detailData;
    const {
      channel_name,
      curr_warr_date,
      machine_name,
      machine_spec,
      sn,
      warr_msg
    } = machine_info ? machine_info : '';
    const {
      repair_name,
      repair_phone,
      repair_address,
      repair_province,
      repair_city,
      repair_area,
      repair_time
    } = repair_info ? repair_info : '';
    const {
      receive_name,
      receive_address,
      receive_phone,
      receive_province,
      receive_city,
      receive_area,
      sendback_express_com,
      sendback_express_no
    } = receive_info ? receive_info : '';
    const {
      status,
      status_name,
      express_com,
      express_no,
      pb_fact,
      malfunction_a,
      malfunction_b,
      guarantee_type,
      solution,
      no_guarantee_reason,
      problem_pic,
      task_type,
      new_sn
    } = task_info ? task_info : '';
    const { station_name } = station_info ? station_info : '';

    return (
      <div className={styles.container}>
        <span className={styles.topText}>机具信息</span>
        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>S/N：</span>
            <span className={styles.info_itemDes}>{sn}</span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>机型：</span>
            <span className={styles.info_itemDes}>{machine_name}</span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>规格：</span>
            <span className={styles.info_itemDes}>{machine_spec}</span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>运营商：</span>
            <span className={styles.info_itemDes}>{channel_name}</span>
          </div>
          <div className={styles.info_item_2}>
            <span className={styles.info_itemText}>保修状态：</span>
            <span className={styles.info_itemDes}>{warr_msg}</span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>保修期至：</span>
            <span className={styles.info_itemDes}>
              {curr_warr_date &&
                moment.unix(curr_warr_date).format('YYYY-MM-DD')}
            </span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>报修人：</span>
            <span className={styles.info_itemDes}>{repair_name}</span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>报修人电话：</span>
            <span className={styles.info_itemDes}>{repair_phone}</span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>报修人地址：</span>
            <span className={styles.info_itemDes}>
              {repair_province &&
                `${repair_province}${repair_city}${repair_area}
                ${repair_address}`}
            </span>
          </div>
        </div>
        <div className={styles.line} />

        <span className={styles.titleText}>维修信息</span>
        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>当前状态：</span>
            <span className={styles.info_itemDes}>{status_name}</span>
          </div>
          <div className={styles.info_item_2}>
            <span className={styles.info_itemText}>处理站点：</span>
            <span
              className={styles.info_itemDes_color}
              onClick={this.showStationInfo}
            >
              {station_name}
            </span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>报修时间：</span>
            <span className={styles.info_itemDes}>
              {repair_time &&
                moment.unix(repair_time).format('YYYY-MM-DD HH:mm')}
            </span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>物流公司(寄)：</span>
            <If data={!this.store.state.updateLogisticsCompany}>
              <span className={styles.info_itemDes}>
                {this.store.params.logistics.express_com
                  ? this.store.params.logistics.express_com
                  : '--'}
                <If data={status === 12}>
                  <span className={styles.update} onClick={this.updateCompany}>
                    修改
                  </span>
                </If>
              </span>
            </If>

            <If data={this.store.state.updateLogisticsCompany}>
              <div className={styles.updateCon}>
                <Input
                  value={this.store.params.logistics.express_com}
                  style={{ width: 128 }}
                  onChange={this.handleCompanyInputChange}
                  maxLength={5}
                />
                <span
                  className={styles.update}
                  onClick={this.cancleUpdateCompany}
                >
                  取消
                </span>
                <span className={styles.update} onClick={this.okUpdateCompany}>
                  保存
                </span>
              </div>
            </If>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>物流单号(寄)：</span>
            <If data={!this.store.state.updateLogisticsNumber}>
              <span className={styles.info_itemDes}>
                {this.store.params.logistics.express_no
                  ? this.store.params.logistics.express_no
                  : '--'}
                <If data={status === 12}>
                  <span className={styles.update} onClick={this.updateNumber}>
                    修改
                  </span>
                </If>
              </span>
            </If>

            <If data={this.store.state.updateLogisticsNumber}>
              <div className={styles.updateCon}>
                <Input
                  value={this.store.params.logistics.express_no}
                  style={{ width: 128 }}
                  onChange={this.handleNumberInputChange}
                />
                <span
                  className={styles.update}
                  onClick={this.cancleUpdateNumber}
                >
                  取消
                </span>
                <span className={styles.update} onClick={this.okUpdateNumber}>
                  保存
                </span>
              </div>
            </If>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>实际故障：</span>
            <span className={styles.info_itemDes}>
              {pb_fact ? pb_fact : '--'}
            </span>
          </div>
          <div
            className={
              guarantee_type === 1 ? styles.info_item : styles.info_item_2
            }
          >
            <span className={styles.info_itemText}>故障类别：</span>
            <span className={styles.info_itemDes}>
              {malfunction_a ? `${malfunction_a}/${malfunction_b}` : '--'}
            </span>
          </div>
          <If data={guarantee_type === 1}>
            <div className={styles.info_item}>
              <span className={styles.info_itemText}>是否保修：</span>
              <span className={styles.info_itemDes}>
                {guarantee_type === 1 ? '是' : '否'}
              </span>
            </div>
          </If>
        </div>

        <If data={guarantee_type === 1}>
          <div className={styles.info}>
            <div className={styles.info_item_2}>
              <span className={styles.info_itemText}>维修方案：</span>
              <span className={styles.info_itemDes}>
                {solution ? solution : '--'}
              </span>
            </div>
            <If data={task_type === 3}>
              <div className={styles.info_item}>
                <span className={styles.info_itemText}>新机SN：</span>
                <span className={styles.info_itemDes}>
                  {new_sn ? new_sn : '--'}
                </span>
              </div>
            </If>
          </div>
        </If>

        <If data={guarantee_type === 2}>
          <div className={styles.noBao}>
            <div className={styles.info}>
              <div className={styles.info_item}>
                <span className={styles.info_itemText}>是否保修：</span>
                <span className={styles.info_itemDes}>否</span>
              </div>
              <div className={styles.info_item}>
                <span className={styles.info_itemText}>维修方案：</span>
                <span className={styles.info_itemDes}>
                  {solution ? solution : '--'}
                </span>
              </div>
              <div className={styles.info_item}>
                <span className={styles.info_itemText}>非保原因：</span>
                <span className={styles.info_itemDes}>
                  {no_guarantee_reason ? no_guarantee_reason : '--'}
                </span>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.info_item}>
                <span className={styles.info_itemText}>故障图片：</span>
                <div className={styles.repairPicContainer}>
                  {problem_pic && problem_pic.length > 0
                    ? problem_pic.map((item: any, index: any) => (
                        <img
                          src={item}
                          alt=""
                          className={styles.pic}
                          onClick={() => this.showPicMask(item)}
                          key={index}
                        />
                      ))
                    : '--'}
                </div>
              </div>
            </div>
          </div>
        </If>

        <div className={styles.line} />

        <span className={styles.titleText}>收件信息</span>
        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>收件人：</span>
            <span className={styles.info_itemDes}>
              {receive_name ? receive_name : '--'}
            </span>
          </div>
          <div className={styles.info_item_2}>
            <span className={styles.info_itemText}>收件人地址：</span>
            <span className={styles.info_itemDes}>
              {receive_province
                ? `${receive_province}${receive_city}${receive_area}
                ${receive_address}`
                : '--'}
            </span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>收件人电话：</span>
            <span className={styles.info_itemDes}>
              {receive_phone ? receive_phone : '--'}
            </span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>物流公司：</span>
            <span className={styles.info_itemDes}>
              {sendback_express_com ? sendback_express_com : '--'}
            </span>
          </div>
          <div className={styles.info_item}>
            <span className={styles.info_itemText}>物流单号：</span>
            <span className={styles.info_itemDes}>
              {sendback_express_no ? sendback_express_no : '--'}
            </span>
          </div>
        </div>

        <If data={this.store.state.picMaskVisable}>
          <div className={styles.maskContainer}>
            <div className={styles.picMask}>
              <div style={{ margin: 'auto' }}>
                <img src={this.store.state.maskCurrentPicUrl} alt="" />
              </div>
              <Button className={styles.btn} onClick={this.closePicMask}>
                关闭
              </Button>
            </div>
          </div>
        </If>
        {this.renderStationModal()}
      </div>
    );
  }
}

// Detail

export default Detail;
