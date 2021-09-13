import * as Type from '@cTypes';
import User from '@models/user';
import * as TH from '@telegram-helpers';
import temp from '@temp';

export const getUser: Type.GetUserFn = async (ctx) => {
    const telegramId: string = ctx!.from!.id.toString();
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
    } catch (error: any) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw {
            type: 'TELEGRAM_ERROR',
            message: `Something went wrong while finding your telegram id.\
                      \n\
                      \n   <b>ERROR:</b> ${error.message}`,
        };
    }
};

export const getTemp: Type.GetTempFn = async (ctx, tempKey) => {
    if (!temp[tempKey]) {
        await TH.deleteMsg(ctx, 0, 0);
        throw {
            type: 'SERVER_REBOOTED',
            message: 'Sorry! Server has been rebooted.\nPlease try again.',
        };
    } else {
        return await new Promise((resolve, _) => {
            resolve(temp[tempKey]);
        });
    }
};
