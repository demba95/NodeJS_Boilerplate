import { Callback } from '@cTypes';
import { Document } from 'mongoose';

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
    __v?: number;
}

export type UserI = UserD | null;

export type UserLoginForm = {
    _id?: string;
    email: string;
    password: string;
};

export type UserDeleteForm = {
    password: string;
};

export type UserEmailForm = {
    email: string;
};

export type UserPasswordForm = {
    password: string;
    confirmPassword?: string;
};

export type UserSignUpForm = {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    verifyToken?: string;
};

export type UserProfileForm = {
    _id?: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    newPassword: string;
    confirmNewPassword: string;
    telegramId: string;
};

export type UserResponseSuccessMsg = {
    message: string;
    verifyToken?: string;
};
