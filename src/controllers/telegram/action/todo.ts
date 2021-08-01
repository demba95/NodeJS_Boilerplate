import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Todo from '@models/todo';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.action(/^AddTodoToCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `newtodo_${ctx.from!.id}`;
    const { userId, name, categories } = temp[tempKey];
    const categoryName: string = categories[categoryId];

    const newTodo = new Todo({
        userId,
        name,
        categoryId,
    });
    await newTodo.save();

    const msg: string = `"${newTodo.name}" has been added to <b>${categoryName}</b> category!`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^CheckTodoCat_(.+)/i, async (ctx) => {
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const categoryId: string = ctx.match[1]!;
    const tempKey: string = `todo_${ctx.from!.id}`;
    const { userId } = temp[tempKey];
    let todos: Type.TodoI[];
    let msg: string = '';

    if (categoryId !== 'all') {
        todos = await Todo.find({ userId, categoryId }).populate('categoryId');
    } else {
        todos = await Todo.find({ userId }).populate('categoryId');
    }

    if (todos.length === 0) {
        msg = "You don't have any todos.";
    } else {
        let todosStr: string = '';
        const categoryName: string = ctx.match[1] !== 'all' ? todos[0]!.categoryId['name'] : '';

        todos.forEach((todo) => {
            const cat: string = ctx.match[1] === 'all' ? ` (${todo!.categoryId['name']})` : '';
            todosStr += `\n   → ${todo!.name}${cat}`;
        });

        msg = `Your have ${todos.length} <b>${categoryName}</b> todo(s):\
               \n\
               ${todosStr}`;
    }

    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^DelTodo (.+)/i, async (ctx) => {
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deletetodo_${ctx.from!.id}`;
    const todoId: string = ctx.match[1]!;
    const { name, categoryName } = temp[tempKey].todos[todoId];
    const menu: Type.InLineMenu[] = [];

    menu.push([Markup.button.callback('Confirm', `ConfDelTodo_${todoId}`), Markup.button.callback('Cancel', 'cancel')]);
    const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

    const msg: string = `Are you sure you want to delete the following todo from <b>${categoryName}</b>?\
                         \n\
                         \n   → ${name}
                         \n——————————————————————————`;
    await TH.editInLineKeyboard(ctx, msg, keyboard, msgId);
});

bot.action(/^ConfDelTodo_(.+)/, async (ctx) => {
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deletetodo_${ctx.from!.id}`;
    const todoId: string = ctx.match[1]!;
    const { userId } = temp[tempKey];

    const deletedTodo: Type.TodoI = await Todo.findOneAndDelete({ _id: todoId, userId });

    const msg: string = `The following todo has been deleted:\
                         \n\
                         \n   → ${deletedTodo!.name}`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});
