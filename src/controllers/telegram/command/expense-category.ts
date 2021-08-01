import * as CF from '@cFunctions';
import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import ExpenseCategory from '@models/expense-category';
import User from '@models/user';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.hears(/\/newexpcategory (.+)/i, async (ctx) => {
    const name: string = ctx.match[1]!.replace(/\w\S*/g, (txt: string) => CF.titleCase(txt));
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const catExists: Type.ExpenseCategoryI = await ExpenseCategory.findOne({ name, userId: user!._id });

        if (catExists) {
            msg = `Expense category <b>${name}</b> already exists!`;
        } else {
            const newCategory = new ExpenseCategory({ name, userId: user!._id });
            await newCategory.save();

            msg = `New expense category "<b>${name}</b>" has been created!`;
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while creating a new category.' };
    }
});

bot.command('expcategory', async (ctx) => {
    let categoriesStr: string = '';
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({
            $or: [{ userId: user!._id }, { userGroup: user!._id }],
        })
            .populate('userId')
            .sort({
                name: 1,
            });

        if (categories.length === 0) {
            msg = "You don't have any expense category.";
        } else {
            categories.forEach((cat) => {
                const userCat: string =
                    user!._id.toString() !== cat!.userId!['_id'].toString() ? ` (${cat!.userId!['firstName']})` : '';
                categoriesStr += `\n   → ${cat!.name}${userCat}`;
            });

            msg = `Your have ${categories.length} expense categories:\
                   \n\
                   ${categoriesStr}`;
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong getting your categories.' };
    }
});

bot.hears(/\/renameexpcategory (.+) ?= ?(.+)/i, async (ctx) => {
    const menu: Type.InLineMenu[] = [];
    const newName: string = ctx.match[2]!.trim().replace(/\w\S*/g, (txt: string) => CF.titleCase(txt));
    const oldName: string = ctx.match[1]!.trim().replace(/\w\S*/g, (txt: string) => CF.titleCase(txt));
    const tempKey: string = `renameexpcategory_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const oldCatExists: Type.ExpenseCategoryI = await ExpenseCategory.findOne({ name: oldName, userId: user!._id });
        const newCatExists: Type.ExpenseCategoryI = await ExpenseCategory.findOne({ name: newName, user: user!._id });

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

        menu.push([Markup.button.callback('Confirm', `ConfRenameExpCat_${oldCatExists._id}`)]);
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
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong updating your category.' };
    }
});

bot.hears(/\/addusertoexpcategory (.+)/i, async (ctx) => {
    const categoriesObj: Type.Obj = {};
    const menu: Type.InLineMenu[] = [];
    const newTelegramId: string = ctx.match[1]!;
    const tempKey: string = `addusertoexpcategory_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const userExists: Type.UserI = await User.findOne({ telegramId: newTelegramId });

        if (!userExists) {
            msg = 'User not found. Make sure you entered a valid telegram id.';
            return await TH.sendMsgDeleteMsg(ctx, msg);
        } else {
            const newUsername: string = `${userExists.firstName} ${userExists.lastName}`;
            const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({ userId: user!._id });

            if (categories.length === 0) {
                msg = "You don't have any expense category. Add one /newexpcategory <category name>";
                return await TH.sendMsgDeleteMsg(ctx, msg);
            }

            for (let i = 0; i < categories.length; i++) {
                categoriesObj[categories[i]!._id] = categories[i]!.name;

                if (i + 1 < categories.length) {
                    categoriesObj[categories[i + 1]!._id] = categories[i + 1]!.name;
                    menu.push([
                        Markup.button.callback(categories[i]!.name, `AddUserExpCat_${categories[i]!._id}`),
                        Markup.button.callback(categories[i + 1]!.name, `AddUserExpCat_${categories[i + 1]!._id}`),
                    ]);
                    i++;
                } else {
                    menu.push([Markup.button.callback(categories[i]!.name, `AddUserExpCat_${categories[i]!._id}`)]);
                }
            }
            menu.push([Markup.button.callback('Cancel', 'cancel')]);

            temp[tempKey] = {
                userId: user!._id,
                newUserId: userExists._id,
                newUsername,
                categories: categoriesObj,
            };

            const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);
            msg = `Where should I add ${newUsername}?
                   \n——————————————————————————`;
            await TH.sendInLineKeyboard(ctx, msg, keyboard);
        }
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong adding a user to your category.' };
    }
});

bot.command('deleteexpcategory', async (ctx) => {
    const categoriesObj: Type.Obj = {};
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `deleteexpcategory_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({ userId: user!._id });

        if (categories.length === 0) {
            msg = "You don' have any categories.";
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        for (let i = 0; i < categories.length; i++) {
            categoriesObj[categories[i]!._id] = categories[i]!.name;

            if (i + 1 < categories.length) {
                categoriesObj[categories[i + 1]!._id] = categories[i + 1]!.name;
                menu.push([
                    Markup.button.callback(categories[i]!.name, `DelExpCat_${categories[i]!._id}`),
                    Markup.button.callback(categories[i + 1]!.name, `DelExpCat_${categories[i + 1]!._id}`),
                ]);
                i++;
            } else {
                menu.push([Markup.button.callback(categories[i]!.name, `DelExpCat_${categories[i]!._id}`)]);
            }
        }
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            categories: categoriesObj,
        };

        msg = `Which category should I delete?
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong deleting your category.' };
    }
});
