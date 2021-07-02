import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import Api from '@models/api';

const newApiKey: RequestHandler = async (req, res) => {
    try {
        const api = await Api.findOne({ name: req.body.name, userId: req.user!._id });
        if (api) return res.status(400).json({ message: 'API already exists.' });

        const newApi = new Api(req.body);
        newApi.userId = mongoose.Types.ObjectId(req.user!._id);
        return res.json(await newApi.save());
    } catch (error) {
        console.log(error);
    }
};

const getApiKey: RequestHandler = async (req, res) => {
    try {
        const api = await Api.findOne({ _id: req.params.id, userId: req.user!._id });
        if (!api) return res.status(404).json({ message: 'API not found.' });

        api.getKey((key, value) => {
            return res.json({
                _id: api._id,
                name: api.name,
                active: api.active,
                url: api.url,
                key,
                value,
            });
        });
    } catch (error) {
        console.log(error);
    }
};

export default {
    newApiKey,
    getApiKey,
};
