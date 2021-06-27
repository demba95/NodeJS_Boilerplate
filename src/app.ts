import '@config/database';
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

app.get('/*', (_: Request, res: Response) => {
    res.status(404).json({ message: "Path doesn't exist." });
});

export default app;
