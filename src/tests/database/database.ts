import User from '@models/user';
const ObjectID = require('mongodb').ObjectID;

type ObjectID = typeof import('mongodb').ObjectID;

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

const user1 = new UserClass(
    'Roger',
    'That',
    'your_email_1@test.com',
    'test123',
    true
);
const user2 = new UserClass(
    'Roger 1',
    'That 1',
    'your_email_2@test.com',
    'test123',
    false
);

const setupDatabase = async () => {
    await User.deleteMany({});
    await new User(user1).save();
    await new User(user2).save();
};
const newUser = async () => {};

export { user1, user2, setupDatabase, newUser };
