import { Types as TelegramType } from 'telegraf';
import * as TelegramCoreType from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf/typings/markup';

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
