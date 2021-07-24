import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import User from '@models/user';
import { Markup } from 'telegraf';
import { isTelegramRegistered } from '../shared/helpers';

const URL_FRONTEND: string = process.env.URL_FRONTEND!;

bot.command('start', async (ctx) => {
    try {
        await isTelegramRegistered(ctx);

        const msg: string = `Bot is already running...\
                             \n   Send /help to view the available commands.`;

        ctx.chat.type === 'group' && (await ctx.tg.deleteMessage(ctx.from.id, ctx.message.message_id));
        await ctx.reply(msg, { parse_mode: 'HTML' });
    } catch (error) {
        throw error;
    }
});

bot.command('verify', async (ctx) => {
    try {
        let msg: string = '';
        const user: Type.UserI = await User.findOne({ telegramId: ctx.from.id.toString() });

        if (!user) {
            msg = `Hey <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                   \n\
                   \n   Sorry! User not found.\
                   \n\
                   \n   Please sign up <a href="${URL_FRONTEND}/users/profile">here</a> to enable notifications.\
                   \n   Your telegram id is <a href="tg://user?id=${ctx!.from!.id}">${ctx!.from!.id}</a>`;
        } else if (user && !user.isTelegramVerified) {
            user.isTelegramVerified = true;
            await user.save();
            msg = `Your telegram has been confirmed successfully.\
                   \n\
                   \n   Type /help to view all available commands.`;
        } else {
            msg = 'Your telegram is already activated!';
        }

        ctx.chat.type === 'group' && (await ctx.tg.deleteMessage(ctx.from.id, ctx.message.message_id));
        await ctx.reply(msg, { parse_mode: 'HTML' });
    } catch (error) {
        throw {
            type: 'INTERNAL_ERROR',
            msg: 'Something went wrong. Please try again.',
        };
    }
});

bot.command('help', async (ctx) => {
    let msg: string = '';
    let keyboard: string[] = [];
    let keyboardConfig: { columns: number; rows: number } = {
        columns: 0,
        rows: 0,
    };

    if (ctx.chat.type === 'group') {
        msg = `AVAILABLE GROUP COMMANDS\
               \n\
               \n   /command1 »\
               \n   /command2 »\
               \n   /command3 »\
               \n   /help`;
        keyboard = new Array('/command1', '/command2', '/command3', '/help');
        keyboardConfig = { columns: 2, rows: 2 };
    } else {
        msg = `AVAILABLE CHAT COMMANDS\
               \n\
               \n   <b><u>Other:</u></b>\
               \n   /me (your profile info)\
               \n   /help (list of commands)`;

        keyboard = new Array('/me', '/help');
        keyboardConfig = { columns: 2, rows: 1 };
    }

    ctx.chat.type === 'group' && (await ctx.tg.deleteMessage(ctx.chat.id, ctx.message.message_id));
    await ctx.reply(msg, { parse_mode: 'HTML', ...Markup.keyboard(keyboard, keyboardConfig).oneTime().resize() });
});

bot.command('me', async (ctx) => {
    const msg = `Here is your profile:\
                 \n\
                 \n   <u>First name:</u>    <b>${ctx.from.first_name}</b>\
                 \n   <u>Last name:</u>    <b>${ctx.from.last_name}</b>\
                 \n   <u>Username:</u>    <a href="tg://username?id=${ctx.from.username}">${ctx.from.username}</a>\
                 \n   <u>Direct msg:</u>   <a href="t.me/${ctx.from.username}">t.me/${ctx.from.username}</a>\
                 \n   <u>Telegram id:</u>  <a href="tg://user?id=${ctx.from.id}">${ctx.from.id}</a>`;

    ctx.chat.type === 'group' && (await ctx.tg.deleteMessage(ctx.from.id, ctx.message.message_id));
    await bot.telegram.sendMessage(ctx.from.id, msg, { parse_mode: 'HTML' });
});
