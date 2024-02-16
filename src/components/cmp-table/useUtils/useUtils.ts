import { isArray, isObject, isString } from '@vue/shared';

export const valueOrDefault = function <T>(value: unknown, defaultValue: T) {
  return value ?? defaultValue;
};

export const isUndefined = (val: any): val is undefined => val === undefined;
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isNumber = (val: any): val is number => typeof val === 'number';

export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isString(val) && val === '') ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length);

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};

export const getProps = (val: { [key: string]: any }): Map<string, any> => {
  var keys = Object.keys(val);

  let result = new Map<string, any>();
  keys.map((k: string) => {
    if (!isEmpty(val[k])) {
      result.set(k, val[k]);
    }
  });
  return result;
};
