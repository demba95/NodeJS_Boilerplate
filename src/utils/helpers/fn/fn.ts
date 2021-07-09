import * as Type from '@cTypes/types';

export const updateDocument: Type.UpdateDocumentFn = (document, body, permittedFields) => {
    permittedFields.forEach((key) => {
        if (body.hasOwnProperty(key)) document[key] = body[key];
    });
};
