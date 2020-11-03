import * as type from '@custom_types/types';

const PASSWORD_LENGTH = +process.env.PASSWORD_LEN;

const isEmpty: type.CheckFn = (string) => {
    if (!string || string.trim() === '' || string === '') return true;
    return false;
};

export const isEmail: type.CheckFn = (email) => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegEx)) return true;
    return false;
};

const validateSignUpData: type.ValidatorFn<type.SignUpForm> = (data) => {
    const { email, firstName, lastName, password, confirmPassword } = data;
    const errors: type.ErrorContainer = {};

    if (isEmpty(email)) {
        errors.email = 'Must not be empty.';
    } else if (!isEmail(email)) {
        errors.email = 'Must be a valid email address.';
    }
    if (isEmpty(firstName)) errors.firstName = 'Must not be empty.';
    if (isEmpty(lastName)) errors.lastName = 'Must not be empty.';
    if (isEmpty(password)) errors.password = 'Must not be empty.';
    if (isEmpty(confirmPassword)) errors.confirmPassword = 'Must not be empty.';
    if (
        (password && password.length < PASSWORD_LENGTH) ||
        (confirmPassword && confirmPassword.length < PASSWORD_LENGTH)
    ) {
        errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    }
    if (password !== confirmPassword) errors.passwords = 'Must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateLoginData: type.ValidatorFn<type.LoginForm> = (data) => {
    const { email, password } = data;
    const errors: type.ErrorContainer = {};

    if (isEmpty(email)) errors.email = 'Must not be empty.';
    else if (!isEmail(email)) errors.email = 'Must be a valid email address.';
    if (isEmpty(password)) errors.password = 'Must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUpdateData: type.ValidatorFn<type.UpdateUserForm> = (data) => {
    const {
        newEmail,
        firstName,
        lastName,
        password,
        newPassword,
        confirmNewPassword,
    } = data;
    const errors: type.ErrorContainer = {};
    let count = 0;

    if (data.hasOwnProperty('newEmail') && isEmpty(newEmail)) {
        errors.newEmail = 'Must not be empty.';
    } else if (newEmail && !isEmail(newEmail)) {
        errors.newEmail = 'Must be a valid email address.';
    }
    if (data.hasOwnProperty('firstName') && isEmpty(firstName))
        errors.firstName = 'Must not be empty.';
    if (data.hasOwnProperty('lastName') && isEmpty(lastName))
        errors.lastName = 'Must not be empty.';
    if (isEmpty(password)) errors.password = 'Must not be empty.';
    if (data.hasOwnProperty('newPassword') && isEmpty(newPassword))
        errors.newPassword = 'Must not be empty.';
    if (
        data.hasOwnProperty('confirmNewPassword') &&
        isEmpty(confirmNewPassword)
    )
        errors.confirmNewPassword = 'Must not be empty.';
    if (
        (data.hasOwnProperty('newPassword') &&
            newPassword.length < PASSWORD_LENGTH) ||
        (data.hasOwnProperty('confirmNewPassword') &&
            confirmNewPassword.length < PASSWORD_LENGTH)
    ) {
        errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    }
    if (newPassword !== confirmNewPassword) errors.passwords = 'Must be equal.';

    Object.keys(data).forEach((key) => {
        if (data[key]) count++;
    });

    if (count === 1) errors.unchanged = 'Must modify something.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validatePassword: type.ValidatorFn<type.PasswordForm> = (data) => {
    const { password, confirmPassword } = data;
    const errors: type.ErrorContainer = {};

    if (isEmpty(password)) {
        errors.password = 'Must not be empty.';
    } else if (password.length < PASSWORD_LENGTH) {
        errors.password = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    }
    if (data.hasOwnProperty('confirmPassword') && isEmpty(confirmPassword)) {
        errors.confirmPassword = 'Must not be empty.';
    } else if (
        password.length < PASSWORD_LENGTH ||
        (data.hasOwnProperty('confirmPassword') &&
            confirmPassword &&
            confirmPassword.length < PASSWORD_LENGTH)
    ) {
        errors.confirmPassword = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    }
    if (
        data.hasOwnProperty('confirmPassword') &&
        password !== confirmPassword
    ) {
        errors.passwords = 'Must be equal.';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateEmail: type.ValidatorFn<type.EmailForm> = (data) => {
    const { email } = data;
    const errors: type.ErrorContainer = {};

    if (data.hasOwnProperty('email') && isEmpty(email)) {
        errors.email = 'Must not be empty.';
    } else if (data.hasOwnProperty('email') && !isEmail(email)) {
        errors.email = 'Must be a valid email address.';
    }

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
