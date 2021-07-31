import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import User from '@models/user';

const TELEGRAM_TIMEOUT_CHAT: number = +process.env.TELEGRAM_TIMEOUT_CHAT!;
const URL_FRONTEND: string = process.env.URL_FRONTEND!;

export const getUser: Type.GetUserFn = async (ctx) => {
    const telegramId: number = ctx!.from!.id;

    try {
        let msg: string = '';
        const user: Type.UserI = await User.findOne({ telegramId });

        if (!user) {
            msg = `Hello <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                   \n\
                   \n   Please sign up <a href="${URL_FRONTEND}/users/profile">here</a> to enable notifications.\
                   \n   Your telegram id is <a href="tg://user?id=${telegramId}">${telegramId}</a>`;
            throw { type: 'NOT_FOUND', msg };
        }
        if (!user.isTelegramVerified) {
            msg = `Hello <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                   \n\
                   \n   Please send /verify to activate your telegram.\
                   \n   Your telegram id is <a href="tg://user?id=${telegramId}">${telegramId}</a>`;
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
            type: 'TELEGRAM_ERROR',
            msg: `Something went wrong finding your telegram id.\
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
            msg: `Something went wrong sending a new message.\
                  \n\
                  \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const sendMsgDeleteMsg: Type.SendMsgDeleteMsgFn = async (ctx, msg, time) => {
    try {
        const newMsgId = await sendMsg(ctx, msg);
        time && (await deleteMsg(ctx, newMsgId, time));
        !time && (await deleteMsg(ctx, newMsgId));
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
            msg: `Something went wrong sending a new message.\
                  \n\
                  \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const sendKeyboard: Type.SendKeyboardFn = async (ctx, msg, keyboard, disablePreview = true, personal = true) => {
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
            msg: `Something went wrong sending a new message.\
                  \n\
                  \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const editMsg: Type.EditMsgFn = async (ctx, msg, msgId, disablePreview = true) => {
    const chatId: number = ctx.chat!.id;
    if (!msgId) msgId = ctx.message!.message_id;
    const options: Type.ExtraEditMessageText = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        await bot.telegram.editMessageText(chatId, +msgId, undefined, msg, options);
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            msg: `Something went wrong editing your message.\
                  \n\
                  \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const editMsgDeleteMsg: Type.EditMsgDeleteMsgFn = async (ctx, msg, msgId, time) => {
    try {
        await editMsg(ctx, msg, msgId);
        time && (await deleteMsg(ctx, msgId, time));
        !time && (await deleteMsg(ctx, msgId));
    } catch (error) {
        throw error;
    }
};

export const editInLineKeyboard: Type.EditInLineKeyboardFn = async (
    ctx,
    msg,
    keyboard,
    msgId,
    disablePreview = true
) => {
    const chatId: number = ctx.chat!.id;
    if (!msgId) msgId = ctx.message!.message_id;
    const options: Type.ExtraEditMessageText = {
        parse_mode: 'HTML',
        ...keyboard,
        disable_web_page_preview: true,
    };

    if (!disablePreview) delete options.disable_web_page_preview;

    try {
        await bot.telegram.editMessageText(chatId, +msgId, undefined, msg, options);
    } catch (error) {
        throw {
            type: 'TELEGRAM_ERROR',
            msg: `Something went wrong editing your message.\
                  \n\
                  \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const deleteMsg: Type.DeleteMsgFn = async (ctx, newMsgId, time = TELEGRAM_TIMEOUT_CHAT) => {
    const chatId: number = ctx.chat!.id;
    const msgId: number = newMsgId ? newMsgId : ctx.message!.message_id;

    setTimeout(
        async () => {
            try {
                await bot.telegram.deleteMessage(chatId.toString(), +msgId);
            } catch (error) {
                const msg: string = `Something went wrong deleting your message.\
                                     \n\
                                     \n   <b>ERROR:</b> ${error.message}`;
                await bot.telegram.sendMessage(chatId, msg, { parse_mode: 'HTML' });
            }
        },
        time * 1000,
        bot,
        chatId,
        msgId
    );
};
