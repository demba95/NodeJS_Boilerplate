import Api from '@models/api';
import User from '@models/user';
import { ObjectID } from 'mongodb';

class UserClass {
    _id: ObjectID;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isEmailVerified: boolean;

    constructor(
        protected readonly _firstName: string,
        _lastName: string,
        _email: string,
        _password: string,
        _isEmailVerified: boolean
    ) {
        this._id = new ObjectID();
        this.firstName = _firstName;
        this.lastName = _lastName;
        this.email = _email;
        this.password = _password;
        this.isEmailVerified = _isEmailVerified;
    }
}

class ApiClass {
    _id: ObjectID;
    userId: ObjectID;
    name: string;
    key: string;
    value: string;
    url: string;
    active: boolean;

    constructor(
        protected readonly _name: string,
        _key: string,
        _value: string,
        _url: string,
        _active: boolean,
        _userId: ObjectID
    ) {
        this._id = new ObjectID();
        this.name = _name;
        this.key = _key;
        this.value = _value;
        this.url = _url;
        this.active = _active;
        this.userId = _userId;
    }
}

const user1 = new UserClass('User name 1', 'User last name 1', 'your_email_1@test.com', 'test123', true);
const user2 = new UserClass('User name 2', 'User last name 2', 'your_email_2@test.com', 'test123', false);
const user3 = new UserClass('User name 3', 'User last name 3', 'your_email_3@test.com', 'test123', true);
const user4 = new UserClass('User name 4', 'User last name 4', 'your_email_4@test.com', 'test123', true);
const user1api1 = new ApiClass(
    'First Api',
    'First api key',
    'First secret value',
    'www.rogertakeshita.com',
    true,
    user1._id
);
const user1api2 = new ApiClass(
    'Second Api',
    'Second api key',
    'Second secret value',
    'www.rogertakeshita.com',
    false,
    user1._id
);
const user3api1 = new ApiClass(
    'Third Api',
    'Third api key',
    'Third secret value',
    'www.rogertakeshita.com',
    true,
    user3._id
);

const setupDatabase = async () => {
    await User.deleteMany({});
    await new User(user1).save();
    await new User(user2).save();
    await new User(user3).save();
    await new User(user4).save();
    await Api.deleteMany({});
    await new Api(user1api1).save();
    await new Api(user1api2).save();
    await new Api(user3api1).save();
};

export { user1, user2, user3, user4, user1api1, user1api2, user3api1, setupDatabase };
