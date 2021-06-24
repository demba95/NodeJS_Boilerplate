import app from '~/app';
import User from '@models/user';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import * as Type from '@cTypes/types';
import { user1, user2, setupDatabase } from './database/database';

const URL = '/api/users';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY!;
const PASSWORD_LEN = process.env.PASSWORD_LEN!;

beforeEach(setupDatabase);

describe("User's API", () => {
    it('Should sign up new user', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();
        expect(response.body).toMatchObject({
            message: 'Your account has been created. Please check your email to verify your account.',
        });
    });

    it('Should NOT sign up new user - existing user/email', async () => {
        const form: Type.SignUpForm = {
            email: user1.email,
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            message: 'Email already in use.',
        });
    });

    it('Should NOT sign up new user - empty first name', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: '',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            firstName: 'First name must not be empty.',
        });
    });

    it('Should NOT sign up new user - empty last name', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: '',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            lastName: 'Last name must not be empty.',
        });
    });

    it('Should NOT sign up new user - empty email', async () => {
        const form: Type.SignUpForm = {
            email: '',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must not be empty.',
        });
    });

    it('Should NOT sign up new user - invalid email', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must be a valid email address.',
        });
    });

    it('Should NOT sign up new user - empty password', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: '',
            confirmPassword: 'test123',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            password: 'Password must not be empty.',
            passwordLength: `Password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT sign up new user - password length', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: '12',
            confirmPassword: '12345678',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            passwordLength: `Password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT sign up new user - empty confirm password', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: '',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            confirmPassword: 'Confirm password must not be empty.',
            confirmPasswordLength: `Confirm password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT sign up new user - wrong confirm password', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123wrong',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            passwords: 'Passwords must be equal.',
        });
    });

    it('Should NOT sign up new user - empty form', async () => {
        const form: Type.SignUpForm = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/signup`).send(form).expect(400);
        expect(response.body).toMatchObject({
            firstName: 'First name must not be empty.',
            lastName: 'Last name must not be empty.',
            email: 'Email must not be empty.',
            password: 'Password must not be empty.',
            confirmPassword: 'Confirm password must not be empty.',
        });
    });

    it('Should verify account', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();

        const response = await request(app).get(`${URL}/email/${user!.verifyToken}`).expect(200);
        expect(response.body).toMatchObject({
            message: 'Thank you! Your email has been verified.',
        });
    });

    it('Should NOT verify account - empty email token', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        await User.findByIdAndDelete(user!._id);
        const response = await request(app).get(`${URL}/email/${user!.verifyToken}`).expect(404);
        expect(response.body).toMatchObject({
            message: 'Invalid email token, please reset your email and try again.',
        });
    });

    it('Should NOT verify account - empty email token', async () => {
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();

        await request(app).get(`${URL}/email/`).expect(404);
    });

    it('Should NOT verify account - invalid email token', async () => {
        const expiredVerifyToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2RlIjoiZW1haWwiLCJpYXQiOjE2MDI2ODg3MjEsImV4cCI6MTYwMzI5MzUyMX0.CWhtDg0BYoaL9sld0hwOd7U12agsXSB-7SZ6XYF9hko';
        const form: Type.SignUpForm = {
            email: 'your_email_3@test.com',
            firstName: 'Roger 3',
            lastName: 'That 3',
            password: 'test123',
            confirmPassword: 'test123',
        };

        await request(app).post(`${URL}/signup`).send(form).expect(201);
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();

        const response = await request(app).get(`${URL}/email/${expiredVerifyToken}`).expect(401);
        expect(response.body).toMatchObject({
            message: 'Expired email token.',
        });
    });

    it('Should login existing user', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const userData = <Type.UserJWT>jwt.verify(response.body, JWT_SECRET_KEY);
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        expect(user).not.toBeNull();
        expect(userData).toMatchObject({
            firstName: user1.firstName,
            lastName: user1.lastName,
        });
    });

    it('Should NOT login existing user - unverified user', async () => {
        const form: Type.LoginForm = {
            email: user2.email,
            password: user2.password,
        };

        const response: ResponseMsg = await request(app).post(`${URL}/login`).send(form).expect(403);
        expect(response.body).toMatchObject({
            message: 'Please verify your email first.',
        });
    });

    it('Should NOT login existing user - wrong password', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password + 'wrong_password',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/login`).send(form).expect(403);
        expect(response.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it('Should NOT login existing user - empty password', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: '',
        };

        const response: ResponseMsg = await request(app).post(`${URL}/login`).send(form).expect(400);
        expect(response.body).toMatchObject({
            password: 'Password must not be empty.',
        });
    });

    it('Should NOT login existing user - invalid email', async () => {
        const form: Type.LoginForm = {
            email: 'your_email_3@test',
            password: user1.password,
        };

        const response: ResponseMsg = await request(app).post(`${URL}/login`).send(form).expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must be a valid email address.',
        });
    });

    it('Should NOT login existing user - empty email', async () => {
        const form: Type.LoginForm = {
            email: '',
            password: user1.password,
        };

        const response: ResponseMsg = await request(app).post(`${URL}/login`).send(form).expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must not be empty.',
        });
    });

    it('Should NOT login existing user - email not found', async () => {
        const form: Type.LoginForm = {
            email: 'user1@notfound.com',
            password: user1.password,
        };

        const response: ResponseMsg = await request(app).post(`${URL}/login`).send(form).expect(404);
        expect(response.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it('Should NOT login existing user - invalid token', async () => {
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
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
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

    it("Should NOT fetch user's profile - user not found", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        await User.findByIdAndDelete(user1._id);
        const profile: UserProfile = await request(app)
            .get(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(profile.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it("Should NOT fetch user's profile - invalid token", async () => {
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

    it("Should NOT fetch user's profile - empty token", async () => {
        const profile: UserProfile = await request(app).get(`${URL}/profile`).send().expect(401);
        expect(profile.body).toMatchObject({
            message: 'Token not found.',
        });
    });

    it("Should update user's profile - first name", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            firstName: 'Roger Update',
            email: user1.email,
            password: user1.password,
        };
        await request(app).put(`${URL}/profile`).send(updateUser).set('Authorization', `Bearer ${token}`).expect(200);
        const user: Type.UserI | null = await User.findById({ _id: user1._id });
        expect(user).toMatchObject({
            firstName: updateUser.firstName,
        });
    });

    it("Should update user's profile - last name", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            lastName: 'That Update',
            email: user1.email,
            password: user1.password,
        };
        await request(app).put(`${URL}/profile`).send(updateUser).set('Authorization', `Bearer ${token}`).expect(200);
        const user: Type.UserI | null = await User.findById({ _id: user1._id });
        expect(user).toMatchObject({
            lastName: updateUser.lastName,
        });
    });

    it("Should update user's profile - password", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            email: user1.email,
            password: user1.password,
            newPassword: '12345678',
            confirmNewPassword: '12345678',
        };
        await request(app).put(`${URL}/profile`).send(updateUser).set('Authorization', `Bearer ${token}`).expect(200);

        const form2: Type.LoginForm = {
            email: user1.email,
            password: updateUser.newPassword,
        };
        const response2: LoginResponse = await request(app).post(`${URL}/login`).send(form2).expect(200);
        expect(typeof response2.body).toBe('string');
    });

    it("Should update user's profile - email", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            password: user1.password,
            email: 'your_email_3_update@test.com',
        };
        await request(app).put(`${URL}/profile`).send(updateUser).set('Authorization', `Bearer ${token}`).expect(200);
        const user: Type.UserI | null = await User.findById({ _id: user1._id });
        expect(user).toMatchObject({
            tempEmail: updateUser.email,
        });
    });

    it("Should NOT update user's profile - user not found", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        await User.findByIdAndDelete(user1._id);
        const updateUser = <Type.UpdateUserForm>{
            firstName: 'new name',
            email: user1.email,
            password: user1.password,
        };
        const profile: UserProfile = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(profile.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it("Should NOT update user's profile - empty password", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            firstName: 'new name',
            password: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            password: 'Password must not be empty.',
        });
    });

    it("Should NOT update user's profile - passwords length", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
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
            newPasswordLength: `New password must be greater than ${PASSWORD_LEN} characters.`,
            confirmNewPasswordLength: `Confirm new password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it("Should NOT update user's profile - empty new email", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
            password: user1.password,
            email: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            email: 'New email must not be empty.',
        });
    });

    it("Should NOT update user's profile - empty first name", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
            password: user1.password,
            firstName: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            firstName: 'First name must not be empty.',
        });
    });

    it("Should NOT update user's profile - empty last name", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
            password: user1.password,
            lastName: '',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            lastName: 'Last name must not be empty.',
        });
    });

    it("Should NOT update user's profile - empty new password", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
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
            newPassword: 'New password must not be empty.',
            newPasswordLength: `New password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it("Should NOT update user's profile - empty confirm new password", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
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
            confirmNewPassword: 'Confirm new password must not be empty.',
            confirmNewPasswordLength: `Confirm new password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it("Should NOT update user's profile - passwords not equal", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
            password: user1.password,
            newPassword: '12345678',
            confirmNewPassword: '123456789',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            passwords: 'New passwords must be equal.',
        });
    });

    it("Should NOT update user's profile - unchanged fields", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser2 = <Type.UpdateUserForm>{
            password: user1.password,
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser2)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            unchanged: 'Must modify something.',
        });
    });

    it("Should NOT update user's email - invalid new email", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            password: user1.password,
            email: 'roger@',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            email: 'New email must be a valid email address.',
        });
    });

    it("Should NOT update user's email - email already in use", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            password: user1.password,
            email: user2.email,
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            message: `Email (${user2.email}) is already in use.`,
        });
    });

    it("Should NOT update user's profile - wrong credentials", async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const updateUser = <Type.UpdateUserForm>{
            password: user1.password + 'wrong_password',
            email: 'new_email@email.com',
        };
        const response2 = await request(app)
            .put(`${URL}/profile`)
            .send(updateUser)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        expect(response2.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it('Should delete user/profile', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
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

    it('Should NOT delete user/profile - user not found', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        await User.findByIdAndDelete(user1._id);
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password })
            .expect(404);
        expect(response2.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it('Should NOT delete user/profile - invalid token', async () => {
        const form: Type.LoginForm = {
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

    it('Should NOT delete user/profile - invalid password', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password + 'wrong_password' })
            .expect(403);
        expect(response2.body).toMatchObject({
            message: 'Wrong password.',
        });
    });

    it('Should NOT delete user/profile - empty password', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: '' })
            .expect(400);
        expect(response2.body).toMatchObject({
            password: 'Password must not be empty.',
            passwordLength: `Password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT delete user/profile - invalid password length', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: '123' })
            .expect(400);
        expect(response2.body).toMatchObject({
            passwordLength: `Password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT delete user/profile - invalid password', async () => {
        const form: Type.LoginForm = {
            email: user1.email,
            password: user1.password,
        };

        const response: LoginResponse = await request(app).post(`${URL}/login`).send(form).expect(200);
        const token: string = response.body;
        const response2: UserProfile = await request(app)
            .delete(`${URL}/profile`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: form.password + 'wrong_password' })
            .expect(403);
        expect(response2.body).toMatchObject({
            message: 'Wrong password.',
        });
    });

    it('Should NOT resend email verification - empty email', async () => {
        const response: UserProfile = await request(app).post(`${URL}/email`).send({ email: '' }).expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must not be empty.',
        });
    });

    it('Should NOT resend email verification - invalid email', async () => {
        const response: UserProfile = await request(app)
            .post(`${URL}/email`)
            .send({ email: 'invalid_email@email' })
            .expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must be a valid email address.',
        });
    });

    it('Should NOT resend email verification - email not found', async () => {
        const response: UserProfile = await request(app)
            .post(`${URL}/email`)
            .send({ email: 'not_found@email.com' })
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'Email not found.',
        });
    });

    it('Should NOT resend email verification - email already verified', async () => {
        const response: UserProfile = await request(app).post(`${URL}/email`).send({ email: user1.email }).expect(200);
        expect(response.body).toMatchObject({
            message: 'Your account is already verified.',
        });
    });

    it('Should reset password', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        const response: LoginResponse = await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);
        expect(user!.verifyToken).not.toBeNull();
        expect(response.body).toMatchObject({
            message: 'Please check your email to reset your password.',
        });
    });

    it('Should NOT reset password - not found email', async () => {
        const form: Type.EmailForm = {
            email: 'not_found' + user1.email,
        };

        const response: LoginResponse = await request(app).post(`${URL}/password`).send(form).expect(404);
        expect(response.body).toMatchObject({
            message: 'Email not found.',
        });
    });

    it('Should NOT reset password - invalid email', async () => {
        const form: Type.EmailForm = {
            email: 'invalid@email',
        };

        const response: LoginResponse = await request(app).post(`${URL}/password`).send(form).expect(400);
        expect(response.body).toMatchObject({
            email: 'Email must be a valid email address.',
        });
    });

    it('Should update reset password', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);

        const form2: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };

        const response2: ResponseMsg = await request(app)
            .post(`${URL}/password/${user!.verifyToken}`)
            .send(form2)
            .expect(200);
        expect(response2.body).toMatchObject({
            message: 'Password updated successfully.',
        });

        const userReq2: Type.UserI | null = await User.findById(user1._id);
        userReq2!.comparePassword(form2.password, (_: any, matchPassword: boolean) => {
            if (matchPassword) {
                expect(matchPassword).toBeTruthy();
            }
        });
        expect(response2.body).toMatchObject({
            message: 'Password updated successfully.',
        });
    });

    it('Should NOT update reset password - user not found', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);

        const form2: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };

        await User.findByIdAndDelete(user1._id);
        const response2: ResponseMsg = await request(app)
            .post(`${URL}/password/${user!.verifyToken}`)
            .send(form2)
            .expect(404);
        expect(response2.body).toMatchObject({
            message: 'Wrong credentials.',
        });
    });

    it('Should NOT update reset password - password empty', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);

        const form2: Type.PasswordForm = {
            password: '',
            confirmPassword: '12345678',
        };

        const response: ResponseMsg = await request(app)
            .post(`${URL}/password/${user!.verifyToken}`)
            .send(form2)
            .expect(400);
        expect(response.body).toMatchObject({
            password: 'Password must not be empty.',
            passwordLength: `Password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT update reset password - confirm password empty', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);

        const form2: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '',
        };

        const response: ResponseMsg = await request(app)
            .post(`${URL}/password/${user!.verifyToken}`)
            .send(form2)
            .expect(400);
        expect(response.body).toMatchObject({
            confirmPassword: 'Confirm password must not be empty.',
            confirmPasswordLength: `Confirm password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT update reset password - confirm password length', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);

        const form2: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '123',
        };

        const response: ResponseMsg = await request(app)
            .post(`${URL}/password/${user!.verifyToken}`)
            .send(form2)
            .expect(400);
        expect(response.body).toMatchObject({
            confirmPasswordLength: `Confirm password must be greater than ${PASSWORD_LEN} characters.`,
        });
    });

    it('Should NOT update reset password - different passwords', async () => {
        const form: Type.EmailForm = {
            email: user1.email,
        };

        await request(app).post(`${URL}/password`).send(form).expect(200);
        const user: Type.UserI | null = await User.findById(user1._id);

        const form2: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '1234',
        };

        const response: ResponseMsg = await request(app)
            .post(`${URL}/password/${user!.verifyToken}`)
            .send(form2)
            .expect(400);
        expect(response.body).toMatchObject({
            passwords: 'Passwords must be equal.',
        });
    });

    it('Should NOT update reset password - expired token', async () => {
        const verifyToken = jwt.sign({ mode: 'password' }, JWT_VERIFICATION_SECRET_KEY, {
            expiresIn: '0s',
        });
        const user: Type.UserI | null = await User.findById(user1._id);
        user!.verifyToken = verifyToken;
        await user!.save();

        const form: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };
        const response: ResponseMsg = await request(app).post(`${URL}/password/${verifyToken}`).send(form).expect(401);
        expect(response.body).toMatchObject({
            message: 'Expired password token.',
        });
    });

    it('Should NOT update reset password - invalid token', async () => {
        const verifyToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2RlIjoicGFzc3dvcmQiLCJpYXQiOjE2MDQ1MDU1MTgsImV4cCI6MTYwNTExMDMxOH0.PzKZh_9JdxSiLFkUa023Cku99iSTCDgbNjSu2rzO8ac';
        const form: Type.PasswordForm = {
            password: '12345678',
            confirmPassword: '12345678',
        };
        const response: ResponseMsg = await request(app).post(`${URL}/password/${verifyToken}`).send(form).expect(401);
        expect(response.body).toMatchObject({
            message: 'Expired password token.',
        });
    });
});
