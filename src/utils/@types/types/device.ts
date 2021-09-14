import { Document } from 'mongoose';

interface DeviceD extends Document {
    _id: string;
    name: string;
    token: string;
    expiresIn: number;
    description: string;
    active: boolean;
    notify: boolean;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export type DeviceI = DeviceD | null;

export type DeviceForm = {
    _id?: string;
    name?: string;
    token?: string;
    expiresIn?: number;
    description?: string;
    active?: boolean;
    notify?: boolean;
    userId?: string;
};
