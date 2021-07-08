import { Telegraf } from 'telegraf';

const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_WEBHOOK: string = process.env.TELEGRAM_WEBHOOK!;

if (TELEGRAM_BOT_TOKEN === undefined) throw new Error('TELEGRAM_BOT_TOKEN must be provided!');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const secretPath: string = `/telegram/${bot.secretPathComponent()}`;
const webhook: string = `${TELEGRAM_WEBHOOK}${secretPath}`;

bot.telegram.setWebhook(webhook);

console.log(`Telegram running on ${webhook}`);

export { bot, secretPath };
