import { bot } from '@config/telegram';
import * as telegramHelper from '@telegram-helper';
export * from './command/base';

bot.action('cancel', async (ctx) => {
    try {
        const chatId: number = ctx.from!.id;
        const msgId: number = ctx.update.callback_query.message!.message_id;

        await telegramHelper.editMsg(chatId, msgId, '<b>Request aborted!</b>');
        await telegramHelper.deleteMsg(chatId, msgId, 2);
    } catch (error) {
        throw error;
    }
});
