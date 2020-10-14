import { RequestHandler } from 'express';
import User from '@models/user';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import * as auth from '@middlewares/auth';
import * as validator from '@utils/validator';
import * as MSG from '@utils/message';
import * as type from '@custom_types/types';

const JWT_VERIFICATION_EXPIRES_IN = process.env.JWT_VERIFICATION_EXPIRES_IN;

sgMail.setApiKey(process.env.SENDGRID_KEY);

const signUpUser: RequestHandler = async (req, res) => {
    const form: type.FormData = req.body;

    const { valid, errors } = validator.validateSignUpData(form);
    if (!valid) {
        return res.status(400).json(errors);
    }

    try {
        const user: type.UserI = await User.findOne({ email: form.email });

        if (user) {
            return res
                .status(400)
                .json({ message: 'ERROR: Email already in use.' });
        }

        delete form.confirmPassword;
        form.verifyToken = auth.createVerificationToken('email');
        const newUser: any = new User(form);
        await newUser.save();

        try {
            const msg = MSG.signUp(newUser, req.headers.host);
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
    const form: type.FormData = req.body;

    const { valid, errors } = validator.validateLoginData(form);
    if (!valid) {
        return res.status(400).json(errors);
    }

    try {
        const user: type.UserI = await User.findOne({ email: form.email });
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

            res.status(403).json({ message: 'ERROR: Wrong credentials.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while trying to login. Please try again later or contact our support.',
        });
    }
};

const getUser: RequestHandler = async (req, res) => {
    try {
        const user: type.UserI = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({ message: 'ERROR: User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while trying to get profile. Please try again later or contact our support.',
        });
    }
};

const updateUser: RequestHandler = async (req, res) => {
    const form: type.FormData = req.body;

    const { valid, errors } = validator.validateUpdateData(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: type.UserI = await User.findOne({
            _id: req.user._id,
        }).select('-tempEmail');
        if (!user) {
            return res.status(404).json({ message: 'ERROR: User not found.' });
        }

        if (form.newEmail) {
            const email: type.UserI = await User.findOne({
                email: form.newEmail,
            });
            if (email) {
                return res.status(400).json({
                    message: `ERROR: Email (${form.newEmail}) is already in use.`,
                });
            }
        }

        user.comparePassword(form.password, async (_, isMatch) => {
            if (isMatch) {
                if (form.firstName) user.firstName = form.firstName;
                if (form.lastName) user.lastName = form.lastName;
                if (form.newPassword) user.password = form.newPassword;
                if (form.newEmail) {
                    user.tempEmail = form.newEmail;

                    user.verifyToken = auth.createVerificationToken('email');

                    try {
                        const msg = MSG.updateEmail(user, req.headers.host);
                        await sgMail.send(msg);
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            message:
                                'ERROR: Something went wrong sending you the email verification. Please try again later.',
                        });
                    }
                }

                await user.save();
                return res.json(user);
            }

            res.status(403).json({ message: 'ERROR: Wrong credentials.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while updating. Please try again later or contact our support.',
        });
    }
};

const deleteUser: RequestHandler = async (req, res) => {
    const form: type.FormData = req.body;

    const { valid, errors } = validator.validatePassword(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: type.UserI = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({ message: 'ERROR: User not found.' });
        }

        user.comparePassword(form.password, async (_, isMatch) => {
            if (isMatch) {
                await user.remove();
                return res.json({ message: 'Your account has been deleted.' });
            }

            res.status(403).json({ message: 'ERROR: Wrong password.' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while deleting. Please try again later or contact our support.',
        });
    }
};

const verifyEmail: RequestHandler = async (req, res) => {
    try {
        const token = req.params.verifyToken;
        try {
            jwt.verify(token, process.env.JWT_VERIFICATION_SECRET_KEY);
        } catch (error) {
            return res
                .status(401)
                .json({ message: 'ERROR: Expired email token.' });
        }

        const user: type.UserI = await User.findOne({
            verifyToken: token,
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: 'ERROR: Invalid/Expired email token.' });
        }

        user.verifyToken = null;
        user.isEmailVerified = true;

        if (user.tempEmail) {
            user.email = user.tempEmail;
            user.tempEmail = null;
        }

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

const resendVerifyEmail: RequestHandler = async (req, res) => {
    const form: type.FormData = req.body;

    const { valid, errors } = validator.validateEmail(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: type.UserI = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'ERROR: User not found.' });
        }

        if (user.isEmailVerified) {
            return res.json({ message: 'Your account is already verified.' });
        }
        try {
            user.verifyToken = auth.createVerificationToken('email');
            await user.save();
            const msg = MSG.signUp(user, req.headers.host);
            await sgMail.send(msg);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    'ERROR: Something went wrong sending you the email verification. Please try again later.',
            });
        }

        res.json({
            message: 'Please check your email to verify your account.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong with the email verification. Please try again later.',
        });
    }
};

export default {
    signUpUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    verifyEmail,
    resendVerifyEmail,
};
