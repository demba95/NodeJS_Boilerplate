import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Link from '@models/link';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.action(/^DelLink_(.+)/i, async (ctx) => {
    const linkId: string = ctx.match[1]!;
    const menu: Type.InLineMenu[] = [];
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deletelink_${ctx.from!.id}`;
    const link: string = temp[tempKey].links[linkId];

    menu.push([Markup.button.callback('Confirm', `ConfDelLink_${linkId}`), Markup.button.callback('Cancel', 'cancel')]);
    const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

    const msg: string = `Are you sure you want to delete the following link?\
                         \n\
                         \n   → ${link}`;
    await TH.editInLineKeyboard(ctx, msg, keyboard, msgId, false);
});

bot.action(/^ConfDelLink_(.+)/i, async (ctx) => {
    const linkId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deletelink_${ctx.from!.id}`;
    const { userId } = temp[tempKey];

    const deletedLink: Type.LinkI = await Link.findOneAndDelete({ _id: linkId, userId });

    const msg: string = `The following link has been deleted:\
                         \n\
                         \n   → ${deletedLink!.link}`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});
