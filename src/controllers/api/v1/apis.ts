import * as Type from '@cTypes/types';
import { updateDocument } from '@helpers/updateDocument';
import * as validator from '@helpers/validator';
import Api from '@models/api';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';

const permittedFields: string[] = ['name', 'key', 'value', 'url', 'active'];

const newApi: RequestHandler = async (req, res) => {
    const form: Type.ApiForm = req.body;
    const { valid, errors } = validator.validateApi(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const api = await Api.findOne({ name: req.body.name, userId: req.user!._id });
        if (api) return res.status(400).json({ message: 'API already exists.' });

        const newApi = new Api(req.body);
        newApi.userId = mongoose.Types.ObjectId(req.user!._id);
        return res.status(201).json(await newApi.save());
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to create a new API. Please try again.',
        });
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

        if (apis.length === 0) return res.status(404).json({ message: "You don't have any APIs" });

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
        res.status(500).json({
            message: 'Something went wrong while getting your APIs. Please try again.',
        });
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
        res.status(500).json({
            message: 'Something went wrong while getting your API. Please try again.',
        });
    }
};

const updateApi: RequestHandler = async (req, res) => {
    const apiId: string = req.params.id!;
    const form: Type.ApiForm = req.body;
    const { valid, errors } = validator.validateApi(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const apiExists: Type.ApiI | null = await Api.findOne({
            name: req.body.name?.trim(),
            userId: req.user!._id,
        });
        if (apiExists && apiExists._id !== apiId)
            return res.status(400).json({ message: 'API name already in use, please use a different name.' });

        const api = await Api.findOne({ _id: apiId });
        if (!api) return res.status(404).json({ message: 'API not found.' });
        updateDocument(api, req.body, permittedFields);
        await api.save();

        res.json({ message: 'API has been updated successfully.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while updating your API. Please try again.',
        });
    }
};

const deleteApi: RequestHandler = async (req, res) => {
    const apiId: string = req.params.id!;

    try {
        const deletedApi = await Api.findOneAndDelete({ _id: apiId, userId: req.user!._id });
        if (deletedApi) return res.json({ message: 'API has been deleted successfully.' });

        return res
            .status(404)
            .json({ message: 'API Id not found. Please make sure you have entered the correct API Id.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while deleting your API. Please try again.',
        });
    }
};

export default {
    newApi,
    getApi,
    getApis,
    updateApi,
    deleteApi,
};
