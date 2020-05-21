import { post } from 'app/fetch';

export const partnerRepairlist = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairquery/partnerrepairlist';
  return post(api, opts);
};

export const partnrExportTasks = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairquery/partnerexporttasks';
  return post(api, opts);
};

export const getAllaCcount = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairquery/getallaccount';
  return post(api, opts);
};

export const detail = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairtasks/detail';
  return post(api, opts);
};

export const updateExpress = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairtasks/updateexpress';
  return post(api, opts);
};

export const process = (options?: any) => {
  const opts = {
    ...options
  };
  const api = '/partner/partnerrepairtasks/process';
  return post(api, opts);
};
