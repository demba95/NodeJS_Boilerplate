import * as Type from '@cTypes';
import request from 'supertest';
import app from '~/app';
import * as TestType from '../__mocks__/@types/types';

const USER_URL: string = '/api/user';

export const getLoginToken: TestType.GetLoginTokenFn = async (user) => {
    const userForm: Type.UserLoginForm = {
        email: user.email!,
        password: user.password!,
    };
    const response1: TestType.LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
    const token: string = response1.body;
    return token;
};
