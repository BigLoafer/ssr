import { Cascader, Icon, Popover, Table } from 'antd';
import { If } from 'app/ui';
import { toJS } from 'mobx';
import React from 'react';
import styles from './SecondStepTable.less';

const resons = [
  '该机具已经报修，无法重复报修',
  ' SN不正确，请重新确认',
  '该机具不属于您的账户，无法报修'
];

export default class SecondStepTable extends React.Component<any> {
  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    this.props.changeSelectedRowKeys(selectedRowKeys , selectedRows);
  };

  render() {
    const columns = [
      {
        title: 'SN',
        dataIndex: 'sn',
        key: 'sn',
        render: (text: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '机型',
        dataIndex: 'machine_name',
        key: 'machine_name',
        render: (text: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '状态',
        dataIndex: 'repair_status',
        key: 'repair_status',
        render: (text: any, record: any) => {
          let content = '';
          if (text !== 1) {
            content = resons[text - 2];
          }
          return (
            <span className={styles.text}>
              {text === 1 ? (
                '可报修'
              ) : (
                <Popover content={content}>
                  <span>不可报修</span>
                </Popover>
              )}
            </span>
          );
        }
      },
      {
        title: '故障类别',
        dataIndex: 'mal_a_name',
        width: 240,
        key: 'mal_a_name',
        render: (text: any, record: any) => {
          let des = '';
          let cascaderValue: any = [];
          if (record.mal_a_id) {
            cascaderValue = [record.mal_a_id, record.mal_b_id];
          } else {
            cascaderValue = [];
          }
          if (record.mal_a_name) {
            des = `${record.mal_a_name}/${record.mal_b_name}`;
          } else {
            des = '请选择故障类别';
          }
          if (record.showCascader) {
            return (
              <Cascader
                options={this.props.cascaderData}
                onChange={(value, selectedOptions) =>
                  this.props.handleCascaderChange(
                    value,
                    selectedOptions,
                    record
                  )
                }
                value={cascaderValue}
                popupVisible={true}
                onPopupVisibleChange={this.props.onPopupVisibleChange}
                placeholder="选择故障"
                fieldNames={{
                  label: 'fault_name',
                  value: 'id',
                  children: 'items'
                }}
                allowClear={false}
              />
            );
          } else {
            return (
              <div>
                <span className={styles.text}>{des}</span>
                <If data={record.repair_status === 1}>
                  <Icon
                    type="edit"
                    style={{ marginLeft: '4px', cursor: 'pointer' }}
                    onClick={() => this.props.edit(record)}
                  />
                </If>
              </div>
            );
          }
        }
      },
      {
        title: '收件人姓名',
        dataIndex: 'receive_name',
        key: 'receive_name',
        render: (text: any, record: any) => {
          return (
            <span
              className={styles.status}
              // onClick={() => this.props.showModal(record)}
            >
              {text}
            </span>
          );
        }
      },
      {
        title: '收件人电话',
        dataIndex: 'receive_phone',
        key: 'receive_phone',
        render: (text: any, record: any) => {
          return <span className={styles.text}>{text}</span>;
        }
      },
      {
        title: '收件人地址',
        dataIndex: 'receive_address',
        width: 320,
        key: 'receive_address',
        render: (text: any, record: any) => {
          return (
            <div className={styles.addressCon}>
              <div className={styles.test}>
                <span className={styles.text}>
                    {`${record.receive_province}${record.receive_city}${
                      record.receive_area
                    }${text}`}
                  </span>
              </div>
              <If data={record.repair_status === 1}>
                <Icon
                  type="edit"
                  style={{ marginLeft: '4px', cursor: 'pointer' }}
                  onClick={() => this.props.showModal(record)}
                />
              </If>
            </div>
          );
        }
      }
    ];
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: (record: any) => ({
        disabled: record.repair_status !== 1
      })
    };
    return (
      <div className={styles.container}>
        <Table
          rowKey={(record: any) => record.cache_id}
          columns={columns}
          dataSource={toJS(this.props.dataSource)}
          bordered={false}
          rowSelection={rowSelection}
          pagination={false}
        />
      </div>
    );
  }
}
