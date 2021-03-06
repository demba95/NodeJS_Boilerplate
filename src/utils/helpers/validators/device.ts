import * as Type from '@cTypes';
import { checkProperty } from './shared';

export const deviceForm: Type.ValidatorFn<Type.DeviceForm> = (data) => {
    const { expiresIn } = data;
    const errors: Type.Obj = {};

    if (!checkProperty('name', data)) errors.name = 'Device name must not be empty.';
    if (!checkProperty('active', data)) errors.active = 'Device status must not be empty.';
    if (data.hasOwnProperty('expiresIn') && isNaN(+expiresIn!))
        errors.expiresIn = 'Device expiration must be an integer.';
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
