import * as Type from '@cTypes';
import mongoose from 'mongoose';

export const updateDocument: Type.UpdateDocumentFn = (document, body, permittedFields) => {
    permittedFields.forEach((key) => {
        if (body.hasOwnProperty(key)) document[key] = body[key];
    });
};

export const objectId: Type.ObjectIdFn = (id) => {
    return mongoose.Types.ObjectId(id);
};
