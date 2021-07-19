import * as Type from '@cTypes';

export const updateDocument: Type.UpdateDocumentFn = (document, body, permittedFields) => {
    permittedFields.forEach((key) => {
        if (body.hasOwnProperty(key)) document[key] = body[key];
    });
};
