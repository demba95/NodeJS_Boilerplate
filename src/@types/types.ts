import { Document } from 'mongoose';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: UserJWT | LoginForm | SignUpForm;
    }
}

type Callback = (error: string, isMatch: boolean) => void;

export interface UserI extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    tempEmail: string;
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
    exp: number;
}

export interface LoginForm {
    _id?: string;
    email: string;
    password: string;
}

type ConcatForm = User & LoginForm;

export interface SignUpForm extends ConcatForm {
    confirmPassword: string;
    verifyToken?: string;
}

export interface UpdateUserForm extends User {
    newEmail: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface MSGFn {
    (user: UserI, host: string): {
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
