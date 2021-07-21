import * as Type from '@cTypes';
import request from 'supertest';
import app from '~/app';
import { setupDatabase, user1, user1iot1, user1iot2, user3iot1 } from './database/database';
import { getLoginToken } from './helpers/helpers';

const IOT_URL: string = '/api/iots';

beforeEach(setupDatabase);

describe("IoT's API", () => {
    it('Should create new IoT device', async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.IoTForm = {
            name: 'New IoT Device',
            token: '',
            expiresIn: 0,
            description: 'IoT description',
            active: true,
        };
        const response = await request(app)
            .post(`${IOT_URL}/new`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);
        expect(response.body).toMatchObject({
            name: form.name!.toLowerCase(),
            expiresIn: form.expiresIn,
            description: form.description,
            active: form.active,
        });
    });

    it('Should NOT create new IoT device - device already exists', async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.IoTForm = {
            name: user1iot1.name,
            token: '',
            expiresIn: 0,
            description: 'IoT description',
            active: true,
        };
        const response = await request(app)
            .post(`${IOT_URL}/new`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response.body).toMatchObject({
            message: 'Device already exists.',
        });
    });

    it('Should NOT create new IoT device - name is empty', async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.IoTForm = {
            name: '',
            token: '',
            expiresIn: 0,
            description: 'IoT description',
            active: true,
        };
        const response = await request(app)
            .post(`${IOT_URL}/new`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response.body).toMatchObject({
            name: 'Device name must not be empty.',
        });
    });

    it("Should get user's IoT devices", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app).post(`${IOT_URL}`).set('Authorization', `Bearer ${token}`).expect(200);
        expect(response.body).toHaveLength(2);
    });

    it("Should get user's IoT device", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .get(`${IOT_URL}/${user1iot1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body).toMatchObject({
            _id: user1iot1._id.toString(),
            name: user1iot1.name.toLowerCase(),
            expiresIn: user1iot1.expiresIn,
            description: user1iot1.description,
            active: user1iot1.active,
        });
    });

    it("Should NOT get user's IoT device - device not found", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .get(`${IOT_URL}/${user3iot1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'Device not found.',
        });
    });

    it("Should update user's IoT device", async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.IoTForm = {
            name: 'IoT 1, User 1 Updated',
            token: 'random token',
            expiresIn: 3,
            description: 'IoT description, User 1 Updated',
            active: true,
        };

        const response = await request(app)
            .put(`${IOT_URL}/${user1iot1._id}`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body.data).toMatchObject({
            name: form.name.toLowerCase(),
            expiresIn: form.expiresIn,
            description: form.description,
            active: form.active,
        });
    });

    it("Should NOT update user's IoT device - device name already in use", async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.IoTForm = {
            name: user1iot2.name,
            token: 'random token',
            expiresIn: 3,
            description: 'IoT description, User 1 Updated',
            active: true,
        };

        const response = await request(app)
            .put(`${IOT_URL}/${user1iot1._id}`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response.body).toMatchObject({
            message: 'Device name already in use, please use a different name.',
        });
    });

    it("Should delete user's IoT device", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .delete(`${IOT_URL}/${user1iot1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body).toMatchObject({
            message: 'Device has been deleted successfully.',
        });
    });

    it("Should NOT delete user's IoT device - device id not found", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .delete(`${IOT_URL}/${user3iot1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'Device Id not found. Please make sure you have entered the correct id.',
        });
    });
});
