import * as Type from '@cTypes';
import { checkProperty } from './shared';

export const apiForm: Type.ValidatorFn<Type.ApiForm> = (data) => {
    const errors: Type.Obj = {};

    if (!checkProperty('name', data)) errors.name = 'API name must not be empty.';
    if (!checkProperty('url', data)) errors.url = 'API URL must not be empty.';
    if (!checkProperty('key', data)) errors.key = 'API key must not be empty.';
    if (!checkProperty('value', data)) errors.value = 'API value must not be empty.';
    if (!checkProperty('active', data)) errors.active = 'API status must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
