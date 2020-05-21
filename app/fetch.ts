import { message } from 'antd';
import axios from 'axios';
import md5 from 'md5';
import { env, isEncrypted, md5Key } from './env';
import Des from './services/secure';

function resolveParams(params: any) {
  const normalizedParams = normalizeParams(params);
  return converParamsToFormData(normalizedParams);
}

function converParamsToFormData(params: any) {
  const myFormData = new FormData();
  Object.keys(params).forEach(key => {
    myFormData.append(key, params[key]);
  });
  return myFormData;
}

function normalizeParams(params: any) {
  const formData = {} as any;
  formData.timeStamp = Math.floor(new Date().getTime() / 1000);
  formData.randomNum = Math.floor(Math.random() * 1000000);
  formData.isEncrypted = isEncrypted;
  if (!params) {
    formData.params = '';
  } else {
    if (params.file) {
      formData.file = params.file;
      delete params.file;
    }
    formData.params = paramsEncode(params);
  }
  formData.sign = signEncode(formData);
  formData.lang = 'zh';
  return formData;
}

function paramsEncode(params: any) {
  const paramsString = JSON.stringify(params);
  if (isEncrypted) {
    return Des.encrypt(paramsString);
  } else {
    return paramsString;
  }
}

function signEncode(form: any) {
  if (!md5Key) {
    throw new Error('请检查配置文件！no md5Key');
  }
  const key = md5Key;
  const { params, timeStamp, randomNum } = form;
  return md5(params + isEncrypted + timeStamp + randomNum + md5(key));
}

function getUrlByHost(oneLevel: string, secLevel: string, to: number) {
  switch (env) {
    case 'dev':
    case 'test':
    case 'uat':
      if (to === 1) {
        return `https://${oneLevel}.${env}.${secLevel}`;
      } else {
        return `https://${env}.${oneLevel}.${secLevel}`;
      }
    case 'pub':
      return `https://${oneLevel}.${secLevel}`;
    default:
      return `https://${oneLevel}.${secLevel}`;
  }
}
// to: 1 代表webapi.serviceplat.sunmi.com，非1 代表webapi.sunmi.com
export function post(
  url: any,
  body: any,
  to: number = 1,
  time: number = 10000
) {
  const globbalParams = { dId: global.dId };
  let baseUrl: any = '';
  if (to === 1) {
    baseUrl = getUrlByHost('webapi-serviceplat', 'sunmi.com', to);
  } else {
    baseUrl = getUrlByHost('webapi', 'sunmi.com', to);
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      baseURL: baseUrl,
      // tslint:disable-next-line:object-literal-shorthand
      url: url,
      timeout: time,
      data: resolveParams({ ...globbalParams, ...body })
    })
      .then(res => {
        if (res.status === 200) {
          if (res.data.code === 1) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        } else {
          // reject('您的网络好像不给力');
          message.error('您的网络好像不给力');
        }
      })
      .catch(error => {
        // reject(error) ;
        message.error('您的网络好像不给力');
      });
  });
}

export function fetchToolServer(url: any, time: number = 10000) {
  const baseUrl = process.env.SP_REMOTESERVER;
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      baseURL: baseUrl,
      // tslint:disable-next-line:object-literal-shorthand
      url: url,
      timeout: time
    })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          reject('您的网络好像不给力');
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
