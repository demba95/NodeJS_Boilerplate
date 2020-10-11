import { RequestHandler } from 'express';
import User from '../models/user';
import sgMail from '@sendgrid/mail';
import * as auth from '../middlewares/auth';
import { validateSignUpData, validateLoginData } from '../utils/validator';
import { IUser, FormData } from '../utils/types';
import { signUpMSG } from '../utils/message';

sgMail.setApiKey(process.env.SENDGRID_KEY);

const signUpUser: RequestHandler = async (req, res) => {
    const form: FormData = req.body;

    const { valid, errors } = validateSignUpData(form);
    if (!valid) {
        return res.status(400).json(errors);
    }

    try {
        const user: IUser = await User.findOne({ email: form.email });

        if (user) {
            return res
                .status(400)
                .json({ message: 'ERROR: Email already in use.' });
        }

        delete form.confirmPassword;
        form.verifyToken = auth.createVerificationToken('email', '1d');

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
                'ERROR: Something went wrong while trying to sign up. Please try again later or contact our support.',
        });
    }
};

const loginUser: RequestHandler = async (req, res) => {
    const form: FormData = req.body;

    const { valid, errors } = validateLoginData(form);
    if (!valid) {
        return res.status(400).json(errors);
    }

    try {
        const user: IUser = await User.findOne({ email: form.email });
        if (!user) {
            return res.status(404).json({ message: 'ERROR: User not found.' });
        }

        user.comparePassword(form.password, async (_, isMatch) => {
            if (isMatch) {
                if (user.isEmailVerified) {
                    const token = await auth.createAccessToken(user);
                    return res.json({ token });
                }
                return res.status(403).json({
                    message: 'ERROR: Please verify your email first.',
                });
            }
            res.status(400).json({ message: 'ERROR: Wrong credentials' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while trying to login. Please try again later or contact our support.',
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
    loginUser,
    verifyEmail,
};
