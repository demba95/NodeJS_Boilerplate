import * as Type from '@cTypes';
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
            default: '',
            trim: true,
        },
        expiresIn: {
            type: Number,
            min: 0,
            default: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        notify: {
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
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<Type.IoTI>('IoT', iotSchema);
