import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Todo from '@models/todo';
import TodoCategory from '@models/todo-category';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.action(/^DelTodoCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const menu: Type.InLineMenu[] = [];
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deletetodocategory_${ctx.from!.id}`;
    const categoryName: string = temp[tempKey].categories[categoryId];

    menu.push([
        Markup.button.callback('Confirm', `ConfDelTodoCat_${categoryId}`),
        Markup.button.callback('Cancel', 'cancel'),
    ]);
    const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

    const msg: string = `Are you sure you want to delete "${categoryName}"?\
                         \nThis action will delete all todos from this category.
                         \n——————————————————————————`;
    await TH.editInLineKeyboard(ctx, msg, keyboard, msgId);
});

bot.action(/^ConfDelTodoCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deletetodocategory_${ctx.from!.id}`;
    const { userId } = temp[tempKey];

    const deletedCategory: Type.TodoCategoryI = await TodoCategory.findOneAndDelete({
        _id: categoryId,
        userId,
    });

    await Todo.deleteMany({ categoryId, userId });

    const msg: string = `The todo category "<b>${deletedCategory!.name}</b>" has been deleted.`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^ConfRenameTodoCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `renametodocategory_${ctx.from!.id}`;
    const { userId, newName } = temp[tempKey];

    const category: Type.TodoCategoryI = await TodoCategory.findOne({ _id: categoryId, userId });
    category!.name = newName;
    await category!.save();

    const msg: string = `Category has been renamed to "<b>${category!.name}</b>"!`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});
