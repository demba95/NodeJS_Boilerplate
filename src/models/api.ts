import CryptoJS from 'crypto-js';
import * as Type from '@cTypes/types';
import { NextFunction } from 'express';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SECRET_KEY_BASE: string = process.env.SECRET_KEY_BASE!;

const apiSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },

        key: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String,
            required: true,
            trim: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

apiSchema.pre<Type.ApiI>('save', function (next) {
    const api = this;

    if (api.isModified('key')) api.key = CryptoJS.AES.encrypt(this.get('key'), SECRET_KEY_BASE).toString();
    if (api.isModified('value')) api.value = CryptoJS.AES.encrypt(this.get('value'), SECRET_KEY_BASE).toString();
    next();
});

apiSchema.methods.getKey = function (callback) {
    const key = CryptoJS.AES.decrypt(this.get('key'), SECRET_KEY_BASE).toString(CryptoJS.enc.Utf8);
    const value = CryptoJS.AES.decrypt(this.get('value'), SECRET_KEY_BASE).toString(CryptoJS.enc.Utf8);

    callback(key, value);
};

apiSchema.set('toJSON', {
    transform: function (_: any, ret: Type.ApiI) {
        delete ret.key;
        delete ret.value;
        delete ret.userId;
        delete ret.createdAt;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<Type.ApiI>('Api', apiSchema);
