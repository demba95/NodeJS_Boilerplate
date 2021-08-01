import * as CF from '@cFunctions';
import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Expense from '@models/expense';
import ExpenseCategory from '@models/expense-category';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.action(/^DelExpCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const menu: Type.InLineMenu[] = [];
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deleteexpcategory_${ctx.from!.id}`;
    const categoryName: string = temp[tempKey].categories[categoryId];

    menu.push([
        Markup.button.callback('Confirm', `ConfDelExpCat_${categoryId}`),
        Markup.button.callback('Cancel', 'cancel'),
    ]);
    const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

    const msg: string = `Are you sure you want to delete "${categoryName}"?\
                         \nThis action will delete all expenses from this category.
                         \n——————————————————————————`;
    await TH.editInLineKeyboard(ctx, msg, keyboard, msgId);
});

bot.action(/^ConfDelExpCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deleteexpcategory_${ctx.from!.id}`;
    const { userId } = temp[tempKey];

    const deletedCategory: Type.ExpenseCategoryI = await ExpenseCategory.findOneAndDelete({
        _id: categoryId,
        userId,
    });

    await Expense.deleteMany({ categoryId, userId });

    const msg: string = `The todo category "<b>${deletedCategory!.name}</b>" has been deleted.`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^ConfRenameExpCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `renameexpcategory_${ctx.from!.id}`;
    const { userId, newName } = temp[tempKey];

    const category: Type.ExpenseCategoryI = await ExpenseCategory.findOne({ _id: categoryId, userId });
    category!.name = newName;
    await category!.save();

    const msg: string = `Category has been renamed to "<b>${category!.name}</b>"!`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^AddUserExpCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const menu: Type.InLineMenu[] = [];
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `addusertoexpcategory_${ctx.from!.id}`;
    const { newUsername } = temp[tempKey];
    const categoryName: string = temp[tempKey].categories[categoryId];

    menu.push([
        Markup.button.callback('Confirm', `ConfAddUserExpCat_${categoryId}`),
        Markup.button.callback('Cancel', 'cancel'),
    ]);
    const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

    const msg: string = `Please confirm if the information is correct?\
                         \n\
                         \n   Username:       ${newUsername}\
                         \n   Telegram Id:    ${newTelegramId}\
                         \n   Category:         ${categoryName}
                         \n——————————————————————————`;
    await TH.editInLineKeyboard(ctx, msg, keyboard, msgId);
});

bot.action(/^ConfAddUserExpCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `addusertoexpcategory_${ctx.from!.id}`;
    const { userId, newUserId, newUsername } = temp[tempKey];
    let msg: string = '';

    const category: Type.ExpenseCategoryI = await ExpenseCategory.findOne({ _id: categoryId, userId });

    const userAlreadyInCat = category!.userGroup.find((userId) => userId === newUserId);

    if (userAlreadyInCat) {
        msg = `${newUsername} is already in the ${category!.name}.`;
    } else {
        category!.userGroup.push(CF.objectId(newUserId));
        await category!.save();

        msg = `<b>${newUsername}</b>" has been added to <b>${category!.name}</b>.`;
    }

    TH.editMsgDeleteMsg(ctx, msg, msgId);
});
