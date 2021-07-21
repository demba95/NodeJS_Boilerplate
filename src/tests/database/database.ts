import Api from '@models/api';
import User from '@models/user';
import mongoose from 'mongoose';
import * as Type from '../__mocks__/@types/types';

const user1: Type.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 1',
    lastName: 'User last name 1',
    email: 'your_email_1@test.com',
    password: 'test123',
    status: 'activated',
    telegramId: '12345a',
    isTelegramVerified: true,
};

const user2: Type.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 2',
    lastName: 'User last name 2',
    email: 'your_email_2@test.com',
    password: 'test123',
    status: 'incomplete',
    telegramId: '12345b',
    isTelegramVerified: false,
};

const user3: Type.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 3',
    lastName: 'User last name 3',
    email: 'your_email_3@test.com',
    password: 'test123',
    status: 'activated',
    telegramId: '12345c',
    isTelegramVerified: true,
};

const user4: Type.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 4',
    lastName: 'User last name 4',
    email: 'your_email_4@test.com',
    password: 'test123',
    status: 'activated',
    telegramId: '12345d',
    isTelegramVerified: true,
};

const user5: Type.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 5',
    lastName: 'User last name 5',
    email: 'your_email_5@test.com',
    password: 'test123',
    status: 'suspended',
    telegramId: '12345e',
    isTelegramVerified: true,
};

const user1api1: Type.ApiObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'First Api',
    key: 'First api key',
    value: 'First secret value',
    url: 'www.rogertakeshita.com',
    active: true,
    userId: user1._id,
};

const user1api2: Type.ApiObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Second Api',
    key: 'Second api key',
    value: 'Second secret value',
    url: 'www.rogertakeshita.com',
    active: false,
    userId: user1._id,
};

const user3api1: Type.ApiObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Third Api',
    key: 'Third api key',
    value: 'Third secret value',
    url: 'www.rogertakeshita.com',
    active: true,
    userId: user3._id,
};

const setupDatabase = async () => {
    await User.deleteMany({});
    await new User(user1).save();
    await new User(user2).save();
    await new User(user3).save();
    await new User(user4).save();
    await new User(user5).save();
    await Api.deleteMany({});
    await new Api(user1api1).save();
    await new Api(user1api2).save();
    await new Api(user3api1).save();
};

export { user1, user2, user3, user4, user5, user1api1, user1api2, user3api1, setupDatabase };
