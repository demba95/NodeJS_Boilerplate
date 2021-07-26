import { Response } from 'express';
import { Context } from 'telegraf';
import { Obj } from './1_shared';
import { EmailMsg } from './2_types';
import { UserI } from './3_interfaces';

// _ Email
export type EmailFn<U, H> = {
    (user: U, host?: H): EmailMsg;
};

// _ Validator
export type CheckFn<T> = {
    (value: T): boolean;
};

export type CheckPropertyFn = {
    (propertyName: string, data: Obj, length?: number | undefined): boolean;
};

export type ValidatorFn<T> = {
    (data: T): {
        errors: Obj;
        valid: boolean;
    };
};

// _ MongoDB
export type UpdateDocumentFn = {
    (document: Obj, body: Obj, permit: string[]): void;
};

// _ JWT
export type JwtAccessFn = {
    (user: UserI): string;
};

export type JwtVerifyFn = {
    (mode: string, attrs: Obj, secretKey: string, expiresIn: number): string;
};

// _ User
export type AddTryFn = {
    (user: UserI, res: Response): void;
};

export type CheckTimeElapsedFn = {
    (user: UserI, res: Response): Promise<boolean>;
};

// _ Telegram
export type DeleteTelegramMsgFn = {
    (chatId: string | number, msgId: string | number, time?: number): Promise<void>;
};

export type SendTelegramMsgFn = {
    (chatId: string | number, msg: string, previewHtml?: boolean): Promise<any>;
};

export type EditTelegramMsgFn = {
    (chatId: string | number, msgId: string | number, msg: string, disablePreview?: boolean): Promise<any>;
};

export type GetUserFromMsgFn = {
    (ctx: Context): Promise<UserI>;
};
