import app from '~/app';
import User from '@models/user';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as type from '@custom_types/types';
import { user1, user2, setupDatabase } from './database/database';
const URL = '/users';

interface LoginResponse {
    body: {
        token: string;
    };
}

interface ResponseMSG {
    body: {
        message: string;
    };
}

interface UserProfile {
    body: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

beforeEach(setupDatabase);

describe("Users' API", () => {
    it('Should sign up - new user', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(201);
        const user: type.UserI = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();
        expect(response.body).toMatchObject({
            message:
                'Your account has been created. Please check your email to verify your account.',
        });
    });

    it('Should not sign up - existing user/email', async () => {
        const form: type.SignUpForm = {
            email: user1.email,
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            message: 'ERROR: Email already in use.',
        });
    });

    it('Should not sign up - empty first name', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: '',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            firstName: 'Must not be empty.',
        });
    });

    it('Should not sign up - empty last name', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: '',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            lastName: 'Must not be empty.',
        });
    });

    it('Should not sign up - empty email', async () => {
        const form: type.SignUpForm = {
            email: '',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must not be empty.',
        });
    });

    it('Should not sign up - invalid email', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must be a valid email address.',
        });
    });

    it('Should not sign up - empty password', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: '',
            confirmPassword: 'test123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            password: 'Must not be empty.',
            passwords: 'Must be equal.',
        });
    });

    it('Should not sign up - empty confirm password', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: '',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            confirmPassword: 'Must not be empty.',
            passwords: 'Must be equal.',
        });
    });

    it('Should not sign up - wrong confirm password', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123wrong',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            passwords: 'Must be equal.',
        });
    });

    it('Should not sign up - empty form', async () => {
        const form: type.SignUpForm = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            firstName: 'Must not be empty.',
            lastName: 'Must not be empty.',
            email: 'Must not be empty.',
            password: 'Must not be empty.',
            confirmPassword: 'Must not be empty.',
        });
    });

    it('Should login - verified email', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const userData = <type.UserJWT>(
            jwt.verify(response.body.token, process.env.JWT_SECRET_KEY)
        );
        const user: type.UserI = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();
        expect(userData).toMatchObject({
            firstName: user1.firstName,
            lastName: user1.lastName,
        });
    });

    it('Should not login - unverified user', async () => {
        const form: type.LoginForm = {
            email: user2.email,
            password: user2.password,
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(403);
        expect(response.body).toMatchObject({
            message: 'ERROR: Please verify your email first.',
        });
    });

    it('Should not login - wrong password', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password + 'wrong_password',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            message: 'ERROR: Wrong credentials.',
        });
    });

    it('Should not login - empty password', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: '',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            password: 'Must not be empty.',
        });
    });

    it('Should not login - invalid email', async () => {
        const form: type.LoginForm = {
            email: 'your_email_3@test',
            password: user1.password,
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must be a valid email address.',
        });
    });

    it('Should not login - empty email', async () => {
        const form: type.LoginForm = {
            email: '',
            password: user1.password,
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must not be empty.',
        });
    });

    it("Should fetch user's profile", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body.token;
        const profile: UserProfile = await request(app)
            .get(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(profile.body).toMatchObject({
            firstName: user1.firstName,
            lastName: user1.lastName,
            email: user1.email,
        });
    });
});
