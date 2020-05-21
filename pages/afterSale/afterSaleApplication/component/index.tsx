import { Cascader, Input, Modal } from 'antd';
import React from 'react';
import styles from './index.less';

export const QuestionModal = (props: any) => {
  const {
    visible,
    handleOk,
    handleCancel,
    handleCascaderChange,
    options
  } = props;
  const title = (
    <div className={styles.titleCon}>
      <span className={styles.title}>故障类别</span>
      <span className={styles.subtitle}>批量调整</span>
    </div>
  );

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={640}
    >
      <div className={styles.questionModalItem}>
        <div className={styles.type}>
          <span>故障类别:&nbsp;&nbsp;</span>
        </div>
        <Cascader
          options={options}
          onChange={handleCascaderChange}
          placeholder="请选择故障类别"
          className={styles.cas}
          allowClear={false}
          fieldNames={{
            label: 'fault_name',
            value: 'id',
            children: 'items'
          }}
        />
      </div>
    </Modal>
  );
};

export const ReceiveInfoModal = (props: any) => {
  const {
    visible,
    handleOk,
    handleCancel,
    addressCascaderChange,
    nameInputChange,
    phoneInputChange,
    addressDetailInputChange,
    nameInputValue,
    phoneInputValue,
    addressCascaderValue,
    addressDetailInputValue,
    options
  } = props;
  const title = (
    <div className={styles.titleCon}>
      <span className={styles.title}>收件人信息</span>
      <span className={styles.subtitle}>批量调整</span>
    </div>
  );

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={640}
    >
      <div className={styles.questionModalItem}>
        <div className={styles.type}>
          <span>姓名:&nbsp;&nbsp;</span>
        </div>
        <Input
          placeholder="请输入姓名"
          value={nameInputValue}
          onChange={nameInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.questionModalItem2}>
        <div className={styles.type}>
          <span>电话:&nbsp;&nbsp;</span>
        </div>
        <Input
          placeholder="请输入手机号码"
          onChange={phoneInputChange}
          className={styles.input}
          value={phoneInputValue}
          maxLength={30}
        />
      </div>
      <div className={styles.questionModalItem2}>
        <div className={styles.type}>
          <span>地址:&nbsp;&nbsp;</span>
        </div>
        <Cascader
          options={options}
          onChange={addressCascaderChange}
          placeholder="请选择省市区"
          className={styles.cas}
          allowClear={false}
          value={addressCascaderValue}
          fieldNames={{
            label: 'name',
            value: 'id',
            children: 'children'
          }}
        />
      </div>
      <div className={styles.questionModalItem2}>
        <div className={styles.type} />
        <Input
          placeholder="请输入详细地址"
          onChange={addressDetailInputChange}
          className={styles.input}
          value={addressDetailInputValue}
        />
      </div>
    </Modal>
  );
};

export const ExpressNumberModal = (props: any) => {
  const {
    visible,
    handleOk,
    handleCancel,
    companyInputChange,
    numberInputChange,
    numberInputValue
  } = props;
  const title = (
    <div className={styles.titleCon}>
      <span className={styles.title}>快递单号录入</span>
    </div>
  );

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={640}
    >
      <div className={styles.questionModalItem}>
        <div className={styles.type}>
          <span>物流公司:&nbsp;&nbsp;</span>
        </div>
        <Input
          placeholder="请输入物流公司"
          onChange={companyInputChange}
          className={styles.input}
          maxLength={5}
        />
      </div>
      <div className={styles.questionModalItem2}>
        <div className={styles.type}>
          <span>物流单号:&nbsp;&nbsp;</span>
        </div>
        <Input
          placeholder="请输入物流单号"
          onChange={numberInputChange}
          className={styles.input}
          value={numberInputValue}
        />
      </div>
    </Modal>
  );
};
