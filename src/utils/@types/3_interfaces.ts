import mongoose, { Document } from 'mongoose';
import { Callback } from './1_shared';
import { DeviceForm, User, UserLoginForm, UserSignUpForm } from './2_types';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJwtI | UserLoginForm | UserSignUpForm;
        device?: DeviceI | DeviceForm;
    }
}

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJwtI | UserLoginForm | UserSignUpForm;
    }
}

export interface UserI extends Document {
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

export interface ApiI extends Document {
    _id: string;
    name: string;
    url: string;
    key: string;
    value: string;
    userId?: mongoose.Types.ObjectId;
    active: boolean;
    description: string;
    getKey?(callback: Callback): void;
    createdAt?: string;
    updatedAt?: string;
}

export interface DeviceI extends Document {
    _id: string;
    name: string;
    token: string;
    expiresIn: number;
    description: string;
    active: boolean;
    notify: boolean;
    userId?: mongoose.Types.ObjectId;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserJwtI extends User {
    iat: number;
    exp: number;
}

export interface DeviceJwtI extends DeviceForm {
    iat: number;
    exp?: number;
}
