import { isClient } from '../env';
import Des from './secure';

interface SunmiStorage extends Storage {
  getItem: (key: string) => any;
}

let storage = {} as SunmiStorage;
let session = {} as SunmiStorage;

if (isClient) {
  storage = {
    length: localStorage.length,
    clear: () => {
      localStorage.clear();
    },
    getItem: (key: string): any =>
      JSON.parse(Des.decrypt(localStorage.getItem(Des.encrypt(key))) || '""'),
    key: (key: number) => localStorage.key(key),
    removeItem: (key: string) => localStorage.removeItem(Des.encrypt(key)),
    setItem: (key: string, value: string) => {
      return localStorage.setItem(
        Des.encrypt(key),
        Des.encrypt(JSON.stringify(value))
      );
    },
  };

  session = {
    length: sessionStorage.length,
    clear: () => {
      sessionStorage.clear();
    },
    getItem: (key: string) =>
      Des.decrypt(sessionStorage.getItem(Des.encrypt(key))),
    key: (key: number) => sessionStorage.key(key),
    removeItem: (key: string) => sessionStorage.removeItem(Des.encrypt(key)),
    setItem: (key: string, value: string) => {
      return sessionStorage.setItem(Des.encrypt(key), Des.encrypt(value));
    },
  };
}

export { session, storage };
