import { Table } from 'antd';
import { toJS } from 'mobx';
import moment from 'moment';
import React from 'react';
import styles from './AfterSaleTable.less';

export default class AfterSaleTable extends React.Component<any> {
  render() {
    const columns = [
      {
        title: '报修时间',
        dataIndex: 'repair_date',
        key: 'repair_date',
        render: (text: any) => {
          return (
            <span className={styles.text}>
              {moment.unix(text).format('YYYY-MM-DD')}
            </span>
          );
        }
      },
      {
        title: '报修人',
        dataIndex: 'maintenance_person',
        key: 'maintenance_person',
        render: (text: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: 'SN',
        dataIndex: 'sn',
        key: 'sn',
        width: 240,
        render: (text: any, record: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '机型',
        dataIndex: 'model',
        key: 'model',
        render: (text: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '当前状态',
        dataIndex: 'current_status',
        key: 'current_status',
        render: (text: any, record: any) => {
          return (
            <span
              className={styles.status}
              onClick={() => this.props.showModal(record)}
            >
              {text}
            </span>
          );
        }
      },
      {
        title: '故障类别',
        dataIndex: 'malfunction_name',
        key: 'malfunction_name',
        render: (text: any, record: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '是否保修',
        dataIndex: 'type',
        key: 'type',
        render: (text: any, record: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => {
          return (
            <a
              href={`/afterSale/afterSaleProgress/detail?id=${record.id}&dId=${
                this.props.dId
              }`}
            >
              详情
            </a>
          );
        }
      }
    ];
    return (
      <div className={styles.container}>
        <Table
          rowKey={(_, index) => index.toString()}
          columns={columns}
          dataSource={toJS(this.props.dataSource)}
          bordered={false}
          pagination={this.props.pagination}
        />
      </div>
    );
  }
}
