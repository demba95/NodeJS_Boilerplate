import { NextFunction } from 'express';
import { Document } from 'mongoose';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJWT | LoginForm | SignUpForm;
    }
}

type Callback = (error: string, isMatch: boolean) => void;

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    verifyToken: string;
    isEmailVerified: boolean;
    password: string;
    admin: boolean;
    comparePassword(password: string, callback: Callback): void;
}

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
}

export interface UserJWT extends User {
    iat: number;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface SignUpForm extends User, LoginForm {
    confirmPassword: string;
    verifyToken?: string;
}

export interface UpdateUserForm extends User {
    newEmail: string;
    newPassword: string;
}

export interface SignUpMSGFn {
    (user: IUser, host: string): {
        from: string;
        to: string;
        subject: string;
        html: string;
    };
}

export interface JWTFnAccessFn {
    (user: User): string;
}

export interface JWTFnVerifyFn {
    (mode: string, expiration: string): string;
}

export interface CheckFn {
    (string: string): boolean;
}

export type FormData = LoginForm & SignUpForm & UpdateUserForm;

export interface ValidatorFn {
    (data: FormData): {
        errors: ErrorContainer;
        valid: boolean;
    };
}

export interface ErrorContainer {
    [key: string]: string;
}
