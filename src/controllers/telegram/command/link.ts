import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Link from '@models/link';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.hears(/\/link[s]?$/i, async (ctx) => {
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const links: Type.LinkI[] = await Link.find({ userId: user!._id });

        if (links.length === 0) {
            msg = "You don't have any link.";
        } else {
            let linksStr = '';
            links.forEach((link) => {
                linksStr += `\n   → <a href="${link!.link}">${link!.link}</a>`;
            });

            msg = `Your have ${links.length} link(s):\
                   \n\
                   ${linksStr}`;
        }

        return await TH.sendMsgDeleteMsg(ctx, msg, 60);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while fetching your links.' };
    }
});

bot.command('deletelink', async (ctx) => {
    const linksObj: Type.Obj = {};
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `deletelink_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const links: Type.LinkI[] = await Link.find({ userId: user!._id });

        if (links.length === 0) {
            msg = "You don't have any link.";
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        links.forEach((link) => {
            linksObj[link!._id] = link!.link;
            menu.push([Markup.button.callback(link!.link, `DelLink_${link!._id}`)]);
        });
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            links: linksObj,
        };

        msg = 'Which link should I delete?';
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong deleting your link.' };
    }
});

bot.hears(/^( *(http|https|ftp|ftps)\:\/\/|www)\S+ *$/i, async (ctx) => {
    const link: string = ctx.match[0]!.trim();

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const linkExists: Type.LinkI = await Link.findOne({ link, userId: user!._id });

        if (linkExists) {
            const msg: string = 'This link already exists!';
            return await TH.sendMsgDeleteMsg(ctx, msg, 5);
        } else {
            const newLink: Type.LinkI = new Link({ link, userId: user!._id });
            await newLink.save();
        }
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong saving your link.' };
    }
});
