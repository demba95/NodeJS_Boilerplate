import { Obj } from '@cTypes';

export type CheckFn<T> = {
    (value: T): boolean;
};

export type CheckPropertyFn = {
    (propertyName: string, data: Obj, length?: number | undefined): boolean;
};

export type ValidatorFn<T> = {
    (data: T): {
        errors: Obj;
        valid: boolean;
    };
};
