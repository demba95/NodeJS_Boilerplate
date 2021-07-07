import * as Type from '@cTypes/types';

const FRONTEND_URL = process.env.FRONTEND_URL!;

const signUp = (user: Type.UserI, host: string): Type.Msg => {
    return {
        from: process.env.SENDGRID_EMAIL!,
        to: user.email,
        subject: 'Verify your email',
        html: `
                <h1>Hello ${user.firstName}</h1>
                <p>Thanks for registering on our website.</p>
                <a href="http://${host}/api/users/email/${user.verifyToken}">Click here to verify your account</a>
            `,
    };
};

const updateEmail = (user: Type.UserI, host: string): Type.Msg => {
    return {
        from: process.env.SENDGRID_EMAIL!,
        to: user.tempEmail,
        subject: 'Verify your email',
        html: `
                <h1>Hello ${user.firstName}</h1>
                <a href="http://${host}/api/users/email/${user.verifyToken}">Click here to confirm your new email</a>
            `,
    };
};

const resetPassword = (user: Type.UserI): Type.Msg => {
    return {
        from: process.env.SENDGRID_EMAIL!,
        to: user.email,
        subject: 'Reset password',
        html: `
                <h1>Hello ${user.firstName}</h1>
                We're sending you this email because you requested a password reset. Click on this link to create a new password:
                <a href="${FRONTEND_URL}/reset-password/${user.verifyToken}">Set a new password</a>
                If you didn't request a password reset, you can ignore this email. Your password will not be changed.
            `,
    };
};

const updatePassword = (user: Type.UserI): Type.Msg => {
    return {
        from: process.env.SENDGRID_EMAIL!,
        to: user.email,
        subject: 'Update password',
        html: `
                <h1>Hello ${user.firstName}</h1>
                Your password has been updated. Please login using your new credentials.
            `,
    };
};

export { signUp, updateEmail, resetPassword, updatePassword };
