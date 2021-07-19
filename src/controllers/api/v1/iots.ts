import { updateDocument } from '@cFunctions';
import * as Type from '@cTypes';
import IoT from '@models/iot';
import * as validate from '@validator';
import { RequestHandler } from 'express';
import { Types } from 'mongoose';

const permittedFields: string[] = ['name', 'key', 'value', 'url', 'description', 'active'];

const newIoT: RequestHandler = async (req, res) => {
    const form: Type.IoTForm = req.body;
    const { valid, errors } = validate.iotForm(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const iot: Type.IoTI | null = await IoT.findOne({ name: req.body.name, userId: req.user!._id });
        if (iot) return res.status(400).json({ message: 'Device already exists.' });

        delete form._id;
        const newIoT = new IoT(form);
        newIoT.userId = Types.ObjectId(req.user!._id);

        res.status(201).json(await newIoT.save());
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to create a new device. Please try again.',
        });
    }
};

const getIoTs: RequestHandler = async (req, res) => {
    try {
        const page: number = parseInt(req.body.page, 10) || 1;
        const docs: number = parseInt(req.body.docs, 10) || 30;
        const iotsArray: Type.IoTForm[] = [];

        const iots: Type.IoTI[] = await IoT.find({ userId: req.user!._id })
            .skip((page - 1) * docs)
            .limit(docs);

        if (iots.length === 0) return res.status(404).json({ message: "You don't have any device" });

        res.json(iotsArray);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while getting your devices. Please try again.',
        });
    }
};

const getIoT: RequestHandler = async (req, res) => {
    try {
        const iot: Type.IoTI | null = await IoT.findOne({ _id: req.params.id, userId: req.user!._id });
        if (!iot) return res.status(404).json({ message: 'Device not found.' });

        res.json(iot);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while getting your device. Please try again.',
        });
    }
};

const updateIoT: RequestHandler = async (req, res) => {
    const iotId: string = req.params.id!;
    const form: Type.IoTForm = req.body;
    const { valid, errors } = validate.iotForm(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const iotExists: Type.IoTI | null = await IoT.findOne({
            name: req.body.name?.trim(),
            userId: req.user!._id,
        });
        if (iotExists && iotExists._id.toString() !== iotId)
            return res.status(400).json({ message: 'Device name already in use, please use a different name.' });

        const iot = await IoT.findOne({ _id: iotId });
        if (!iot) return res.status(404).json({ message: 'Device not found.' });
        updateDocument(iot, req.body, permittedFields);
        await iot.save();

        res.json({ message: 'Device has been updated successfully.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while updating your device. Please try again.',
        });
    }
};

const deleteIoT: RequestHandler = async (req, res) => {
    const iotId: string = req.params.id!;

    try {
        const deletedIoT: Type.IoTI | null = await IoT.findOneAndDelete({ _id: iotId, userId: req.user!._id });
        if (deletedIoT) return res.json({ message: 'Device has been deleted successfully.' });

        res.status(404).json({ message: 'Device Id not found. Please make sure you have entered the correct id.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while deleting your device. Please try again.',
        });
    }
};

export default {
    newIoT,
    getIoT,
    getIoTs,
    updateIoT,
    deleteIoT,
};
