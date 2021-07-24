import * as auth from '@auth';
import { updateDocument } from '@cFunctions';
import * as Type from '@cTypes';
import Device from '@models/device';
import * as validate from '@validator';
import { RequestHandler } from 'express';

const JWT_DEVICE_SECRET_KEY: string = process.env.JWT_DEVICE_SECRET_KEY!;
const permittedFields: string[] = ['name', 'expiresIn', 'description', 'active'];

export const newDevice: RequestHandler = async (req, res) => {
    const form: Type.DeviceForm = req.body;
    const { valid, errors } = validate.DeviceForm(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const device: Type.DeviceI = await Device.findOne({ name: req.body.name, userId: req.user!._id });
        if (device) return res.status(400).json({ message: 'Device already exists.' });

        delete form._id;
        const newDevice = new Device(form);
        const days: number = +form.expiresIn || 0;
        newDevice.token = auth.createCustomToken(
            'device',
            { _id: newDevice._id, userId: req.user!._id },
            JWT_DEVICE_SECRET_KEY,
            days
        );
        newDevice.userId = req.user!._id;

        res.status(201).json(await newDevice.save());
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to create a new device. Please try again.',
        });
    }
};

export const getDevices: RequestHandler = async (req, res) => {
    try {
        const page: number = +req.body.page! || 1;
        const docs: number = +req.body.docs! || 30;

        const devices: Type.DeviceI[] = await Device.find({ userId: req.user!._id })
            .skip((page - 1) * docs)
            .limit(docs);

        res.json(devices);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while getting your devices. Please try again.',
        });
    }
};

export const getDevice: RequestHandler = async (req, res) => {
    try {
        const device: Type.DeviceI = await Device.findOne({ _id: req.params.id, userId: req.user!._id });
        if (!device) return res.status(404).json({ message: 'Device not found.' });

        res.json(device);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while getting your device. Please try again.',
        });
    }
};

export const updateDevice: RequestHandler = async (req, res) => {
    const iotId: string = req.params.id!;
    const form: Type.DeviceForm = req.body;
    const { valid, errors } = validate.DeviceForm(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const deviceExists: Type.DeviceI = await Device.findOne({
            name: req.body.name!.trim(),
            userId: req.user!._id,
        });
        if (deviceExists && deviceExists._id.toString() !== iotId)
            return res.status(400).json({ message: 'Device name already in use, please use a different name.' });

        const device = await Device.findById(iotId);
        if (!device) return res.status(404).json({ message: 'Device not found.' });
        if (form.hasOwnProperty('expiresIn') && +form.expiresIn !== +device.expiresIn)
            device.token = auth.createCustomToken(
                'device',
                { _id: device._id, userId: req.user!._id },
                JWT_DEVICE_SECRET_KEY,
                +form.expiresIn
            );
        updateDocument(device, req.body, permittedFields);
        await device.save();

        res.json({ message: 'Device has been updated successfully.', data: device });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while updating your device. Please try again.',
        });
    }
};

export const deleteDevice: RequestHandler = async (req, res) => {
    const iotId: string = req.params.id!;

    try {
        const deletedIoT: Type.DeviceI = await Device.findOneAndDelete({ _id: iotId, userId: req.user!._id });
        if (deletedIoT) return res.json({ message: 'Device has been deleted successfully.' });

        res.status(404).json({ message: 'Device Id not found. Please make sure you have entered the correct id.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while deleting your device. Please try again.',
        });
    }
};
