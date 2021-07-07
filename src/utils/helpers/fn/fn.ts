import * as Type from '@cTypes/types';

export const updateDocument: Type.UpdateDocumentFn = (document, body, permit) => {
    permit.forEach((key) => {
        if (body.hasOwnProperty(key)) document[key] = body[key];
    });
};
