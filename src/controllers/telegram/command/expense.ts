import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Expense from '@models/expense';
import ExpenseCategory from '@models/expense-category';
import * as TH from '@telegram-helper';
import moment from 'moment';
import { Markup } from 'telegraf';
import temp from '~/tmp/temp';

bot.hears(/^\$(\d+[.,]?\d*) (.*)/i, async (ctx) => {
    const categoriesObj: Type.Obj = {};
    const name: string = ctx.match[2]!;
    const value: number = +ctx.match[1]!.replace(',', '.');
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `addexpense_${ctx.from.id}`;
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
            msg = "You don't have a category, please add first /newexpcategory and try again.";
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        for (let i = 0; i < categories.length; i++) {
            categoriesObj[categories[i]!._id] = categories[i]!.name;

            if (i + 1 < categories.length) {
                categoriesObj[categories[i + 1]!._id] = categories[i + 1]!.name;
                const userExpLeft: string =
                    user!._id.toString() !== categories[i]!.userId!['_id'].toString()
                        ? `${categories[i]!.name} (${categories[i]!.userId!['firstName']})`
                        : `${categories[i]!.name}`;
                const userExpRight: string =
                    user!._id.toString() !== categories[i + 1]!.userId!['_id'].toString()
                        ? `${categories[i + 1]!.name} (${categories[i + 1]!.userId!['firstName']})`
                        : `${categories[i + 1]!.name}`;

                menu.push([
                    Markup.button.callback(userExpLeft, `AddExp_${categories[i]!._id}`),
                    Markup.button.callback(userExpRight, `AddExp_${categories[i + 1]!._id}`),
                ]);
                i++;
            } else {
                const userExpOne: string =
                    categories[i]!._id.toString() !== categories[i]!.userId!['_id'].toString()
                        ? `${categories[i]!.name} (${categories[i]!.userId!['firstName']})`
                        : '';

                menu.push([Markup.button.callback(userExpOne, `AddExp_${categories[i]!._id}`)]);
            }
        }
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            name,
            value: value.toFixed(2),
            categories: categoriesObj,
        };

        msg = `Where should I add the new expense?\
               \n\
               \n   Value:    -$${value.toFixed(2)}\
               \n   Ref:        ${name}
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong saving your expense.' };
    }
});

bot.hears(/\/expense[s]?$/i, async (ctx) => {
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `expense_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({
            $or: [{ userId: user!._id }, { userGroup: user!._id }],
        })
            .populate('userId')
            .sort({ name: 1 });

        if (categories.length === 0) {
            msg = "You don't have any expense. Add one using $xx.xx <expense reference>";
            return await TH.sendMsgDeleteMsg(ctx, msg);
        }

        for (let i = 0; i < categories.length; i++) {
            if (i + 1 < categories.length) {
                const expenseLeft: string =
                    user!._id.toString() !== categories[i]!.userId!['_id'].toString()
                        ? `${categories[i]!.name} (${categories[i]!.userId!['firstName']})`
                        : `${categories[i]!.name}`;
                const expenseRight: string =
                    user!._id.toString() !== categories[i + 1]!.userId!['_id'].toString()
                        ? `${categories[i + 1]!.name} (${categories[i]!.userId!['firstName']})`
                        : `${categories[i + 1]!.name}`;

                menu.push([
                    Markup.button.callback(expenseLeft, `CheckExpCat_${categories[i]!._id}`),
                    Markup.button.callback(expenseRight, `CheckExpCat_${categories[i + 1]!._id}`),
                ]);
                i++;
            } else {
                const expenseOne: string =
                    user!._id.toString() !== categories[i]!.userId!['_id'].toString()
                        ? `${categories[i]!.name} (${categories[i]!.userId!['firstName']})`
                        : `${categories[i]!.name}`;

                menu.push([Markup.button.callback(expenseOne, `CheckExpCat_${categories[i]!._id}`)]);
            }
        }
        menu.push([Markup.button.callback('All', 'CheckExpCat_all')]);
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
        };

        msg = `Which category do you want to check?
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong fetching your expenses.' };
    }
});

bot.command('balance', async (ctx) => {
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({
            $or: [{ userId: user!._id }, { userGroup: user!._id }],
        }).select('_id name');
        const categoryIdArray: string[] = categories.map((category) => category!._id);
        const currentDate = new Date();
        const currentMonth: number = currentDate.getMonth();
        const firstDay = new Date(
            `${currentDate.getFullYear()}-${currentMonth < 10 ? `0${currentMonth + 1}` : currentMonth.toString()}-01`
        );
        const currentBalance: Type.ExpenseI[] = await Expense.aggregate([
            {
                $match: { categoryId: { $in: categoryIdArray }, createdAt: { $gte: firstDay } },
            },
            {
                $group: { _id: { $month: '$createdAt' }, total: { $sum: '$value' } },
            },
        ]);

        if (currentBalance.length === 0) {
            msg = "You don't have any expense.";
        } else {
            const findMonth = currentBalance.find((month) => +month!._id === currentMonth + 1);
            msg = `Your current balance is: <b>-$${findMonth!.total!.toFixed(2)}</b>`;
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong fetching your expenses.' };
    }
});

bot.command('expensehistory', async (ctx) => {
    const months: string[] = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({
            $or: [{ userId: user!._id }, { userGroup: user!._id }],
        }).select('_id name');

        const categoryIdArray: string[] = categories.map((category) => category!._id);
        const date: Date = new Date(`${new Date().getFullYear()}-01-01`);

        const balance: Type.ExpenseI[] = await Expense.aggregate([
            {
                $match: { categoryId: { $in: categoryIdArray }, createdAt: { $gte: date } },
            },
            {
                $group: { _id: { $month: '$createdAt' }, total: { $sum: '$value' } },
            },
        ]);

        if (balance.length === 0) {
            msg = "You don't have any expense.";
        } else {
            let strBalance: string = '';
            let totalBalance: number = 0;

            balance.forEach((month) => {
                const currentTotal: string = month!.total!.toFixed(2);
                strBalance += `\n   → ${months[+month!._id - 1]} <b>-$${currentTotal}</b>`;
                totalBalance += month!.total!;
            });

            msg = `Your current balance is: <b>-$${totalBalance.toFixed(2)}</b>\
                   \n\
                   ${strBalance}`;
        }

        await TH.sendMsgDeleteMsg(ctx, msg);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong fetching your expenses.' };
    }
});

bot.command('deleteexp', async (ctx) => {
    const expensesObj: Type.Obj = {};
    const menu: Type.InLineMenu[] = [];
    const tempKey: string = `deleteexp_${ctx.from.id}`;
    let msg: string = '';

    try {
        const user = await TH.deleteMsgGetUser(ctx);
        const categories: Type.ExpenseCategoryI[] = await ExpenseCategory.find({
            $or: [{ userId: user!._id }, { userGroup: user!._id }],
        }).select('_id');
        const categoryIdArray: string[] = categories.map((category) => category!._id);
        const date: string = moment(new Date()).format('YYYY-MM-01');
        const expenses: Type.ExpenseI[] = await Expense.find({
            categoryId: { $in: categoryIdArray },
            createdAt: { $gte: date },
        }).populate('categoryId');

        if (expenses.length === 0) {
            msg = "You don't have any expense.";
            return await TH.sendMsgDeleteMsg(ctx, msg, 5);
        }

        expenses.forEach((expense) => {
            const value: string = expense!.value.toFixed(2);
            const exp: string = `${date} -$${value} ${expense!.name} (${expense!.categoryId['name']})`;
            expensesObj[expense!._id] = {
                name: expense!.name,
                value: value,
                categoryName: expense!.categoryId['name'],
                date: moment(expense!.createdAt).format('YYYY/MM/DD'),
            };

            menu.push([Markup.button.callback(exp, `DelExp_${expense!._id}`)]);
        });
        menu.push([Markup.button.callback('Cancel', 'cancel')]);
        const keyboard: Type.InLineKeyboard = Markup.inlineKeyboard(menu);

        temp[tempKey] = {
            userId: user!._id,
            expenses: expensesObj,
        };

        msg = `Which expense should I delete?
               \n——————————————————————————`;
        await TH.sendInLineKeyboard(ctx, msg, keyboard);
    } catch (error) {
        if (error.type === 'USER_NOT_REGISTERED' || error.type === 'USER_NOT_VERIFIED') throw error;
        throw { type: 'INTERNAL_ERROR', message: 'Something went wrong deleting your expense.' };
    }
});
