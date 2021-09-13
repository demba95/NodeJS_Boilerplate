import * as Type from '@cTypes';
import { checkProperty, isEmail } from './shared';

const PASSWORD_LENGTH: number = +process.env.PASSWORD_LEN!;

export const userSignUpForm: Type.ValidatorFn<Type.UserSignUpForm> = (data) => {
    const { email, password, confirmPassword } = data;
    const errors: Type.Obj = {};

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

export const userLoginForm: Type.ValidatorFn<Type.UserLoginForm> = (data) => {
    const { email } = data;
    const errors: Type.Obj = {};

    if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';
    if (!checkProperty('password', data)) errors.password = 'Password must not be empty.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export const userProfileForm: Type.ValidatorFn<Type.UserProfileForm> = (data) => {
    const { email, newPassword, confirmNewPassword } = data;
    const errors: Type.Obj = {};
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

export const userPasswordForm: Type.ValidatorFn<Type.UserPasswordForm> = (data) => {
    const { password, confirmPassword } = data;
    const errors: Type.Obj = {};

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

export const userEmailForm: Type.ValidatorFn<Type.UserEmailForm> = (data) => {
    const { email } = data;
    const errors: Type.Obj = {};

    if (!checkProperty('email', data)) errors.email = 'Email must not be empty.';
    else if (checkProperty('email', data) && !isEmail(email)) errors.email = 'Email must be a valid email address.';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
