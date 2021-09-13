import { bot } from '@config/telegram';
import * as TH from '@telegram-helpers';

bot.action('cancel', async (ctx) => {
    const msg: string = '<b>Request aborted!</b>';

    try {
        TH.editMsgDeleteMsg(ctx, msg, 2);
    } catch (error: any) {
        throw error;
    }
});

bot.action('dismiss', async (ctx) => {
    const msgId: number = ctx.update.callback_query.message!.message_id;

    try {
        TH.deleteMsg(ctx, msgId, 0);
    } catch (error: any) {
        throw error;
    }
});
