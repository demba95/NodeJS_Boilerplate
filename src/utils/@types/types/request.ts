declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJwtI;
        device?: DeviceJwtI;
    }
}

export type Request = (type: string, url: string, data?: any, reqToken?: string, throwError?: boolean) => Promise<any>;

export type RequestOptions = {
    method: string;
    mode?: RequestMode;
    headers: {
        'Content-Type': string;
        'Access-Control-Allow-Origin'?: string;
        Authorization?: string;
    };
    body?: string;
};

export interface UserJwtI {
    _id: string;
    firstName: string;
    lastName: string;
    admin: boolean;
    iat: number;
    exp: number;
}

export interface DeviceJwtI {
    _id: string;
    userId: string;
    iat: number;
    exp?: number;
}
