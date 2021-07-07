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
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        tempEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        verifyToken: String,
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            require: true,
            minlength: process.env.PASSWORD_LEN,
            trim: true,
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
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.isEmailVerified;
        delete ret.admin;
        delete ret.verifyToken;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<Type.UserI>('User', userSchema);
