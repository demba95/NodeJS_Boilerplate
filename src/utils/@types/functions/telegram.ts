import { Obj, UserI } from '@cTypes';
import { Context } from 'telegraf';
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf/typings/markup';

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
        telegramId?: number,
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
    (ctx: Context, tempKey: string): Promise<Obj>;
};
