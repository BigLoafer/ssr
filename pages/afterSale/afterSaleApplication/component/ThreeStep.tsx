import { Button, Radio } from 'antd';
import { If } from 'app/ui';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Router from 'next/router';
import React from 'react';
import ApplicationStore from '../store/ApplicationStore';
import styles from './ThreeStep.less';

const StationItem = (props: any) => {
  const {
    distance,
    checked,
    station_addr,
    station_area,
    station_city,
    station_id,
    station_name,
    station_phone,
    station_prov,
    station_user
  } = props.data;
  const { callBack } = props;
  return (
    <div className="station">
      <div className={styles.itemCon} onClick={() => callBack(station_id)}>
        <Radio checked={checked} />
        <span className={styles.name}>{station_name}</span>
        <span className={styles.pName}>{station_user}</span>
        <span className={styles.phone}>{station_phone}</span>
        <span className={styles.address}>
          {`${station_prov}${station_city}${station_area}${station_addr}`}
        </span>
        <div className={styles.empty} />
        <span className={styles.juli}>{distance.toFixed(1)} KM</span>
      </div>
    </div>
  );
};

@observer
export default class ThreeStep extends React.Component<any> {
  store: ApplicationStore;
  constructor(props: any) {
    super(props);
    this.store = this.props.store;
  }

  componentDidMount() {
    this.store.getRepairstation();
  }

  loadMore = () => {
    this.store.getLoadMore();
  };

  goToBack = () => {
    this.props.goBack('3');
  };

  submit = () => {
    const sid = this.store.state.stationData.find(
      (item: any) => item.checked === true
    ).station_id;
    this.store.createRepairOrder(sid, Router);
  };

  checkStation = (sid: any) => {
    this.store.state.submitBtnDisable = false;
    this.store.state.stationData = this.store.state.stationData.map(
      (item: any) => ({ ...item, ...{ checked: item.station_id === sid } })
    );
  };

  render() {
    return (
      <div className={styles.container}>
        {this.store.state.stationData.map((item: any, index: any) => (
          <StationItem key={index} data={item} callBack={this.checkStation} />
        ))}
        <If data={this.store.state.showLoadMore}>
          <div className={styles.loadMore}>
            <span className={styles.loadMoreText} onClick={this.loadMore}>
              加载更多
            </span>
          </div>
        </If>
        <div className={styles.bottom}>
          <Button className={styles.nextStep} onClick={this.goToBack}>
            上一步
          </Button>
          <Button
            type="primary"
            className={styles.nextStep}
            onClick={this.submit}
            disabled={this.store.state.submitBtnDisable}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
