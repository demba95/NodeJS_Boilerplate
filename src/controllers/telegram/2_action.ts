import { bot } from '@config/telegram';
import * as TH from '@telegram-helper';

bot.action('cancel', async (ctx) => {
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const msg: string = '<b>Request aborted!</b>';

    try {
        TH.editMsgDeleteMsg(ctx, msg, msgId, 2);
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
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const msg: string = 'Sorry something went wrong while executing your request.\nPlease try again.';

    console.log(ctx);

    try {
        TH.editMsgDeleteMsg(ctx, msg, msgId);
    } catch (error) {
        throw error;
    }
});
