import mongoose, { Document } from 'mongoose';
import { Callback } from './1_shared';
import { LoginForm, SignUpForm, User } from './2_types';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJwtI | LoginForm | SignUpForm;
    }
}

interface UserI extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    tempEmail: string;
    verifyToken?: string;
    password?: string;
    status?: string;
    admin?: boolean;
    comparePassword(password: string, callback: Callback): void;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiI extends Document {
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

interface UserJwtI extends User {
    iat: number;
    exp: number;
}

export { UserI, ApiI, UserJwtI };
