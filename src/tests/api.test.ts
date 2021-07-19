import * as Type from '@cTypes/types';
import Api from '@models/api';
import CryptoJS from 'crypto-js';
import request from 'supertest';
import app from '~/app';
import { setupDatabase, user1, user1api1, user3api1, user4 } from './database/database';

const USER_URL = '/api/users';
const API_URL = '/api/apis';
const SECRET_KEY_BASE: string = process.env.SECRET_KEY_BASE!;

beforeEach(setupDatabase);

describe("Api's API", () => {
    it('Should create new API', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'New api',
            key: '123456789',
            value: 'asdfg',
            url: 'http://firstapi.com',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);
        expect(response2.body).toMatchObject({
            name: apiForm.name!.toLowerCase(),
            url: apiForm.url,
            active: apiForm.active,
        });
    });

    it('Should NOT create new API - api already exists', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'First Api',
            key: '123456789',
            value: 'asdfg',
            url: 'http://firstapi.com',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            message: 'API already exists.',
        });
    });

    it('Should NOT create new API - api name is empty', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: '',
            key: '123456789',
            value: 'asdfg',
            url: 'http://firstapi.com',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            name: 'API name must not be empty.',
        });
    });

    it('Should NOT create new API - api key is empty', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'First Api',
            key: '',
            value: 'asdfg',
            url: 'http://firstapi.com',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            key: 'API key must not be empty.',
        });
    });

    it('Should NOT create new API - api value is empty', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'First Api',
            key: '123456789',
            value: '',
            url: 'http://firstapi.com',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            value: 'API value must not be empty.',
        });
    });

    it('Should NOT create new API - api url is empty', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'First Api',
            key: '123456789',
            value: 'asdfg',
            url: '',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            url: 'API URL must not be empty.',
        });
    });

    it('Should NOT create new API - api active is empty', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'First Api',
            key: '123456789',
            value: 'asdfg',
            url: 'http://firstapi.com',
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            active: 'API active must not be empty.',
        });
    });

    it('Should decrypt API key and value', async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'New api',
            key: '123456789',
            value: 'asdfg',
            url: 'http://firstapi.com',
            active: true,
        };
        const response2 = await request(app)
            .post(`${API_URL}/new`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);
        const api: Type.ApiI = response2.body;
        const apiDoc: Type.ApiI | null = await Api.findById(api._id);
        const keyValue = CryptoJS.AES.decrypt(apiDoc!.key!.toString(), SECRET_KEY_BASE).toString(CryptoJS.enc.Utf8);
        const valueValue = CryptoJS.AES.decrypt(apiDoc!.value!.toString(), SECRET_KEY_BASE).toString(CryptoJS.enc.Utf8);
        expect(keyValue).toBe(apiForm!.key);
        expect(valueValue).toBe(apiForm!.value);
    });

    it("Should get user's APIs", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const response2 = await request(app).get(`${API_URL}`).set('Authorization', `Bearer ${token}`).expect(200);
        expect(response2.body).toHaveLength(2);
    });

    it("Should get user's APIs - you don't have apis", async () => {
        const userForm: Type.UserLoginForm = {
            email: user4.email,
            password: user4.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const response2 = await request(app).get(`${API_URL}`).set('Authorization', `Bearer ${token}`).expect(404);
        expect(response2.body).toMatchObject({});
    });

    it("Should get user's API", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const response2 = await request(app)
            .get(`${API_URL}/${user1api1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response2.body).toMatchObject({
            _id: user1api1._id.toString(),
            name: user1api1.name.toLowerCase(),
            active: user1api1.active,
            url: user1api1.url,
            key: user1api1.key,
            value: user1api1.value,
        });
    });

    it("Should NOT get user's API - api not found", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const response2 = await request(app)
            .get(`${API_URL}/${user3api1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(response2.body).toMatchObject({
            message: 'API not found.',
        });
    });

    it("Should update user's API", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'Api 1 Updated',
            key: 'Api 1 key Updated',
            value: 'Api 1 value Updated',
            url: 'www.rogertakeshita.com',
            active: true,
        };

        const response2 = await request(app)
            .put(`${API_URL}/${user1api1._id}`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response2.body).toMatchObject({
            message: 'API has been updated successfully.',
        });
    });

    it("Should NOT update user's API - api name already in use", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const apiForm: Type.ApiForm = {
            name: 'Second Api',
            key: 'Api 1 key Updated',
            value: 'Api 1 value Updated',
            url: 'www.rogertakeshita.com',
            active: true,
        };

        const response2 = await request(app)
            .put(`${API_URL}/${user1api1._id}`)
            .send(apiForm)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response2.body).toMatchObject({
            message: 'API name already in use, please use a different name.',
        });
    });

    it("Should delete user's API", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const response2 = await request(app)
            .delete(`${API_URL}/${user1api1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response2.body).toMatchObject({
            message: 'API has been deleted successfully.',
        });
    });

    it("Should NOT delete user's API - api id not found", async () => {
        const userForm: Type.UserLoginForm = {
            email: user1.email,
            password: user1.password,
        };
        const response1: LoginResponse = await request(app).post(`${USER_URL}/login`).send(userForm).expect(200);
        const token: string = response1.body;

        const response2 = await request(app)
            .delete(`${API_URL}/${user3api1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(response2.body).toMatchObject({
            message: 'API Id not found. Please make sure you have entered the correct id.',
        });
    });
});
