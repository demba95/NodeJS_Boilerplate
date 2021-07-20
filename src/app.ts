import '@config/database';
import { bot, secretPath } from '@config/telegram';
import '@controllers/telegram/telegram';
import apiRoutes from '@routes/apis';
import iotRoutes from '@routes/iots';
import userRoutes from '@routes/users';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'morgan';

const app: Application = express();
app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/iots', iotRoutes);
app.use('/api/apis', apiRoutes);
app.use(bot.webhookCallback(secretPath));

bot.catch(async (error: any, ctx) => {
    await ctx.reply(error.msg, { parse_mode: 'HTML' });
});

app.get('/*', (_: Request, res: Response) => {
    res.status(404).json({ message: "Path doesn't exist." });
});

export default app;
