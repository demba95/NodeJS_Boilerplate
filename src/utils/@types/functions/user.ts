import { UserI } from '@cTypes';
import { Response } from 'express';

export type AddTryFn = {
    (user: UserI, res: Response): void;
};

export type CheckTimeElapsedFn = {
    (user: UserI, res: Response): Promise<boolean>;
};
