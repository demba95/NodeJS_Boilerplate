import mongoose from 'mongoose';

export type UserObj = {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: string;
    telegramId: string;
    isTelegramVerified: boolean;
};

export type ApiObj = {
    _id: mongoose.Types.ObjectId;
    name: string;
    key: string;
    value: string;
    url: string;
    active: boolean;
    userId: mongoose.Types.ObjectId;
};

export type LoginResponse = {
    body: string;
};

export type ResponseMsg = {
    body: {
        message: string;
    };
};

export type UserProfile = {
    body: {
        firstName: string;
        lastName: string;
        email: string;
    };
};

export type GetLoginTokenFn = {
    (user: UserObj): Promise<string>;
};
