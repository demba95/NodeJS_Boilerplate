import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import User from '@models/user';
import * as telegramHelper from '@telegram-helper';
import { Markup } from 'telegraf';

const URL_FRONTEND: string = process.env.URL_FRONTEND!;

bot.command('start', async (ctx) => {
    const chatId: string = ctx.chat.id.toString();
    const msgId: string = ctx.message.message_id.toString();
    const telegramId: string = ctx.from.id.toString();

    try {
        await telegramHelper.getUserFromMsg(ctx);
        await telegramHelper.deleteMsg(chatId, msgId, 0);
        const msg: string = `Bot is already running...\
                             \n   Send /help to view the available commands.`;
        await telegramHelper.sendMsg(telegramId, msg);
    } catch (error) {
        throw error;
    }
});

bot.command('verify', async (ctx) => {
    let msg: string = '';
    const chatId: string = ctx.chat.id.toString();
    const telegramId: string = ctx.from.id.toString();
    const msgId: string = ctx.message.message_id.toString();

    try {
        const user: Type.UserI = await User.findOne({ telegramId: telegramId });

        if (!user) {
            msg = `Hey <b>${ctx!.from!.first_name} ${ctx!.from!.last_name}</b>!\
                   \n\
                   \n   Sorry! User not found.\
                   \n\
                   \n   Please sign up <a href="${URL_FRONTEND}/users/profile">here</a> to enable notifications.\
                   \n   Your telegram id is <a href="tg://user?id=${telegramId}">${telegramId}</a>`;
        } else if (user && !user.isTelegramVerified) {
            user.isTelegramVerified = true;
            await user.save();
            msg = `Your telegram has been confirmed successfully.\
                   \n\
                   \n   Type /help to view all available commands.`;
        } else {
            msg = 'Your telegram is already verified!';
        }

        await telegramHelper.deleteMsg(chatId, msgId, 0);
        const { message_id: newMsgId }: any = await telegramHelper.sendMsg(telegramId, msg);
        await telegramHelper.deleteMsg(telegramId, newMsgId);
    } catch (error) {
        throw {
            type: 'INTERNAL_ERROR',
            msg: 'Something went wrong. Please try again.',
        };
    }
});

bot.command('help', async (ctx) => {
    const chatId: string = ctx.chat.id.toString();
    const msgId: string = ctx.message.message_id.toString();
    const chatType: string = ctx.chat.type;
    let msg: string = '';
    let keyboard: string[] = [];
    let keyboardConfig: { columns: number; rows: number } = {
        columns: 0,
        rows: 0,
    };

    if (chatType === 'group') {
        msg = `AVAILABLE GROUP COMMANDS\
               \n\
               \n   <b><u>Other:</u></b>\
               \n      /command1 »\
               \n      /command2 »\
               \n      /command3 »\
               \n      /help`;
        keyboard = new Array('/command1', '/command2', '/command3', '/help');
        keyboardConfig = { columns: 2, rows: 2 };
    } else {
        msg = `AVAILABLE CHAT COMMANDS\
               \n\
               \n   <b><u>Other:</u></b>\
               \n      /me (your profile info)\
               \n      /help (list of commands)`;

        keyboard = new Array('/me', '/help');
        keyboardConfig = { columns: 2, rows: 1 };
    }

    try {
        await telegramHelper.deleteMsg(chatId, msgId, 0);
        await ctx.reply(msg, {
            parse_mode: 'HTML',
            ...Markup.keyboard(keyboard, keyboardConfig).oneTime().resize(),
        });
    } catch (error) {
        throw {
            type: 'INTERNAL_ERROR',
            msg: 'Something went wrong. Please try again.',
        };
    }
});

bot.command('me', async (ctx) => {
    const chatId: string = ctx.chat.id.toString();
    const msgId: string = ctx.message.message_id.toString();
    const telegramId: string = ctx.from.id.toString();
    const msg = `Here is your profile:\
                 \n\
                 \n   <u>First name:</u>    <b>${ctx.from.first_name}</b>\
                 \n   <u>Last name:</u>    <b>${ctx.from.last_name}</b>\
                 \n   <u>Username:</u>    <a href="tg://username?id=${ctx.from.username}">${ctx.from.username}</a>\
                 \n   <u>Direct msg:</u>   <a href="t.me/${ctx.from.username}">t.me/${ctx.from.username}</a>\
                 \n   <u>Telegram id:</u>  <a href="tg://user?id=${telegramId}">${telegramId}</a>`;

    try {
        await telegramHelper.deleteMsg(chatId, msgId, 0);
        const { message_id: newMsgId }: any = await bot.telegram.sendMessage(telegramId, msg, { parse_mode: 'HTML' });
        await telegramHelper.deleteMsg(telegramId, newMsgId, 30);
    } catch (error) {
        throw {
            type: 'INTERNAL_ERROR',
            msg: 'Something went wrong. Please try again.',
        };
    }
});
