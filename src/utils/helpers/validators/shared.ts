import * as Type from '@cTypes';

export const isEmpty: Type.CheckFn<string | undefined> = (value) => {
    if (value === undefined || (value.length === 0 && value.trim() === '')) return true;
    return false;
};

export const isEmail: Type.CheckFn<string> = (value) => {
    const emailRegEx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value && value.match(emailRegEx)) return true;
    return false;
};

export const checkProperty: Type.CheckPropertyFn = (propertyName, data, length) => {
    if (!data.hasOwnProperty(propertyName)) return false;
    if (isEmpty(data[propertyName])) return false;
    if (length && data[propertyName].length < length) return false;
    return true;
};
