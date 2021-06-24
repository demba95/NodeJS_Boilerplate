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
    verifyToken?: string;
    isEmailVerified?: boolean;
    password?: string;
    admin?: boolean;
    comparePassword(password: string, callback: Callback): void;
    createdAt?: string;
    updatedAt?: string;
}

export type User = {
    _id?: string;
    firstName: string;
    lastName: string;
};

export interface UserJWT extends User {
    iat: number;
    exp: number;
}

export type LoginForm = {
    _id?: string;
    email: string;
    password: string;
};

type ConcatForm = User & LoginForm;

export interface SignUpForm extends ConcatForm {
    confirmPassword?: string;
    verifyToken?: string;
}

export type DeleteForm = {
    password: string;
};

export type EmailForm = {
    email: string;
};

export type PasswordForm = {
    password: string;
    confirmPassword?: string;
};

export interface UpdateUserForm extends User {
    password: string;
    email: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type Msg = {
    from: string;
    to: string;
    subject: string;
    html: string;
};

export type JWTAccessFn = {
    (user: User): string;
};

export type JWTVerifyFn = {
    (mode: string): string;
};

export type CheckFn = {
    (string: string): boolean;
};

export type ValidatorFn<T> = {
    (data: T): {
        errors: ErrorContainer;
        valid: boolean;
    };
};

export type ErrorContainer = {
    [key: string]: string;
};

export type Obj = {
    [index: string]: any;
};
