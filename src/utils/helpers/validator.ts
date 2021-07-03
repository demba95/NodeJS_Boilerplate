import * as Type from '@cTypes/types';

const PASSWORD_LENGTH = +process.env.PASSWORD_LEN!;

const isEmpty: Type.CheckFn = (str: string) => {
    if (str !== undefined && str.trim() === '') return true;
    return false;
};

const isEmail: Type.CheckFn = (email: string) => {
    const emailRegEx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(emailRegEx)) return true;
    return false;
};

const check = (propertyName: string, data: Type.Obj, length: number | undefined = undefined) => {
    if (!data.hasOwnProperty(propertyName)) return false;
    if (isEmpty(data[propertyName])) return false;
    if (length && data[propertyName].length < length) return false;
    return true;
};

const validateSignUpData: Type.ValidatorFn<Type.SignUpForm> = (data: Type.Obj) => {
    const { email, password, confirmPassword } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('email', data)) errors.email = 'Email must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
    if (!check('firstName', data)) errors.firstName = 'First name must not be empty.';
    if (!check('lastName', data)) errors.lastName = 'Last name must not be empty.';
    if (!check('password', data)) errors.password = 'Password must not be empty.';
    if (!check('confirmPassword', data)) errors.confirmPassword = 'Confirm password must not be empty.';
    if (!check('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (!check('confirmPassword', data, PASSWORD_LENGTH))
        errors.confirmPasswordLength = `Confirm password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (
        data.hasOwnProperty('password') &&
        check('password', data, PASSWORD_LENGTH) &&
        data.hasOwnProperty('confirmPassword') &&
        check('confirmPassword', data, PASSWORD_LENGTH) &&
        password !== confirmPassword
    )
        errors.passwords = 'Passwords must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateLoginData: Type.ValidatorFn<Type.LoginForm> = (data: Type.Obj) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('email', data)) errors.email = 'Email must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
    if (!check('password', data)) errors.password = 'Password must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUpdateData: Type.ValidatorFn<Type.UpdateUserForm> = (data: Type.Obj) => {
    const { email, newPassword, confirmNewPassword } = data;
    const errors: Type.ErrorContainer = {};
    let count = 0;

    if (!check('email', data)) errors.email = 'New email must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'New email must be a valid email address.';
    if (data.hasOwnProperty('firstName') && !check('firstName', data))
        errors.firstName = 'First name must not be empty.';
    if (data.hasOwnProperty('lastName') && !check('lastName', data)) errors.lastName = 'Last name must not be empty.';
    if (!check('password', data)) errors.password = 'Password must not be empty.';
    if (!check('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (confirmNewPassword && !check('newPassword', data)) errors.newPassword = 'New password must not be empty.';
    if (confirmNewPassword && !check('newPassword', data, PASSWORD_LENGTH))
        errors.newPasswordLength = `New password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (newPassword && !check('confirmNewPassword', data))
        errors.confirmNewPassword = 'Confirm new password must not be empty.';
    if (newPassword && !check('confirmNewPassword', data, PASSWORD_LENGTH))
        errors.confirmNewPasswordLength = `Confirm new password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (
        data.hasOwnProperty('newPassword') &&
        check('newPassword', data, PASSWORD_LENGTH) &&
        data.hasOwnProperty('confirmNewPassword') &&
        check('confirmNewPassword', data, PASSWORD_LENGTH) &&
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

const validatePassword: Type.ValidatorFn<Type.PasswordForm> = (data: Type.Obj) => {
    const { password, confirmPassword } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('password', data)) errors.password = 'Password must not be empty.';
    if (!check('password', data, PASSWORD_LENGTH))
        errors.passwordLength = `Password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (data.hasOwnProperty('confirmPassword') && !check('confirmPassword', data))
        errors.confirmPassword = 'Confirm password must not be empty.';
    if (data.hasOwnProperty('confirmPassword') && !check('confirmPassword', data, PASSWORD_LENGTH))
        errors.confirmPasswordLength = `Confirm password must be greater than ${PASSWORD_LENGTH} characters.`;
    if (check('password', data) && check('confirmPassword', data) && password !== confirmPassword)
        errors.passwords = 'Passwords must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateEmail: Type.ValidatorFn<Type.EmailForm> = (data: Type.Obj) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!check('email', data)) errors.email = 'Email must not be empty.';
    else if (check('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export { isEmpty, isEmail, validateSignUpData, validateLoginData, validateUpdateData, validatePassword, validateEmail };
