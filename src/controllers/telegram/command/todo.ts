import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Todo from '@models/todo';
import TodoCategory from '@models/todo-category';
import * as TH from '@telegram-helper';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.hears(/\/newtodo (.+)/i, async (ctx) => {
    const categoriesObj: Type.Obj = {};
    const menu: Type.InLineMenu[] = [];
    const name: string = ctx.match[1]!;
    const tempKey: string = `newtodo_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const todoExists: Type.TodoI = await Todo.findOne({ name, userId: user!._id });

        if (todoExists) {
            msg = 'This todo already exists.';
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        const categories: Type.TodoCategoryI[] = await TodoCategory.find({ userId: user!._id });

        if (categories.length === 0) {
            msg = 'Category doesn\'t exist! Please create one using /newtodocategory "category name" and try again.';
            await TH.sendMsgDeleteMsg(ctx, msg);
        }

        for (let i = 0; i < categories.length; i++) {
            categoriesObj[categories[i]!._id] = categories[i]!.name;

            if (i + 1 < categories.length) {
                categoriesObj[categories[i + 1]!._id] = categories[i + 1]!.name;
                menu.push([
                    Markup.button.callback(categories[i]!.name, `AddTodoToCat_${categories[i]!._id}`),
                    Markup.button.callback(categories[i + 1]!.name, `AddTodoToCat_${categories[i + 1]!._id}`),
                ]);
                i++;
            } else {
                menu.push([Markup.button.callback(categories[i]!.name, `AddTodoToCat_${categories[i]!._id}`)]);
            }
        }
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            name,
            categories: categoriesObj,
        };

        msg = `Where should I add "${name}"?\
               \nPlease select one of the following categories:\
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while adding your todo.' };
    }
});

bot.hears(/\/todo[s]?$/i, async (ctx) => {
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `todo_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.TodoCategoryI[] = await TodoCategory.find({ userId: user!._id })
            .select('_id name')
            .sort({ name: 1 });

        if (categories.length === 0) {
            msg = "You don't have any todo. Add one using /newtodo <your todo>";
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        for (let i = 0; i < categories.length; i++) {
            if (i + 1 < categories.length) {
                menu.push([
                    Markup.button.callback(categories[i]!.name, `CheckTodoCat_${categories[i]!._id}`),
                    Markup.button.callback(categories[i + 1]!.name, `CheckTodoCat_${categories[i + 1]!._id}`),
                ]);
                i++;
            } else {
                menu.push([Markup.button.callback(categories[i]!.name, `CheckTodoCat_${categories[i]!._id}`)]);
            }
        }
        menu.push([Markup.button.callback('All', 'CheckTodoCat_all')]);
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
        };

        msg = `Which category do you want to check?\
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while getting your todos.' };
    }
});

bot.command('deletetodo', async (ctx) => {
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `deletetodo_${ctx.from.id}`;
    const todosObj: Type.Obj = {};
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const todos: Type.TodoI[] = await Todo.find({ userId: user!._id }).populate('categoryId');

        if (todos.length === 0) {
            msg = "You don't have any todo.";
            return await TH.sendMsgDeleteMsg(ctx, msg, 5);
        }

        todos.forEach((todo) => {
            todosObj[todo!._id] = {
                name: todo!.name,
                categoryName: todo!.categoryId['name'],
            };
            menu.push([Markup.button.callback(`${todo!.name} (${todo!.categoryId['name']})`, `DelTodo ${todo!._id}`)]);
        });
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            todos: todosObj,
        };

        msg = `Which todo should I delete?\
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong while deleting your todo.' };
    }
});
