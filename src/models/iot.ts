import * as Type from '@cTypes/types';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const iotSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        token: {
            type: String,
            required: true,
            trim: true,
        },
        expiresIn: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
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

iotSchema.set('toJSON', {
    transform: function (_: any, ret: Type.IoTI) {
        delete ret.userId;
        delete ret.createdAt;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<Type.IoTI>('Api', iotSchema);
