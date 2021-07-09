import * as Type from '@cTypes/types';
import User from '@models/user';

const TELEGRAM_TIMEOUT_CHAT: number = +process.env.TELEGRAM_TIMEOUT_CHAT!;
const URL_FRONTEND: string = process.env.URL_FRONTEND!;

const isTelegramRegistered: Type.IsTelegramRegisteredFn = async (ctx) => {
    try {
        let msg: string = '';
        const user: Type.UserI | null = await User.findOne({ telegramId: ctx!.from!.id });
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
            msg: 'Something went wrong! Please try again.',
        };
    }
};

const clearTelegramMsg: Type.ClearTelegramMsgFn = async (chatId, msgId, tg, time = TELEGRAM_TIMEOUT_CHAT) => {
    setTimeout(
        () => {
            tg.deleteMessage(chatId, msgId);
        },
        time,
        chatId,
        msgId,
        tg
    );
};

export { isTelegramRegistered, clearTelegramMsg };
