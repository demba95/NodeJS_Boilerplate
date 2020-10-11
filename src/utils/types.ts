import { Document } from 'mongoose';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJWT | LoginForm | SignUpForm;
    }
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    verifyToken: string;
    isEmailVerified: boolean;
    password: string;
    admin: boolean;
}

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
}

export interface UserJWT extends User {
    iat: number;
}

export interface JWTFnAccess {
    (user: User): string;
}

export interface JWTFnVerify {
    (mode: string, expiration: string): string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface SignUpForm extends User, LoginForm {
    confirmPassword: string;
    verifyToken?: string;
}

export interface SignUpMSG {
    (user: IUser, host: string): {
        from: string;
        to: string;
        subject: string;
        html: string;
    };
}
