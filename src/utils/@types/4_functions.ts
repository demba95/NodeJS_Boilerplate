import { Response } from 'express';
import mongoose from 'mongoose';
import { Context } from 'telegraf';
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf/typings/markup';
import { Obj } from './1_shared';
import { EmailMsg } from './2_types';
import { UserI } from './3_interfaces';

// _ Shared
export type TitleCaseFn = {
    (txt: string): string;
};

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

export type ObjectIdFn = {
    (id: string): mongoose.Types.ObjectId;
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
export type GetUserFn = {
    (ctx: Context): Promise<UserI>;
};

export type DeleteMsgGetUserFn = {
    (ctx: Context): Promise<UserI>;
};

export type SendMsgFn = {
    (ctx: Context, msg: string, disablePreview?: boolean, personal?: boolean): Promise<number>;
};

export type SendMsgDeleteMsgFn = {
    (ctx: Context, msg: string, time?: number): Promise<void>;
};

export type SendInLineKeyboardFn = {
    (
        ctx: Context,
        msg: string,
        keyboard: Markup<InlineKeyboardMarkup>,
        disablePreview?: boolean,
        personal?: boolean
    ): Promise<number>;
};

export type SendKeyboardFn = {
    (
        ctx: Context,
        msg: string,
        keyboard: Markup<ReplyKeyboardMarkup>,
        disablePreview?: boolean,
        personal?: boolean
    ): Promise<number>;
};

export type EditMsgFn = {
    (ctx: Context, msg: string, disablePreview?: boolean): Promise<void>;
};

export type EditMsgDeleteMsgFn = {
    (ctx: Context, msg: string, time?: number): void;
};

export type EditInLineKeyboardFn = {
    (ctx: Context, msg: string, keyboard: Markup<InlineKeyboardMarkup>, disablePreview?: boolean): Promise<void>;
};

export type DeleteMsgFn = {
    (ctx: Context, msgId?: number, time?: number): Promise<void>;
};

export type GetTempFn = {
    (ctx: Context, tempKey: string): Obj;
};
