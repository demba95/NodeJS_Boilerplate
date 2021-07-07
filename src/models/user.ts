import * as Type from '@cTypes/types';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SALT_ROUNDS: number = 6;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
        },
        tempEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },
        verifyToken: String,
        password: {
            type: String,
            minlength: process.env.PASSWORD_LEN,
            require: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['incomplete', 'suspended', 'activated'],
            default: 'incomplete',
            required: true,
        },
        admin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre<Type.UserI>('save', async function (next) {
    const user = this;

    if (user.isModified('password')) user.password = await bcrypt.hash(this.get('password'), SALT_ROUNDS);
    next();
});

userSchema.methods.comparePassword = function (tryPassword, callback) {
    bcrypt.compare(tryPassword, this.get('password'), callback);
};

userSchema.set('toJSON', {
    transform: function (_: any, ret: Type.UserI) {
        delete ret.password;
        delete ret.verifyToken;
        delete ret.status;
        delete ret.admin;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<Type.UserI>('User', userSchema);
