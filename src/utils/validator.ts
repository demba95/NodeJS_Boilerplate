import { CheckFn, ValidatorFn, ErrorContainer } from './types';

const isEmpty: CheckFn = (string) => {
    if (!string || string.trim() === '') return true;
    return false;
};

export const isEmail: CheckFn = (email) => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegEx)) return true;
    return false;
};

const validateSignUpData: ValidatorFn = (data) => {
    const errors: ErrorContainer = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    else if (!isEmail(data.email))
        errors.email = 'Must be a valid email address';
    if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
    if (isEmpty(data.lastName)) errors.lastName = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.password && data.password.length < 4)
        errors.passwordLength = 'Must not be greater than 3 characters';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateLoginData: ValidatorFn = (data) => {
    const errors: ErrorContainer = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    else if (!isEmail(data.email))
        errors.email = 'Must be a valid email address';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUpdateData: ValidatorFn = (data) => {
    const errors: ErrorContainer = {};
    let count = 0;

    if (data.newEmail && isEmpty(data.newEmail))
        errors.lastName = 'Must not be empty';
    else if (data.newEmail && !isEmail(data.newEmail))
        errors.newEmail = 'Must be a valid email address';
    if (data.firstName && isEmpty(data.firstName))
        errors.firstName = 'Must not be empty';
    if (data.lastName && isEmpty(data.lastName))
        errors.lastName = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.newPassword && isEmpty(data.newPassword))
        errors.newPassword = 'Must not be empty';

    Object.keys(data).forEach((key) => {
        if (data[key]) count++;
    });

    if (count === 0) errors.unchanged = 'Must modify something';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validatePassword: ValidatorFn = (data) => {
    const errors: ErrorContainer = {};

    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateEmail: ValidatorFn = (data) => {
    const errors: ErrorContainer = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    else if (!isEmail(data.email))
        errors.email = 'Must be a valid email address';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export {
    validateSignUpData,
    validateLoginData,
    validateUpdateData,
    validatePassword,
    validateEmail,
};
