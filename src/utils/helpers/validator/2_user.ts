import * as Type from '@cTypes/types';
import { checkProperty, isEmail } from '@validator/1_shared';

const PASSWORD_LENGTH = +process.env.PASSWORD_LEN!;

const validateUserSignUp: Type.ValidatorFn<Type.SignUpForm> = (data) => {
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
        checkProperty('password', data, PASSWORD_LENGTH) &&
        checkProperty('confirmPassword', data, PASSWORD_LENGTH) &&
        password !== confirmPassword
    )
        errors.passwords = 'Passwords must be equal.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

const validateUserLogin: Type.ValidatorFn<Type.LoginForm> = (data) => {
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

const validateUserUpdate: Type.ValidatorFn<Type.UpdateUserForm> = (data) => {
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

const validateUserPassword: Type.ValidatorFn<Type.PasswordForm> = (data) => {
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

const validateUserEmail: Type.ValidatorFn<Type.EmailForm> = (data) => {
    const { email } = data;
    const errors: Type.ErrorContainer = {};

    if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export { validateUserSignUp, validateUserLogin, validateUserUpdate, validateUserPassword, validateUserEmail };
