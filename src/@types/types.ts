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
    confirmPassword: string;
    verifyToken?: string;
}

export type DeleteForm = {
    password: string;
};

export type ValidatePassword = {
    password: string;
};

export type ResendEmailForm = {
    email: string;
};

export interface UpdateUserForm extends User {
    password: string;
    newEmail: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type MSGFn = {
    (user: UserI, host: string): {
        from: string;
        to: string;
        subject: string;
        html: string;
    };
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
