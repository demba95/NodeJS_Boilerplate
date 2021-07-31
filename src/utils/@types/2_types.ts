import { Types as TelegramType } from 'telegraf';
import * as TelegramCoreType from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf/typings/markup';
import { Obj } from './1_shared';

// _ Email
export type EmailMsg = {
    from: string;
    to: string;
    subject: string;
    html: string;
};

// _ Telegram
export type InLineKeyboard = Markup<TelegramCoreType.InlineKeyboardMarkup>;

export type InLineKeyboardConfig = {
    columns: number;
    rows: number;
};

export type ReplyKeyboard = Markup<TelegramCoreType.ReplyKeyboardMarkup>;

export type ExtraReplyMessage = TelegramType.ExtraReplyMessage;

export type ExtraEditMessageText = TelegramType.ExtraEditMessageText;

export type MessageId = TelegramCoreType.MessageId;

export type Hideable<B> = B & { hide?: boolean };

export type InLineMenu = Hideable<TelegramCoreType.InlineKeyboardButton>[];

// _ User
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

// _ API
export type ApiForm = {
    _id?: string;
    name?: string;
    url?: string;
    key?: string;
    value?: string;
    description?: string;
    active?: boolean;
};

// _ Device
export type DeviceForm = {
    _id?: string;
    name?: string;
    token?: string;
    expiresIn?: number;
    description?: string;
    active?: boolean;
    notify?: boolean;
    userId?: string;
};

// _ IoT Device
export type IoTDeviceData = {
    data: Obj;
    notify?: boolean;
};
