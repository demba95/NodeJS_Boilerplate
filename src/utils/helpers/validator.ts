import * as Type from '@cTypes/types';

const PASSWORD_LENGTH = +process.env.PASSWORD_LEN!;

const isEmpty: Type.CheckFn = (str: string) => {
    if (str === undefined || (str.length === 0 && str.trim() === '')) return true;
    return false;
};

const isEmail: Type.CheckFn = (email: string) => {
    const emailRegEx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegEx)) return true;
    return false;
};

const checkProperty: Type.CheckPropertyFn = (propertyName, data, length) => {
    if (!data.hasOwnProperty(propertyName)) return false;
    if (isEmpty(data[propertyName])) return false;
    if (length && data[propertyName].length < length) return false;
    return true;
};

const validateSignUpData: Type.ValidatorFn<Type.SignUpForm> = (data) => {
    const { email, password, confirmPassword } = data;
    const errors: Type.ErrorContainer = {};

    if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
    if (!checkProperty('firstName', data)) errors.firstName = 'First name must not be empty.';
    if (!checkProperty('lastName', data)) errors.lastName = 'Last name must not be empty.';
    if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';
    if (!checkProperty('confirmPassword', data)) errors.confirmPassword = 'Confirm password must not be empty.';
    if (!checkProperty('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (!checkProperty('confirmPassword', data, PASSWORD_LENGTH))
        errors.confirmPasswordLength = `Confirm password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (
        data.hasOwnProperty('password') &&
        checkProperty('password', data, PASSWORD_LENGTH) &&
        data.hasOwnProperty('confirmPassword') &&
        checkProperty('confirmPassword', data, PASSWORD_LENGTH) &&
        password !== confirmPassword
    )
        errors.passwords = 'Passwords must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateLoginData: Type.ValidatorFn<Type.LoginForm> = (data) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
    if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUpdateData: Type.ValidatorFn<Type.UpdateUserForm> = (data) => {
    const { email, newPassword, confirmNewPassword } = data;
    const errors: Type.ErrorContainer = {};
    let count = 0;

    if (!checkProperty('email', data)) errors.email = 'New email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'New email must be a valid email address.';
    if (data.hasOwnProperty('firstName') && !checkProperty('firstName', data))
        errors.firstName = 'First name must not be empty.';
    if (data.hasOwnProperty('lastName') && !checkProperty('lastName', data))
        errors.lastName = 'Last name must not be empty.';
    if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';
    if (!checkProperty('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (confirmNewPassword && !checkProperty('newPassword', data))
        errors.newPassword = 'New password must not be empty.';
    if (confirmNewPassword && !checkProperty('newPassword', data, PASSWORD_LENGTH))
        errors.newPasswordLength = `New password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (newPassword && !checkProperty('confirmNewPassword', data))
        errors.confirmNewPassword = 'Confirm new password must not be empty.';
    if (newPassword && !checkProperty('confirmNewPassword', data, PASSWORD_LENGTH))
        errors.confirmNewPasswordLength = `Confirm new password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (
        data.hasOwnProperty('newPassword') &&
        checkProperty('newPassword', data, PASSWORD_LENGTH) &&
        data.hasOwnProperty('confirmNewPassword') &&
        checkProperty('confirmNewPassword', data, PASSWORD_LENGTH) &&
        newPassword !== confirmNewPassword
    )
        errors.passwords = 'New passwords must be equal.';

    Object.keys(data).forEach(() => count++);

    if (count === 1) errors.unchanged = 'Must modify something.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validatePassword: Type.ValidatorFn<Type.PasswordForm> = (data) => {
    const { password, confirmPassword } = data;
    const errors: Type.ErrorContainer = {};

    if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';
    if (!checkProperty('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (data.hasOwnProperty('confirmPassword') && !checkProperty('confirmPassword', data))
        errors.confirmPassword = 'Confirm password must not be empty.';
    if (data.hasOwnProperty('confirmPassword') && !checkProperty('confirmPassword', data, PASSWORD_LENGTH))
        errors.confirmPasswordLength = `Confirm password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (checkProperty('password', data) && checkProperty('confirmPassword', data) && password !== confirmPassword)
        errors.passwords = 'Passwords must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateEmail: Type.ValidatorFn<Type.EmailForm> = (data) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateApi: Type.ValidatorFn<Type.ApiForm> = (data) => {
    const errors: Type.ErrorContainer = {};

    if (!checkProperty('name', data)) errors.name = 'API name must not be empty.';
    if (!checkProperty('key', data)) errors.key = 'API key must not be empty.';
    if (!checkProperty('value', data)) errors.value = 'API value must not be empty.';
    if (!checkProperty('url', data)) errors.url = 'API URL must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export {
    isEmpty,
    isEmail,
    validateSignUpData,
    validateLoginData,
    validateUpdateData,
    validatePassword,
    validateEmail,
    validateApi,
};
