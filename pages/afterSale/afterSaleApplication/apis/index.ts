import { post } from 'app/fetch';

export const getRepairInfo = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/getrepairinfo';
  return post(api, opts);
};

export const region = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairtasks/regionlist';
  return post(api, opts);
};

export const addMachine = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/addmachine';
  return post(api, opts);
};

export const machineList = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/machinelist';
  return post(api, opts);
};

export const getMalfunctionBysnlist = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/getmalfunctionbysnlist';
  return post(api, opts);
};

export const updateReceiveInfo = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/updatereceiveinfobatch';
  return post(api, opts);
};

export const updateMalfunction = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/updatemalfunctiononbatch';
  return post(api, opts);
};

export const getRepairstations = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/datacache/getrepairstations';
  return post(api, opts);
};

export const createRepairOrder = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairtasks/createrepairorder';
  return post(api, opts);
};

export const updateOrderExpress = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairtasks/updateorderexpress';
  return post(api, opts);
};
