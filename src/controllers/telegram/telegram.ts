import { bot } from '@config/telegram';
import * as TH from '@telegram-helper';
import { Context } from 'telegraf';
export * from './command/base';

bot.action('cancel', async (ctx) => {
    try {
        const msgId: number = ctx.update.callback_query.message!.message_id;
        const msg: string = '<b>Request aborted!</b>';
        TH.editMsgDeleteMsg(ctx, msg, msgId, 2);
    } catch (error) {
        throw error;
    }
});

bot.action('dismiss', async (ctx) => {
    try {
        const msgId: number = ctx.update.callback_query.message!.message_id;
        TH.deleteMsg(ctx, msgId, 0);
    } catch (error) {
        throw error;
    }
});

bot.action(/(.+)/i, async (ctx) => {
    try {
        const msgId: number = ctx.update.callback_query.message!.message_id;
        const msg: string =
            'Sorry something went wrong while executing your request.\
             \nPlease restart your request from the beginning.';
        TH.editMsgDeleteMsg(ctx, msg, msgId);
    } catch (error) {
        throw error;
    }
});

bot.hears(/\/(.+)/i, async (ctx) => {
    try {
        await TH.deleteMsgGetUser(ctx);
        const msg: string = `Sorry, command /${ctx.match[1]!} doesn't exist or it's incorrect.\
                            \nSend /help to view the available commands.`;

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        throw {
            type: 'INTERNAL_ERROR',
            msg: 'Something went wrong with your command.',
        };
    }
});

bot.catch(async (error: any, ctx: Context) => {
    await ctx.reply(error.msg, { parse_mode: 'HTML' });
});
