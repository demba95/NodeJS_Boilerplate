import { SignUpMSGFn } from './types';

export const signUpMSG: SignUpMSGFn = (user, host) => {
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
