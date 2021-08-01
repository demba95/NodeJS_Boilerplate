import * as CF from '@cFunctions';
import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import TodoCategory from '@models/todo-category';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.hears(/\/newtodocategory (.+)/i, async (ctx) => {
    const name: string = ctx.match[1]!.replace(/\w\S*/g, (txt: string) => CF.titleCase(txt));
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const catExists: Type.TodoCategoryI = await TodoCategory.findOne({ name, userId: user!._id });

        if (catExists) {
            msg = `Todo category <b>${name}</b> already exists!`;
        } else {
            const newCategory = new TodoCategory({ name, userId: user!._id });
            await newCategory.save();

            msg = `New todo category "<b>${name}</b>" has been created!`;
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while creating a new category.' };
    }
});

bot.command('todocategory', async (ctx) => {
    let categoriesStr: string = '';
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.TodoCategoryI[] = await TodoCategory.find({ userId: user!._id }).sort({ name: 1 });

        if (categories.length === 0) {
            msg = "You don't have any todo category. Add one /newtodocategory <category name>";
        } else {
            categories.forEach((category) => {
                categoriesStr += `\n   → ${category!.name}`;
            });

            msg = `Your have ${categories.length} todo categories:\
                   \n\
                   ${categoriesStr}`;
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while getting your categories.' };
    }
});

bot.hears(/\/renametodocategory (.+)=(.+)/i, async (ctx) => {
    const menu: Type.InLineMenu[] = [];
    const oldName: string = ctx.match[1]!.trim().replace(/\w\S*/g, (txt: string) => CF.titleCase(txt));
    const newName: string = ctx.match[2]!.trim().replace(/\w\S*/g, (txt: string) => CF.titleCase(txt));
    const tempKey: string = `renametodocategory_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const oldCatExists: Type.TodoCategoryI = await TodoCategory.findOne({ name: oldName, userId: user!._id });
        const newCatExists: Type.TodoCategoryI = await TodoCategory.findOne({ name: newName, userId: user!._id });

        if (!oldCatExists) {
            msg = `Todo category named "<b>${oldName}</b>" not found.`;
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }
        if (newCatExists) {
            msg = `Todo category named "<b>${newName}</b>" already exists.`;
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        temp[tempKey] = {
            userId: user!._id,
            newName,
        };

        menu.push([Markup.button.callback('Confirm', `ConfRenameTodoCat_${oldCatExists._id}`)]);
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        msg = `Are you sure you want to rename your category?\
               \n\
               \n   From:   ${oldName}\
               \n   To:        ${newName}
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while updating your category.' };
    }
});

bot.command('deletetodocategory', async (ctx) => {
    const categoriesObj: Type.Obj = {};
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `deletetodocategory_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.TodoCategoryI[] = await TodoCategory.find({ userId: user!._id });

        if (categories.length === 0) {
            msg = "You don't have any categories.";
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        for (let i = 0; i < categories.length; i++) {
            categoriesObj[categories[i]!._id] = categories[i]!.name;

            if (i + 1 < categories.length) {
                categoriesObj[categories[i + 1]!._id] = categories[i + 1]!.name;
                menu.push([
                    Markup.button.callback(categories[i]!.name, `DelTodoCat_${categories[i]!._id}`),
                    Markup.button.callback(categories[i + 1]!.name, `DelTodoCat_${categories[i + 1]!._id}`),
                ]);
                i++;
            } else {
                menu.push([Markup.button.callback(categories[i]!.name, `DelTodoCat_${categories[i]!._id}`)]);
            }
        }
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            categories: categoriesObj,
        };

        msg = `Which category should I delete?\
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while deleting your category.' };
    }
});
