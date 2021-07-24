import * as Type from '@cTypes';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const deviceSchema = new Schema(
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

deviceSchema.set('toJSON', {
    transform: function (_: any, ret: Type.DeviceI) {
        delete ret!.userId;
        delete ret!.createdAt;
        delete ret!.updatedAt;
        delete ret!.__v;
        return ret;
    },
});

export default mongoose.model<Type.DeviceI>('Device', deviceSchema);
