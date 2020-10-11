import { RequestHandler } from 'express';
import User from '../models/user';
import sgMail from '@sendgrid/mail';
import { createVerificationToken } from '../middlewares/auth';
import isEmail from 'validator/lib/isEmail';
import { SignUpForm, LoginForm, IUser } from '../utils/types';
import { signUpMSG } from '../utils/message';

sgMail.setApiKey(process.env.SENDGRID_KEY);

const signUpUser: RequestHandler = async (req, res) => {
    const form: SignUpForm = req.body;

    if (
        !(
            form.firstName ||
            form.lastName ||
            isEmail(form.email) ||
            form.password.length < 3
        )
    ) {
        return res.status(400).json('Invalid credentials.');
    }

    try {
        const user = await User.findOne({ email: form.email });

        if (user) {
            return res
                .status(400)
                .json({ message: 'ERROR: Email already in use.' });
        }

        delete form.confirmPassword;
        form.verifyToken = createVerificationToken('email', '1d');

        const newUser: any = new User(form);
        await newUser.save();

        try {
            const msg = signUpMSG(newUser, req.headers.host);
            await sgMail.send(msg);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong sending you the email verification. Please try again later.',
            });
        }

        res.status(201).json({
            message:
                'Your account has been created. Please check your email to verify your account.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'Something went wrong with your sign up. Please try again later or contact our support.',
        });
    }
};

const verifyEmail: RequestHandler = async (req, res) => {
    try {
        const user: IUser = await User.findOne({
            verifyToken: req.params.verifyToken,
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: 'ERROR: Invalid email token.' });
        }

        user.verifyToken = null;
        user.isEmailVerified = true;
        await user.save();

        res.json({ message: 'Thank you! Your email has been verified.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong verifying your account. Please try again later.',
        });
    }
};

export default {
    signUpUser,
    verifyEmail,
};
