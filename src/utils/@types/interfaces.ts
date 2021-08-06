import { Document } from 'mongoose';
import { Callback } from './shared';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJwtI;
        device?: DeviceJwtI;
    }
}

interface UserD extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    tempEmail: string;
    verifyToken?: string;
    password?: string;
    status?: string;
    admin?: boolean;
    telegramId: string;
    isTelegramVerified: boolean;
    comparePassword(password: string, callback: Callback): void;
    loginCount?: number;
    waitCount?: Number;
    createdAt?: string;
    updatedAt?: string;
}

export type UserI = UserD | null;

interface ApiD extends Document {
    _id: string;
    name: string;
    url: string;
    key: string;
    value: string;
    userId?: string;
    active: boolean;
    description: string;
    getKey?(callback: Callback): void;
    createdAt?: string;
    updatedAt?: string;
}

export type ApiI = ApiD | null;

interface DeviceD extends Document {
    _id: string;
    name: string;
    token: string;
    expiresIn: number;
    description: string;
    active: boolean;
    notify: boolean;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type DeviceI = DeviceD | null;

export interface UserJwtI {
    _id: string;
    firstName: string;
    lastName: string;
    iat: number;
    exp: number;
}

export interface DeviceJwtI {
    _id: string;
    userId: string;
    iat: number;
    exp?: number;
}
