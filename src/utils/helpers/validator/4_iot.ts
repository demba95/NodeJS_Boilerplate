import * as Type from '@cTypes';
import { checkProperty } from './1_shared';

export const iotForm: Type.ValidatorFn<Type.IoTForm> = (data) => {
    const errors: Type.Obj = {};

    if (!checkProperty('name', data)) errors.name = 'Device name must not be empty.';
    if (!checkProperty('token', data)) errors.url = 'Device token must not be empty.';
    if (!checkProperty('active', data)) errors.active = 'Device status must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
