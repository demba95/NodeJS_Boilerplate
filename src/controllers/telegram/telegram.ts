import { bot } from '@config/telegram';
import * as TH from '@tHelpers';
import { Context } from 'telegraf';
import './actions/base';
import './commands/base';

bot.hears(/\/(.+)/i, async (ctx) => {
    const msg: string = `Sorry, command /${ctx.match[1]!} doesn't exist or it's incorrect.\
                         \nSend /help to view the available commands.`;

    try {
        await TH.deleteMsgGetUser(ctx);
        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error: any) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while executing your command.' };
    }
});

bot.action(/(.+)/i, async (ctx) => {
    console.log(ctx);

    try {
        const msg: string = 'Sorry something went wrong while executing your request.\nPlease try again.';
        TH.editMsgDeleteMsg(ctx, msg);
    } catch (error: any) {
        throw error;
    }
});

bot.catch(async (error: any, ctx: Context) => {
    if (error.type !== 'USER_NOT_REGISTERED') await TH.sendMsgDeleteMsg(ctx, error.message);
});
