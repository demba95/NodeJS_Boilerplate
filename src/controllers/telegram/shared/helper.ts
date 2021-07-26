import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import User from '@models/user';
import { Types as TelegramType } from 'telegraf';

const TELEGRAM_TIMEOUT_CHAT: number = +process.env.TELEGRAM_TIMEOUT_CHAT!;
const URL_FRONTEND: string = process.env.URL_FRONTEND!;

export const getUserFromMsg: Type.GetUserFromMsgFn = async (ctx) => {
    try {
        let msg: string = '';
        const user: Type.UserI = await User.findOne({ telegramId: ctx!.from!.id.toString() });
        if (!user) {
            msg = `Hello <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                   \n\
                   \n   Please sign up <a href="${URL_FRONTEND}/users/profile">here</a> to enable notifications.\
                   \n   Your telegram id is <a href="tg://user?id=${ctx!.from!.id}">${ctx!.from!.id}</a>`;
            throw { type: 'NOT_FOUND', msg };
        }
        if (!user.isTelegramVerified) {
            msg = `Hello <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                   \n\
                   \n   Please send /verify to activate your telegram.\
                   \n   Your telegram id is <a href="tg://user?id=${ctx!.from!.id}">${ctx!.from!.id}</a>`;
            throw { type: 'NOT_VERIFIED', msg };
        }

        return user;
    } catch (error) {
        if (error.type === 'NOT_FOUND' || error.type === 'NOT_VERIFIED') {
            throw {
                type: error.type,
                msg: error.msg,
            };
        }

        throw {
            type: 'INTERNAL_ERROR',
            msg: 'Something went wrong. Please try again.',
        };
    }
};

export const sendMsg: Type.SendTelegramMsgFn = async (chatId, msg, disablePreview = true) => {
    let options: TelegramType.ExtraReplyMessage = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    return await bot.telegram.sendMessage(chatId, msg, options);
};

export const editMsg: Type.EditTelegramMsgFn = async (chatId, msgId, msg, disablePreview = true) => {
    let options: TelegramType.ExtraEditMessageText = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    return await bot.telegram.editMessageText(chatId, +msgId, undefined, msg, options);
};

export const deleteMsg: Type.DeleteTelegramMsgFn = async (chatId, msgId, time = TELEGRAM_TIMEOUT_CHAT) => {
    setTimeout(
        async () => {
            await bot.telegram.deleteMessage(chatId.toString(), +msgId);
        },
        time * 1000,
        bot,
        chatId,
        msgId
    );
};