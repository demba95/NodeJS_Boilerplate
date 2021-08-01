import { bot } from '@config/telegram';
import * as TH from '@telegram-helper';
import { Context } from 'telegraf';
import './1_command';
import './2_action';

bot.catch(async (error: any, ctx: Context) => {
    if (error.type !== 'USER_NOT_REGISTERED') await TH.sendMsgDeleteMsg(ctx, error.message);
});
