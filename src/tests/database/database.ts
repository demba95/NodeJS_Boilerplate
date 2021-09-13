import * as auth from '@auth';
import Api from '@models/api';
import Device from '@models/device';
import User from '@models/user';
import mongoose from 'mongoose';
import * as TestType from '../__mocks__/@types/types';

const JWT_DEVICE_SECRET_KEY: string = process.env.JWT_DEVICE_SECRET_KEY!;

export const user1: TestType.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 1',
    lastName: 'User last name 1',
    email: 'your_email_1@test.com',
    password: 'test123',
    status: 'activated',
    telegramId: '12345a',
    isTelegramVerified: true,
};

export const user2: TestType.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 2',
    lastName: 'User last name 2',
    email: 'your_email_2@test.com',
    password: 'test123',
    status: 'incomplete',
    telegramId: '12345b',
    isTelegramVerified: false,
};

export const user3: TestType.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 3',
    lastName: 'User last name 3',
    email: 'your_email_3@test.com',
    password: 'test123',
    status: 'activated',
    telegramId: '12345c',
    isTelegramVerified: true,
};

export const user4: TestType.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 4',
    lastName: 'User last name 4',
    email: 'your_email_4@test.com',
    password: 'test123',
    status: 'activated',
    telegramId: '12345d',
    isTelegramVerified: true,
};

export const user5: TestType.UserObj = {
    _id: mongoose.Types.ObjectId(),
    firstName: 'User name 5',
    lastName: 'User last name 5',
    email: 'your_email_5@test.com',
    password: 'test123',
    status: 'suspended',
    telegramId: '12345e',
    isTelegramVerified: true,
};

export const user1api1: TestType.ApiObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Api 1, User 1',
    key: 'Api key 1, User 1',
    value: 'Api secret value 1, User 1',
    url: 'www.rogertakeshita.com',
    active: true,
    userId: user1._id,
};

export const user1api2: TestType.ApiObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Api 2, User 1',
    key: 'Api key 2, User 1',
    value: 'Api secret value 2, User 1',
    url: 'www.rogertakeshita.com',
    active: false,
    userId: user1._id,
};

export const user3api1: TestType.ApiObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Api 1, User 3',
    key: 'Api key 1, User 3',
    value: 'Api secret value 1, User 3',
    url: 'www.rogertakeshita.com',
    active: true,
    userId: user3._id,
};

export const user1device1: TestType.DeviceObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Device 1, User 1',
    token: auth.createCustomToken('device', {}, JWT_DEVICE_SECRET_KEY, 7),
    expiresIn: 7,
    description: 'Device description 1, User 1',
    active: true,
    userId: user1._id,
};

export const user1device2: TestType.DeviceObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Device 2, User 1',
    token: auth.createCustomToken('device', {}, JWT_DEVICE_SECRET_KEY, 7),
    expiresIn: 7,
    description: 'Device description 2, User 1',
    active: false,
    userId: user1._id,
};

export const user3device1: TestType.DeviceObj = {
    _id: mongoose.Types.ObjectId(),
    name: 'Device 1, User 3',
    token: auth.createCustomToken('device', {}, JWT_DEVICE_SECRET_KEY, 7),
    expiresIn: 7,
    description: 'Device description 1, User 3',
    active: true,
    userId: user3._id,
};

export const setupDatabase = async () => {
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
    await Device.deleteMany({});
    await new Device(user1device1).save();
    await new Device(user1device2).save();
    await new Device(user3device1).save();
};

export const closeDatabase = async () => {
    mongoose.connection.close();
};
