import * as type from '@custom_types/types';

const isEmpty: type.CheckFn = (string) => {
    if (!string || string.trim() === '') return true;
    return false;
};

export const isEmail: type.CheckFn = (email) => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegEx)) return true;
    return false;
};

const validateSignUpData: type.ValidatorFn = (data) => {
    const errors: type.ErrorContainer = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty.';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address.';
    }
    if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty.';
    if (isEmpty(data.lastName)) errors.lastName = 'Must not be empty.';
    if (isEmpty(data.password)) errors.password = 'Must not be empty.';
    if (isEmpty(data.confirmPassword))
        errors.confirmPassword = 'Must not be empty.';
    if (
        (data.password && data.password.length < +process.env.PASSWORD_LEN) ||
        (data.confirmPassword &&
            data.confirmPassword.length < +process.env.PASSWORD_LEN)
    ) {
        errors.passwordLength = `Must not be greater than ${process.env.PASSWORD_LEN} characters.`;
    }
    if (data.password !== data.confirmPassword)
        errors.passwords = 'Must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateLoginData: type.ValidatorFn = (data) => {
    const errors: type.ErrorContainer = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty.';
    else if (!isEmail(data.email))
        errors.email = 'Must be a valid email address.';
    if (isEmpty(data.password)) errors.password = 'Must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUpdateData: type.ValidatorFn = (data) => {
    const errors: type.ErrorContainer = {};
    let count = 0;

    if (data.newEmail && isEmpty(data.newEmail)) {
        errors.lastName = 'Must not be empty.';
    } else if (data.newEmail && !isEmail(data.newEmail)) {
        errors.newEmail = 'Must be a valid email address.';
    }
    if (data.firstName && isEmpty(data.firstName))
        errors.firstName = 'Must not be empty.';
    if (data.lastName && isEmpty(data.lastName))
        errors.lastName = 'Must not be empty.';
    if (isEmpty(data.password)) errors.password = 'Must not be empty.';
    if (data.newPassword && isEmpty(data.newPassword))
        errors.newPassword = 'Must not be empty.';
    if (data.confirmNewPassword && isEmpty(data.confirmNewPassword))
        errors.confNewPassword = 'Must not be empty.';
    if (data.newPassword !== data.confirmNewPassword)
        errors.passwords = 'Must be equal.';

    Object.keys(data).forEach((key) => {
        if (data[key]) count++;
    });

    if (count === 0) errors.unchanged = 'Must modify something.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validatePassword: type.ValidatorFn = (data) => {
    const errors: type.ErrorContainer = {};

    if (isEmpty(data.password)) errors.password = 'Must not be empty.';
    if (data.password && data.password.length < +process.env.PASSWORD_LEN)
        errors.passwordLength = `Must not be greater than ${process.env.PASSWORD_LEN} characters.`;

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateEmail: type.ValidatorFn = (data) => {
    const errors: type.ErrorContainer = {};

    if (isEmpty(data.email)) errors.email = 'Must not be empty.';
    else if (!isEmail(data.email))
        errors.email = 'Must be a valid email address.';

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
