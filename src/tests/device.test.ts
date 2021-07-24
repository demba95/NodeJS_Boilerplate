import * as Type from '@cTypes';
import request from 'supertest';
import app from '~/app';
import { setupDatabase, user1, user1device1, user1device2, user3device1 } from './database/database';
import { getLoginToken } from './helpers/helpers';

const DEVICE_URL: string = '/api/devices';

beforeEach(setupDatabase);

describe("Device's API", () => {
    it('Should create new device', async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.DeviceForm = {
            name: 'New Device',
            token: '',
            expiresIn: 0,
            description: 'Device description',
            active: true,
            notify: true,
        };
        const response = await request(app)
            .post(`${DEVICE_URL}/new`)
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

    it('Should NOT create new device - device already exists', async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.DeviceForm = {
            name: user1device1.name,
            token: '',
            expiresIn: 0,
            description: 'Device description',
            active: true,
            notify: true,
        };
        const response = await request(app)
            .post(`${DEVICE_URL}/new`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response.body).toMatchObject({
            message: 'Device already exists.',
        });
    });

    it('Should NOT create new device - name is empty', async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.DeviceForm = {
            name: '',
            token: '',
            expiresIn: 0,
            description: 'Device description',
            active: true,
            notify: true,
        };
        const response = await request(app)
            .post(`${DEVICE_URL}/new`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response.body).toMatchObject({
            name: 'Device name must not be empty.',
        });
    });

    it("Should get user's devices", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app).post(`${DEVICE_URL}`).set('Authorization', `Bearer ${token}`).expect(200);
        expect(response.body).toHaveLength(2);
    });

    it("Should get user's device", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .get(`${DEVICE_URL}/${user1device1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body).toMatchObject({
            _id: user1device1._id.toString(),
            name: user1device1.name.toLowerCase(),
            expiresIn: user1device1.expiresIn,
            description: user1device1.description,
            active: user1device1.active,
        });
    });

    it("Should NOT get user's device - device not found", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .get(`${DEVICE_URL}/${user3device1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'Device not found.',
        });
    });

    it("Should update user's device", async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.DeviceForm = {
            name: 'Device 1, User 1 Updated',
            token: 'random token',
            expiresIn: 3,
            description: 'Device description, User 1 Updated',
            active: true,
            notify: true,
        };

        const response = await request(app)
            .put(`${DEVICE_URL}/${user1device1._id}`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body.data).toMatchObject({
            name: form.name!.toLowerCase(),
            expiresIn: form.expiresIn,
            description: form.description,
            active: form.active,
        });
    });

    it("Should NOT update user's device - device name already in use", async () => {
        const token: string = await getLoginToken(user1);
        const form: Type.DeviceForm = {
            name: user1device2.name,
            token: 'random token',
            expiresIn: 3,
            description: 'Device description, User 1 Updated',
            active: true,
            notify: true,
        };

        const response = await request(app)
            .put(`${DEVICE_URL}/${user1device1._id}`)
            .send(form)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
        expect(response.body).toMatchObject({
            message: 'Device name already in use, please use a different name.',
        });
    });

    it("Should delete user's device", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .delete(`${DEVICE_URL}/${user1device1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body).toMatchObject({
            message: 'Device has been deleted successfully.',
        });
    });

    it("Should NOT delete user's device - device id not found", async () => {
        const token: string = await getLoginToken(user1);
        const response = await request(app)
            .delete(`${DEVICE_URL}/${user3device1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(response.body).toMatchObject({
            message: 'Device Id not found. Please make sure you have entered the correct id.',
        });
    });
});
