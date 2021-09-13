import { Obj } from '@cTypes';
import mongoose from 'mongoose';

export type UpdateDocumentFn = {
    (document: Obj, body: Obj, permit: string[]): void;
};

export type ObjectIdFn = {
    (id: string): mongoose.Types.ObjectId;
};
