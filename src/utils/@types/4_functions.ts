import { Context } from 'telegraf';
import { Obj } from './1_shared';
import { EmailMsg, User } from './2_types';
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
    (user: User): string;
};

export type JwtVerifyFn = {
    (mode: string): string;
};

// _ Telegram
export type ClearTelegramMsgFn = {
    (chatId: string, msgId: string, tg: any, time: number): Promise<void>;
};

export type IsTelegramRegisteredFn = {
    (ctx: Context): Promise<UserI>;
};