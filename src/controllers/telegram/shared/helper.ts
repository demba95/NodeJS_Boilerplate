import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import User from '@models/user';
import * as TH from '@telegram-helper';
import temp from '~/tmp/temp';

const TELEGRAM_CLEAR_CHAT_MSG: number = +process.env.TELEGRAM_CLEAR_CHAT_MSG!;

export const getUser: Type.GetUserFn = async (ctx) => {
    const telegramId: number = ctx!.from!.id;
    let message: string = '';

    try {
        const user: Type.UserI = await User.findOne({ telegramId });

        if (user) {
            if (!user.isTelegramVerified) {
                message = `Hello <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                           \n\
                           \n   Your account hasn't been verified yet.\
                           \n   Please send /verify to activate your telegram.`;
                throw { type: 'USER_NOT_VERIFIED', message };
            }
            return user;
        } else {
            message = 'User not found.';
            throw { type: 'USER_NOT_REGISTERED', message };
        }
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while finding your telegram id.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const deleteMsgGetUser: Type.DeleteMsgGetUserFn = async (ctx) => {
    try {
        await deleteMsg(ctx, 0, 0);
        return await getUser(ctx);
    } catch (error) {
        throw error;
    }
};

export const sendMsg: Type.SendMsgFn = async (ctx, msg, disablePreview = true, personal = true) => {
    const chatId: number = personal ? ctx.from!.id : ctx.chat!.id;
    const options: Type.ExtraReplyMessage = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, options);
        return msgId;
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while sending a new message.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const sendMsgDeleteMsg: Type.SendMsgDeleteMsgFn = async (ctx, msg, time) => {
    try {
        const newMsgId = await sendMsg(ctx, msg);
        await deleteMsg(ctx, newMsgId, time);
    } catch (error) {
        throw error;
    }
};

export const sendInLineKeyboard: Type.SendInLineKeyboardFn = async (
    ctx,
    msg,
    keyboard,
    disablePreview = true,
    personal = true
) => {
    const chatId: number = personal ? ctx.from!.id : ctx.chat!.id;
    const options: Type.ExtraReplyMessage = {
        parse_mode: 'HTML',
        ...keyboard,
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, options);
        return msgId;
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while sending a new message.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const sendKeyboard: Type.SendKeyboardFn = async (ctx, msg, keyboard, disablePreview = true, personal = true) => {
    const chatId: number = personal ? ctx.from!.id : ctx.chat!.id;
    const options: Type.ExtraReplyMessage = { parse_mode: 'HTML', ...keyboard, disable_web_page_preview: true };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        const { message_id: msgId }: Type.MessageId = await bot.telegram.sendMessage(chatId, msg, options);
        return msgId;
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while sending a new message.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const editMsg: Type.EditMsgFn = async (ctx, msg, disablePreview = true) => {
    const options: Type.ExtraEditMessageText = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        await ctx.editMessageText(msg, options);
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while editing your message.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const editMsgDeleteMsg: Type.EditMsgDeleteMsgFn = async (ctx, msg, time) => {
    try {
        await editMsg(ctx, msg);
        await deleteMsg(ctx, 0, time);
    } catch (error) {
        throw error;
    }
};

export const editInLineKeyboard: Type.EditInLineKeyboardFn = async (ctx, msg, keyboard, disablePreview = true) => {
    const options: Type.ExtraEditMessageText = {
        parse_mode: 'HTML',
        ...keyboard,
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        await ctx.editMessageText(msg, options);
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while editing your message.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const deleteMsg: Type.DeleteMsgFn = async (ctx, msgId, time = TELEGRAM_CLEAR_CHAT_MSG) => {
    // @ts-ignore
    if (!msgId) msgId = ctx.message ? ctx.message.message_id : ctx.update.callback_query.message.message_id;

    if (+time === 0) {
        await ctx.deleteMessage(+msgId!);
    } else {
        setTimeout(
            async () => {
                try {
                    await ctx.deleteMessage(+msgId!);
                } catch (error) {
                    const msg: string = `Something went wrong while deleting your message.\
                                         \n\
                                         \n   <b>ERROR:</b> ${error.message}`;
                    await TH.sendMsgDeleteMsg(ctx, msg);
                }
            },
            time * 1000,
            bot,
            msgId
        );
    }
};

export const getTemp: Type.GetTempFn = async (ctx, tempKey) => {
    if (!temp[tempKey]) {
        await deleteMsg(ctx, 0, 0);
        throw {
            type: 'SERVER_REBOOTED',
            message: 'Sorry! Server has been rebooted.\nPlease try again.',
        };
    } else {
        return await temp[tempKey];
    }
};
