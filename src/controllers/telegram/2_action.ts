import { bot } from '@config/telegram';
import * as TH from '@telegram-helper';

bot.action('cancel', async (ctx) => {
    const msg: string = '<b>Request aborted!</b>';

    try {
        TH.editMsgDeleteMsg(ctx, msg, 2);
    } catch (error) {
        throw error;
    }
});

bot.action('dismiss', async (ctx) => {
    const msgId: number = ctx.update.callback_query.message!.message_id;

    try {
        TH.deleteMsg(ctx, msgId, 0);
    } catch (error) {
        throw error;
    }
});

bot.action(/(.+)/i, async (ctx) => {
    console.log(ctx);

    try {
        const msg: string = 'Sorry something went wrong while executing your request.\nPlease try again.';
        TH.editMsgDeleteMsg(ctx, msg);
    } catch (error) {
        throw error;
    }
});
