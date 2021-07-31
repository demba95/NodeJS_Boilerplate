import '@config/database';
import { bot, secretPath } from '@config/telegram';
import '@controllers/telegram/telegram';
import apiRoutes from '@routes/api';
import deviceRoutes from '@routes/device';
import iotDeviceRoutes from '@routes/iot-device';
import userRoutes from '@routes/user';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'morgan';

const app: Application = express();
app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/api', apiRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/iot-device', iotDeviceRoutes);
app.use('/api/user', userRoutes);
app.use(bot.webhookCallback(secretPath));

app.get('/*', (_: Request, res: Response) => {
    res.status(404).json({ message: "Path doesn't exist." });
});

export default app;
