import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Expense from '@models/expense';
import * as TH from '@telegram-helper';
import moment from 'moment';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.action(/^AddExp_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const date: string = moment(new Date()).format('YYYY/MM/DD');
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `addexpense_${ctx.from!.id}`;
    const { userId, name, value, categories } = temp[tempKey];
    const categoryName: string = categories[categoryId];

    const newExpense = new Expense({ userId, name, value, categoryId });
    await newExpense.save();

    const msg: string = `A new expense has been added:\
                        \n\
                        \n   Value:             -$${value}\
                        \n   Ref:                 ${name}\
                        \n   Category:       ${categoryName}\
                        \n   Date:               ${date}`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^CheckExpCat_(.+)/i, async (ctx) => {
    const categoryId: string = ctx.match[1]!;
    const date: string = moment(new Date()).format('YYYY-MM-01').toString();
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `expense_${ctx.from!.id}`;
    const { userId } = temp[tempKey];
    let msg: string = '';
    let expenses: Type.ExpenseI[];

    if (categoryId !== 'all') {
        expenses = await Expense.find({ userId, categoryId, createdAt: { $gte: date } }).populate('categoryId');
    } else {
        expenses = await Expense.find({ userId, createdAt: { $gte: date } }).populate('categoryId');
    }

    if (expenses.length === 0) {
        msg = "You don't have any expense.";
    } else {
        let expensesStr: string = '';
        let totalExpense: number = 0;

        expenses.forEach((expense) => {
            const date: string = moment(expense!.createdAt).format('MM/DD');
            const exp: string = ctx.match[1]! === 'all' ? ` (${expense!.categoryId['name']})` : '';

            expensesStr += `\n   → <b>${date} -$${expense!.value.toFixed(2)}</b> ${expense!.name}${exp}`;
            totalExpense += +expense!.value;
        });

        const categoryName: string = ctx.match[1]! !== 'all' ? expenses[0]!.categoryId['name'] : '';
        const total: number = +totalExpense.toFixed(2);
        msg = `Your have ${expenses.length} ${categoryName} expense(s) <b>-$${total}</b>:\
               \n\
               ${expensesStr}`;
    }

    TH.editMsgDeleteMsg(ctx, msg, msgId);
});

bot.action(/^DelExp_(.+)/i, async (ctx) => {
    const expenseId: string = ctx.match[1]!;
    const tempKey: string = `deleteexp_${ctx.from!.id}`;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const menu: Type.InLineMenu[] = [];
    const { name, value, categoryName, date } = temp[tempKey].expenses[expenseId];

    menu.push([
        Markup.button.callback('Confirm', `ConfDelExp_${expenseId}`),
        Markup.button.callback('Cancel', 'cancel'),
    ]);
    const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

    const msg: string = `Are you sure you want to delete the following expense?\
                        \n\
                        \n                       Value:             -$${value}\
                        \n                       Ref:                 ${name}\
                        \n                       Category:       ${categoryName}\
                        \n                       Date:               ${date}
                        \n——————————————————————————`;
    await TH.editInLineKeyboard(ctx, msg, keyboard, msgId);
});

bot.action(/^ConfDelExp_(.+)/i, async (ctx) => {
    const expenseId: string = ctx.match[1]!;
    const msgId: number = ctx.update.callback_query.message!.message_id;
    const tempKey: string = `deleteexp_${ctx.from!.id}`;
    const { userId, expenses } = temp[tempKey];

    const deletedExpense: Type.ExpenseI = await Expense.findOneAndDelete({ _id: expenseId, userId });
    const value: number = +deletedExpense!.value.toFixed(2);

    const msg: string = `The following expense has been deleted:\
                         \n\
                         \n   → -$${value} ${deletedExpense!.name} (${expenses[expenseId].date})`;
    TH.editMsgDeleteMsg(ctx, msg, msgId);
});
