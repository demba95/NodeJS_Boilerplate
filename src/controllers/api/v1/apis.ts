import * as Type from '@cTypes/types';
import { isEmpty } from '@helpers/validator';
import Api from '@models/api';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';

const newApi: RequestHandler = async (req, res) => {
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

const getApis: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.body.page, 10) || 1;
        const docs = parseInt(req.body.docs, 10) || 30;
        const apisArray: Type.ApisArray[] = [];

        const apis = await Api.find({ userId: req.user!._id })
            .skip((page - 1) * docs)
            .limit(docs);

        if (!apis) return res.status(404).json({ message: 'APIs not found.' });

        apis.forEach((api) => {
            api.getKey((key, value) => {
                apisArray.push({
                    _id: api._id,
                    name: api.name,
                    active: api.active,
                    url: api.url,
                    key: key.toString(),
                    value: value.toString(),
                });
            });
        });

        res.json(apisArray);
    } catch (error) {
        console.log(error);
    }
};

const getApi: RequestHandler = async (req, res) => {
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

const updateApi: RequestHandler = async (req, res) => {
    const form: Type.UpdateApiForm = req.body;
};

const deleteApi: RequestHandler = async (req, res) => {
    const apiId: string = req.params.id!;

    if (isEmpty(apiId)) return res.status(400).json({ message: 'API Id should not be empty' });

    const deletedApi = await Api.findByIdAndDelete({ _id: apiId, userId: req.user!._id });
    console.log(deletedApi);
    if (deletedApi) return res.json({ message: 'API has been deleted successfully.' });

    return res.status(404).json({ message: 'API Id not found. Please make sure you have entered the correct API Id.' });
};

export default {
    newApi,
    getApi,
    getApis,
    updateApi,
    deleteApi,
};
