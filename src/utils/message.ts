import * as type from './types';

export const signUp: type.MSGFn = (user, host) => {
    return {
        from: process.env.SENDGRID_EMAIL,
        to: user.email,
        subject: 'Verify your email',
        html: `
                <h1>Hello ${user.firstName}</h1>
                <p>Thanks for registering on our website.</p>
                <a href="http://${host}/users/verify-email/${user.verifyToken}">Click here to verify your account</a>
            `,
    };
};

export const updateEmail: type.MSGFn = (user, host) => {
    return {
        from: process.env.SENDGRID_EMAIL,
        to: user.tempEmail,
        subject: 'Verify your email',
        html: `
                <h1>Hello ${user.firstName}</h1>
                <a href="http://${host}/users/verify-email/${user.verifyToken}">Click here to confirm your new email</a>
            `,
    };
};
