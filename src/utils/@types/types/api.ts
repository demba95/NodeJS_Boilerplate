import { Callback } from '@cTypes';
import { Document } from 'mongoose';

interface ApiD extends Document {
    _id: string;
    name: string;
    url: string;
    key: string;
    value: string;
    userId?: string;
    active: boolean;
    description: string;
    getKey?(callback: Callback): void;
    createdAt?: string;
    updatedAt?: string;
}

export type ApiI = ApiD | null;

export type ApiForm = {
    _id?: string;
    name?: string;
    url?: string;
    key?: string;
    value?: string;
    description?: string;
    active?: boolean;
};
