import mongoose, { Document } from 'mongoose';

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

export interface ApiI extends Document {
    _id: string;
    name: string;
    url: string;
    key?: string;
    value?: string;
    userId?: mongoose.Types.ObjectId;
    active: boolean;
    description: string;
    getKey(callback: Callback): void;
    createdAt?: string;
    updatedAt?: string;
}

export type ApisArray = {
    _id: string;
    name: string;
    active: boolean;
    url: string;
    key: string;
    value: string;
};

export type ApiForm = {
    name?: string;
    url?: string;
    key?: string;
    value?: string;
    description?: string;
    active?: boolean;
};

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

export type CheckFn<T> = {
    (value: T): boolean;
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

export type CheckPropertyFn = {
    (propertyName: string, data: Obj, length?: number | undefined): boolean;
};

export type UpdateDocumentFn<D, B> = {
    (document: D, body: B, permit: string[]): void;
};
