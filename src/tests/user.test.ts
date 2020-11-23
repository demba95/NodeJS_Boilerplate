import app from '~/app';
import User from '@models/user';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as type from '@customTypes/types';
import { user1, user2, setupDatabase } from './database/database';
import { types } from '@babel/core';

const URL = '/api/users';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY;
const PASSWORD_LEN = process.env.PASSWORD_LEN;

beforeEach(setupDatabase);

describe("User's API", () => {
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

    it('Should not sign up - password length', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: '12',
            confirmPassword: '12',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/signup`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            passwordLength: `Must be greater than ${PASSWORD_LEN} characters.`,
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

    it('Should verify account', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: type.UserI = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();

        const response = await request(app)
            .get(`${URL}/email/${user.verifyToken}`)
            .expect(200);
        expect(response.body).toMatchObject({
            message: 'Thank you! Your email has been verified.',
        });
    });

    it('Should not verify account - empty email token', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: type.UserI = await User.findOne({ email: form.email });
        await User.findByIdAndDelete(user._id);
        const response = await request(app)
            .get(`${URL}/email/${user.verifyToken}`)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'ERROR: User not found.',
        });
    });

    it('Should not verify account - empty email token', async () => {
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: type.UserI = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();

        await request(app).get(`${URL}/email/`).expect(404);
    });

    it('Should not verify account - invalid email token', async () => {
        const expiredVerifyToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2RlIjoiZW1haWwiLCJpYXQiOjE2MDI2ODg3MjEsImV4cCI6MTYwMzI5MzUyMX0.CWhtDg0BYoaL9sld0hwOd7U12agsXSB-7SZ6XYF9hko';
        const form: type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: type.UserI = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();

        const response = await request(app)
            .get(`${URL}/email/${expiredVerifyToken}`)
            .expect(401);
        expect(response.body).toMatchObject({
            message: 'ERROR: Expired email token.',
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
            jwt.verify(response.body, JWT_SECRET_KEY)
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
            .expect(403);
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

    it('Should not login - email not found', async () => {
        const form: type.LoginForm = {
            email: 'user1@notfound.com',
            password: user1.password,
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'ERROR: User not found.',
        });
    });

    it('Should not authorize - invalid token', async () => {
        const invalidToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDM0NzQwMDIsImV4cCI6MTYwNDA3ODgwMn0.sDZ06WC2MhtswMgE_4UX7VL_cLD10CMUkjo72ArYfaI';
        const profile: UserProfile = await request(app)
            .get(`${URL}/profile`)
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401);
        expect(profile.body).toMatchObject({
            message: 'Not authorized, invalid token.',
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
        const token: string = response.body;
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

    it("Should not fetch user's profile - user not found", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        await User.findByIdAndDelete(user1._id);
        const profile: UserProfile = await request(app)
            .get(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(profile.body).toMatchObject({
            message: 'ERROR: User not found.',
        });
    });

    it("Should not fetch user's profile - invalid token", async () => {
        const invalidToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        const profile: UserProfile = await request(app)
            .get(`${URL}/profile`)
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401);
        expect(profile.body).toMatchObject({
            message: 'Not authorized, invalid token.',
        });
    });

    it("Should not fetch user's profile - empty token", async () => {
        const profile: UserProfile = await request(app)
            .get(`${URL}/profile`)
            .send()
            .expect(401);
        expect(profile.body).toMatchObject({
            message: 'Token not found.',
        });
    });

    it("Should update user's fistName", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            firstName: 'Roger Update',
            password: user1.password,
        };
        await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        const user: type.UserI = await User.findById({ _id: user1._id });
        expect(user).toMatchObject({
            firstName: updateUser.firstName,
        });
    });

    it("Should update user's lastName", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            lastName: 'That Update',
            password: user1.password,
        };
        await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        const user: type.UserI = await User.findById({ _id: user1._id });
        expect(user).toMatchObject({
            lastName: updateUser.lastName,
        });
    });

    it('Should update password', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            password: user1.password,
            newPassword: '12345',
            confirmNewPassword: '12345',
        };
        await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const form2: type.LoginForm = {
            email: user1.email,
            password: updateUser.newPassword,
        };
        const response2: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form2)
            .expect(200);
        expect(typeof response2.body).toBe('string');
    });

    it("Should not update user's profile - user not found", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        await User.findByIdAndDelete(user1._id);
        const updateUser = <type.UpdateUserForm>{
            firstName: 'new name',
            password: user1.password,
        };
        const profile: UserProfile = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(profile.body).toMatchObject({
            message: 'ERROR: User not found.',
        });
    });

    it("Should not update user's profile - empty password", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            firstName: 'new name',
            password: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            password: 'Must not be empty.',
        });
    });

    it("Should not update user's profile - password length", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            password: user1.password,
            newPassword: '12',
            confirmNewPassword: '12',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            passwordLength: `Must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it("Should not update user's email - empty new email", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser2 = <type.UpdateUserForm>{
            password: user1.password,
            newEmail: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            newEmail: 'Must not be empty.',
        });
    });

    it("Should not update user's first Name - empty first name", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser2 = <type.UpdateUserForm>{
            password: user1.password,
            firstName: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            firstName: 'Must not be empty.',
        });
    });

    it("Should not update user's last Name - empty last name", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser2 = <type.UpdateUserForm>{
            password: user1.password,
            lastName: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            lastName: 'Must not be empty.',
        });
    });

    it("Should not update user's password - empty new password", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser2 = <type.UpdateUserForm>{
            password: user1.password,
            newPassword: '',
            confirmNewPassword: '12345678',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            newPassword: 'Must not be empty.',
            passwords: 'Must be equal.',
        });
    });

    it("Should not update user's password - empty confirm new password", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser2 = <type.UpdateUserForm>{
            password: user1.password,
            newPassword: '12345678',
            confirmNewPassword: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            confirmNewPassword: 'Must not be empty.',
            passwords: 'Must be equal.',
        });
    });

    it("Should not update user's email - invalid new email", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            password: user1.password,
            newEmail: 'roger@',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            newEmail: 'Must be a valid email address.',
        });
    });

    it("Should not update user's email - email already in use", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            password: user1.password,
            newEmail: user2.email,
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            message: `ERROR: Email (${user2.email}) is already in use.`,
        });
    });

    it("Should not update user's profile - wrong credentials", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            password: user1.password + 'wrong_password',
            newEmail: 'new_email@email.com',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        expect(response2.body).toMatchObject({
            message: 'ERROR: Wrong credentials.',
        });
    });

    it("Should update user's email", async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const updateUser = <type.UpdateUserForm>{
            password: user1.password,
            newEmail: 'your_email_3_update@test.com',
        };
        await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        const user: type.UserI = await User.findById({ _id: user1._id });
        expect(user).toMatchObject({
            tempEmail: updateUser.newEmail,
        });
    });

    it('Should delete user/profile', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password })
            .expect(200);
        expect(response2.body).toMatchObject({
            message: 'Your account has been deleted.',
        });
    });

    it('Should not delete user/profile - user not found', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        await User.findByIdAndDelete(user1._id);
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password })
            .expect(404);
        expect(response2.body).toMatchObject({
            message: 'ERROR: User not found.',
        });
    });

    it('Should not delete user/profile - invalid token', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .send({ password: form.password })
            .expect(401);
        expect(response.body).toMatchObject({
            message: 'Token not found.',
        });
    });

    it('Should not delete user/profile - invalid password', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password + 'wrong_password' })
            .expect(403);
        expect(response2.body).toMatchObject({
            message: 'ERROR: Wrong password.',
        });
    });

    it('Should not delete user/profile - empty password', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: '' })
            .expect(400);
        expect(response2.body).toMatchObject({
            password: 'Must not be empty.',
        });
    });

    it('Should not delete user/profile - invalid password length', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: '123' })
            .expect(400);
        expect(response2.body).toMatchObject({
            password: `Must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should not delete user/profile - invalid password', async () => {
        const form: type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/login`)
            .send(form)
            .expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password + 'wrong_password' })
            .expect(403);
        expect(response2.body).toMatchObject({
            message: 'ERROR: Wrong password.',
        });
    });

    it('Should not resend email verification - empty email', async () => {
        const response: UserProfile = await request(app)
            .post(`${URL}/email`)
            .send({ email: '' })
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must not be empty.',
        });
    });

    it('Should not resend email verification - invalid email', async () => {
        const response: UserProfile = await request(app)
            .post(`${URL}/email`)
            .send({ email: 'invalid_email@email' })
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must be a valid email address.',
        });
    });

    it('Should not resend email verification - email not found', async () => {
        const response: UserProfile = await request(app)
            .post(`${URL}/email`)
            .send({ email: 'not_found@email.com' })
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'ERROR: Email not found.',
        });
    });

    it('Should not resend email verification - email already verified', async () => {
        const response: UserProfile = await request(app)
            .post(`${URL}/email`)
            .send({ email: user1.email })
            .expect(200);
        expect(response.body).toMatchObject({
            message: 'Your account is already verified.',
        });
    });

    it('Should reset password', async () => {
        const form: type.EmailForm = {
            email: user1.email,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/password`)
            .send(form)
            .expect(200);
        const user: type.UserI = await User.findById(user1._id);
        expect(user.verifyToken).not.toBeNull();
        expect(response.body).toMatchObject({
            message: 'Please check your email to reset your password.',
        });
    });

    it('Should not reset password - not found email', async () => {
        const form: type.EmailForm = {
            email: 'not_found' + user1.email,
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/password`)
            .send(form)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'ERROR: Email not found.',
        });
    });

    it('Should not reset password - invalid email', async () => {
        const form: type.EmailForm = {
            email: 'invalid@email',
        };

        const response: LoginResponse = await request(app)
            .post(`${URL}/password`)
            .send(form)
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Must be a valid email address.',
        });
    });

    it('Should update reset password', async () => {
        const form: type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: type.UserI = await User.findById(user1._id);

        const form2: type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };

        const response2: ResponseMSG = await request(app)
            .post(`${URL}/password/${user.verifyToken}`)
            .send(form2)
            .expect(200);
        expect(response2.body).toMatchObject({
            message: 'Password updated successfully.',
        });

        const userReq2: type.UserI = await User.findById(user1._id);
        userReq2.comparePassword(form2.password, (_, isMatch) => {
            if (isMatch) {
                expect(isMatch).toBeTruthy();
            }
        });
        expect(response2.body).toMatchObject({
            message: 'Password updated successfully.',
        });
    });

    it('Should not update reset password - user not found', async () => {
        const form: type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: type.UserI = await User.findById(user1._id);

        const form2: type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };

        await User.findByIdAndDelete(user1._id);
        const response2: ResponseMSG = await request(app)
            .post(`${URL}/password/${user.verifyToken}`)
            .send(form2)
            .expect(404);
        expect(response2.body).toMatchObject({
            message: 'ERROR: User not found.',
        });
    });

    it('Should not update reset password - different passwords', async () => {
        const form: type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: type.UserI = await User.findById(user1._id);

        const form2: type.PasswordForm = {
            password: '12345678',
            confirmPassword: '123',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/password/${user.verifyToken}`)
            .send(form2)
            .expect(400);
        expect(response.body).toMatchObject({
            confirmPassword: 'Must be greater than 4 characters.',
            passwords: 'Must be equal.',
        });
    });

    it('Should not update reset password - confirm password empty', async () => {
        const form: type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: type.UserI = await User.findById(user1._id);

        const form2: type.PasswordForm = {
            password: '12345678',
            confirmPassword: '',
        };

        const response: ResponseMSG = await request(app)
            .post(`${URL}/password/${user.verifyToken}`)
            .send(form2)
            .expect(400);
        expect(response.body).toMatchObject({
            confirmPassword: 'Must not be empty.',
            passwords: 'Must be equal.',
        });
    });

    it('Should not update reset password - expired token', async () => {
        const verifyToken = jwt.sign(
            { mode: 'password' },
            JWT_VERIFICATION_SECRET_KEY,
            {
                expiresIn: '0s',
            }
        );
        const user: type.UserI = await User.findById(user1._id);
        user.verifyToken = verifyToken;
        await user.save();

        const form: type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };
        const response: ResponseMSG = await request(app)
            .post(`${URL}/password/${verifyToken}`)
            .send(form)
            .expect(401);
        expect(response.body).toMatchObject({
            message: 'ERROR: Expired password token.',
        });
    });

    it('Should not update reset password - invalid token', async () => {
        const verifyToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2RlIjoicGFzc3dvcmQiLCJpYXQiOjE2MDQ1MDU1MTgsImV4cCI6MTYwNTExMDMxOH0.PzKZh_9JdxSiLFkUa023Cku99iSTCDgbNjSu2rzO8ac';
        const form: type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };
        const response: ResponseMSG = await request(app)
            .post(`${URL}/password/${verifyToken}`)
            .send(form)
            .expect(401);
        expect(response.body).toMatchObject({
            message: 'ERROR: Expired password token.',
        });
    });
});
