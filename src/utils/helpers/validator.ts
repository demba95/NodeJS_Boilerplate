import * as Type from '@cTypes/types';

const PASSWORD_LENGTH = +process.env.PASSWORD_LEN!;

const isEmpty: Type.CheckFn = (str: string) => {
    if (str !== undefined && str.trim() === '') return true;
    return false;
};

export const isEmail: Type.CheckFn = (email: string) => {
    const emailRegEx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegEx)) return true;
    return false;
};

const check = (propertyName: string, data: Type.Object, length: number | undefined = undefined) => {
    if (!data.hasOwnProperty(propertyName)) return false;
    if (isEmpty(data[propertyName])) return false;
    if (length && data[propertyName].length < length) return false;
    return true;
};

const validateSignUpData: Type.ValidatorFn<Type.SignUpForm> = (data: Type.Object) => {
    const { email, password, confirmPassword } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('email', data)) errors.email = 'Must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'Must be a valid email address.';
    if (!check('firstName', data)) errors.firstName = 'Must not be empty.';
    if (!check('lastName', data)) errors.lastName = 'Must not be empty.';
    if (!check('password', data)) errors.password = 'Must not be empty.';
    if (!check('confirmPassword', data)) errors.confirmPassword = 'Must not be empty.';
    if (!check('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (!check('confirmPassword', data, PASSWORD_LENGTH))
        errors.confirmPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (
        data.hasOwnProperty('password') &&
        check('password', data, PASSWORD_LENGTH) &&
        data.hasOwnProperty('confirmPassword') &&
        check('confirmPassword', data, PASSWORD_LENGTH) &&
        password !== confirmPassword
    )
        errors.passwords = 'Must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateLoginData: Type.ValidatorFn<Type.LoginForm> = (data: Type.Object) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('email', data)) errors.email = 'Must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'Must be a valid email address.';
    if (!check('password', data)) errors.password = 'Must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUpdateData: Type.ValidatorFn<Type.UpdateUserForm> = (data: Type.Object) => {
    const { newEmail, newPassword, confirmNewPassword } = data;
    const errors: Type.ErrorContainer = {};
    let count = 0;

    if (data.hasOwnProperty('newEmail') && !check('newEmail', data)) errors.newEmail = 'Must not be empty.';
    else if (data.hasOwnProperty('newEmail') && check('newEmail', data) && !isEmail(newEmail))
        errors.newEmail = 'Must be a valid email address.';
    if (data.hasOwnProperty('firstName') && !check('firstName', data)) errors.firstName = 'Must not be empty.';
    if (data.hasOwnProperty('lastName') && !check('lastName', data)) errors.lastName = 'Must not be empty.';
    if (data.hasOwnProperty('password') && !check('password', data)) errors.password = 'Must not be empty.';
    if (data.hasOwnProperty('password') && !check('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (data.hasOwnProperty('newPassword') && !check('newPassword', data)) errors.newPassword = 'Must not be empty.';
    if (data.hasOwnProperty('newPassword') && !check('newPassword', data, PASSWORD_LENGTH))
        errors.newPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (data.hasOwnProperty('confirmNewPassword') && !check('confirmNewPassword', data))
        errors.confirmNewPassword = 'Must not be empty.';
    if (data.hasOwnProperty('confirmNewPassword') && !check('confirmNewPassword', data, PASSWORD_LENGTH))
        errors.confirmNewPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (
        data.hasOwnProperty('newPassword') &&
        check('newPassword', data, PASSWORD_LENGTH) &&
        data.hasOwnProperty('confirmNewPassword') &&
        check('confirmNewPassword', data, PASSWORD_LENGTH) &&
        newPassword !== confirmNewPassword
    )
        errors.passwords = 'Must be equal.';

    Object.keys(data).forEach(() => count++);

    if (count === 1) errors.unchanged = 'Must modify something.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validatePassword: Type.ValidatorFn<Type.PasswordForm> = (data: Type.Object) => {
    const { password, confirmPassword } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('password', data)) errors.password = 'Must not be empty.';
    if (!check('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (data.hasOwnProperty('confirmPassword') && !check('confirmPassword', data))
        errors.confirmPassword = 'Must not be empty.';
    if (data.hasOwnProperty('confirmPassword') && !check('confirmPassword', data, PASSWORD_LENGTH))
        errors.confirmPasswordLength = `Must be greater than ${PASSWORD_LENGTH} characters.`;
    if (check('password', data) && check('confirmPassword', data) && password !== confirmPassword)
        errors.passwords = 'Must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateEmail: Type.ValidatorFn<Type.EmailForm> = (data: Type.Object) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('email', data)) errors.email = 'Must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'Must be a valid email address.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export { validateSignUpData, validateLoginData, validateUpdateData, validatePassword, validateEmail };
