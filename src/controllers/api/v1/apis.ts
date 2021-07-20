import { updateDocument } from '@cFunctions';
import * as Type from '@cTypes';
import Api from '@models/api';
import * as validate from '@validator';
import { RequestHandler } from 'express';
import { Types } from 'mongoose';

const permittedFields: string[] = ['name', 'key', 'value', 'url', 'description', 'active'];

export const newApi: RequestHandler = async (req, res) => {
    const form: Type.ApiForm = req.body;
    const { valid, errors } = validate.apiForm(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const api: Type.ApiI | null = await Api.findOne({ name: req.body.name, userId: req.user!._id });
        if (api) return res.status(400).json({ message: 'API already exists.' });

        delete form._id;
        const newApi = new Api(form);
        newApi.userId = Types.ObjectId(req.user!._id);

        res.status(201).json(await newApi.save());
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to create a new api. Please try again.',
        });
    }
};

export const getApis: RequestHandler = async (req, res) => {
    try {
        const page: number = +req.query.page! || 1;
        const docs: number = +req.query.docs! || 30;
        const apisArray: Type.ApiForm[] = [];

        const apis: Type.ApiI[] = await Api.find({ userId: req.user!._id })
            .skip((page - 1) * docs)
            .limit(docs);

        if (apis.length === 0) return res.status(404).json({ message: "You don't have any api." });

        apis.forEach((api) => {
            api.getKey!((key, value) => {
                apisArray.push({
                    _id: api!._id,
                    name: api!.name,
                    active: api!.active,
                    url: api!.url,
                    key: key!.toString(),
                    value: value!.toString(),
                    description: api!.description,
                });
            });
        });

        res.json(apisArray);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while getting your apis. Please try again.',
        });
    }
};

export const getApi: RequestHandler = async (req, res) => {
    try {
        const api: Type.ApiI | null = await Api.findOne({ _id: req.params.id, userId: req.user!._id });
        if (!api) return res.status(404).json({ message: 'API not found.' });

        api.getKey!((key, value) => {
            res.json({
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
            message: 'Something went wrong while getting your api. Please try again.',
        });
    }
};

export const updateApi: RequestHandler = async (req, res) => {
    const apiId: string = req.params.id!;
    const form: Type.ApiForm = req.body;
    const { valid, errors } = validate.apiForm(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const apiExists: Type.ApiI | null = await Api.findOne({
            name: req.body.name?.trim(),
            userId: req.user!._id,
        });
        if (apiExists && apiExists._id.toString() !== apiId)
            return res.status(400).json({ message: 'API name already in use, please use a different name.' });

        const api = await Api.findOne({ _id: apiId });
        if (!api) return res.status(404).json({ message: 'API not found.' });
        updateDocument(api, req.body, permittedFields);
        await api.save();

        res.json({ message: 'API has been updated successfully.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while updating your api. Please try again.',
        });
    }
};

export const deleteApi: RequestHandler = async (req, res) => {
    const apiId: string = req.params.id!;

    try {
        const deletedApi: Type.ApiI | null = await Api.findOneAndDelete({ _id: apiId, userId: req.user!._id });
        if (deletedApi) return res.json({ message: 'API has been deleted successfully.' });

        res.status(404).json({ message: 'API Id not found. Please make sure you have entered the correct id.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while deleting your api. Please try again.',
        });
    }
};
