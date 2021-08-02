import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import User from '@models/user';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';

bot.command('start', async (ctx) => {
    try {
        await TH.deleteMsgGetUser(ctx);
        const msg: string = `Bot is already running...\
                             \nSend /help to view the available commands.`;
        await TH.sendMsg(ctx, msg);
    } catch (error) {
        throw error;
    }
});

bot.command('verify', async (ctx) => {
    const telegramId: number = ctx.from.id;
    let msg: string = '';

    try {
        await TH.deleteMsg(ctx, 0, 0);
        const user: Type.UserI = await User.findOne({ telegramId });

        if (!user) {
            throw { type: 'USER_NOT_REGISTERED', message: 'User not found.' };
        } else if (user && !user.isTelegramVerified) {
            user.isTelegramVerified = true;
            await user.save();
            msg = `Your telegram has been confirmed successfully.\
                   \n\
                   \n   Type /help to view all available commands.`;
        } else {
            msg = 'Your telegram is already verified!';
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        throw error;
    }
});

bot.command('help', async (ctx) => {
    const chatType: string = ctx.chat.type;
    const keyboardConfig: Type.InLineKeyboardConfig = { columns: 0, rows: 0 };
    let keyboardButtons: string[] = [];
    let msg: string = '';

    if (chatType === 'private') {
        msg = `CHAT COMMANDS\
               \n\
               \n<b><u>Private:</u></b>\
               \n\
               \n/command1 »\
               \n/command2 »\
               \n\
               \n<b><u>Other:</u></b>\
               \n\
               \n/me (your profile info)\
               \n/help (list of commands)`;

        keyboardButtons = new Array('/command1', '/command2', '/me', '/help');
        keyboardConfig.columns = 2;
        keyboardConfig.rows = 2;
    } else {
        msg = `GROUP COMMANDS\
               \n\
               \n<b><u>Group:</u></b>\
               \n\
               \n/command1 »\
               \n/command2 »\
               \n\
               \n<b><u>Other:</u></b>\
               \n\
               \n/me (your profile info)\
               \n/help (list of commands)`;
        keyboardButtons = new Array('/command1', '/command2', '/me', '/help');
        keyboardConfig.columns = 2;
        keyboardConfig.rows = 2;
    }

    const keyboard: Type.ReplyKeyboard = Markup.keyboard(keyboardButtons, keyboardConfig).oneTime().resize();

    try {
        await TH.deleteMsgGetUser(ctx);
        await TH.sendKeyboard(ctx, msg, keyboard, true, false);
    } catch (error) {
        throw error;
    }
});

bot.command('me', async (ctx) => {
    const telegramId: number = ctx.from.id;
    const menu: Type.InLineMenu[] = [];

    try {
        await TH.deleteMsg(ctx, 0, 0);
        menu.push([Markup.button.callback('Dismiss', 'dismiss')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        const msg: string = `———————————————————————\
                             \n                              YOUR PROFILE\
                             \n\
                             \n   <u>First Name:</u>    <b>${ctx.from.first_name}</b>\
                             \n   <u>Last Name:</u>    <b>${ctx.from.last_name}</b>\
                             \n   <u>Username:</u>    <a href="tg://username?id=${ctx.from.username}">${ctx.from.username}</a>\
                             \n   <u>Direct Msg:</u>   <a href="t.me/${ctx.from.username}">t.me/${ctx.from.username}</a>\
                             \n   <u>Telegram Id:</u>  <a href="tg://user?id=${telegramId}">${telegramId}</a>
                             \n———————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        throw error;
    }
});

bot.command('info', async (ctx) => {
    // @ts-ignore
    const title: string = ctx.message.chat.title || 'N/A';
    const chatId: number = ctx.chat.id;
    const chatType: string = ctx.chat.type;
    const menu: Type.InLineMenu[] = [];

    try {
        const user = await TH.deleteMsgGetUser(ctx);

        if (user!.admin) {
            menu.push([Markup.button.callback('Dismiss', 'dismiss')]);
            const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

            const msg: string = `———————————————————————\
                                 \n                                CHAT INFO\
                                 \n\
                                 \n   <u>Chat Title:</u>    <b>${title.toUpperCase()}</b>\
                                 \n   <u>Chat Id:</u>        <b>${chatId}</b>\
                                 \n   <u>Chat Type:</u>   <b>${chatType.toUpperCase()}</b>
                                 \n———————————————————————`;
            await TH.sendInLineKeyboard(ctx, msg, keyboard);
        }
    } catch (error) {
        throw error;
    }
});

bot.hears(/\/(.+)/i, async (ctx) => {
    const msg: string = `Sorry, command /${ctx.match[1]!} doesn't exist or it's incorrect.\
                         \nSend /help to view the available commands.`;

    try {
        await TH.deleteMsgGetUser(ctx);
        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while executing your command.' };
    }
});
