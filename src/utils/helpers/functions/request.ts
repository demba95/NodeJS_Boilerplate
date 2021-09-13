import * as Type from '@cTypes';
import fetch from 'node-fetch';

export const request: Type.Request = async (type, url, attrs, reqToken, throwError) => {
    const option: Type.RequestOptions = {
        method: type,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (reqToken) option.headers.Authorization = `Bearer ${reqToken}`;
    if (attrs && type !== 'GET') option.body = JSON.stringify(attrs);

    return fetch(url, option).then(async (res: any) => {
        const data = await res.json();

        if (throwError) {
            if (res.ok) return data;
            throw new Error(data.error);
        }

        if (res.ok) return { data, error: null };
        return { data: null, error: data.error };
    });
};
