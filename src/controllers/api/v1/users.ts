import { RequestHandler } from 'express';
import User from '@models/user';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import * as auth from '@middlewares/auth';
import * as validator from '@helpers/validator';
import * as Msg from '@helpers/message';
import * as Type from '@cTypes/types';

sgMail.setApiKey(process.env.SENDGRID_KEY!);

const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY!;
const ENV = process.env.ENV!;

const signUpUser: RequestHandler = async (req, res) => {
    const form: Type.SignUpForm = req.body;
    const { valid, errors } = validator.validateSignUpData(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        if (user) return res.status(400).json({ message: 'Email already in use.' });
        const response: { message: string; verifyToken?: string } = {
            message: 'Your account has been created. Please check your email to verify your account.',
        };

        delete form.confirmPassword;
        form.verifyToken = auth.createVerificationToken('email');
        const newUser: Type.UserI = new User(form);
        await newUser.save();

        if (ENV === 'production') {
            const msg = Msg.signUp(newUser, req.headers.host!);
            await sgMail.send(msg);
        } else {
            response.verifyToken = form.verifyToken;
        }

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to sign up. Please try again later or contact our support.',
        });
    }
};

const loginUser: RequestHandler = async (req, res) => {
    const form: Type.LoginForm = req.body;

    const { valid, errors } = validator.validateLoginData(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

        user.comparePassword(form.password, (_: any, matchPassword: boolean) => {
            const response: { message: string; verifyToken?: string } = {
                message: 'Please verify your email first.',
            };
            if (matchPassword) {
                if (user.isEmailVerified) {
                    const token = auth.createAccessToken(user);
                    return res.json(token);
                }

                if (ENV !== 'production') response.verifyToken = user.verifyToken;

                return res.status(403).json(response);
            }

            res.status(403).json({ message: 'Wrong credentials.' });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to login. Please try again later or contact our support.',
        });
    }
};

const getUser: RequestHandler = async (req, res) => {
    try {
        const user: Type.UserI | null = await User.findOne({
            _id: req.user!._id,
        }).select('-tempEmail');
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to get profile. Please try again later or contact our support.',
        });
    }
};

const updateUser: RequestHandler = async (req, res) => {
    const form: Type.UpdateUserForm = req.body;
    const { valid, errors } = validator.validateUpdateData(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({
            _id: req.user!._id,
        });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

        if (form.newEmail) {
            const email: Type.UserI | null = await User.findOne({
                email: form.newEmail,
            });
            if (email)
                return res.status(400).json({
                    message: `Email (${form.newEmail}) is already in use.`,
                });
        }

        user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
            if (matchPassword) {
                const response: { message: string; verifyToken?: string } = {
                    message: 'Your profile has been updated.',
                };

                if (form.firstName) user.firstName = form.firstName;
                if (form.lastName) user.lastName = form.lastName;
                if (form.newPassword) user.password = form.newPassword;
                if (form.newEmail) {
                    response.message += ` An email has been sent to ${form.newEmail}. Please verify your new email to update your email address.`;
                    user.tempEmail = form.newEmail;
                    user.verifyToken = auth.createVerificationToken('email');
                    await user.save();

                    try {
                        if (ENV === 'production') {
                            const msg = Msg.updateEmail(user, req.headers.host!);
                            await sgMail.send(msg);
                        } else {
                            response.verifyToken = user.verifyToken;
                        }
                    } catch (error) {
                        res.status(500).json({
                            message: 'Something went wrong sending you the email verification. Please try again later.',
                        });
                    }
                } else {
                    await user.save();
                }

                return res.json(response);
            }

            res.status(403).json({ message: 'Wrong credentials.' });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while updating. Please try again later or contact our support.',
        });
    }
};

const deleteUser: RequestHandler = async (req, res) => {
    const form: Type.DeleteForm = req.body;
    const { valid, errors } = validator.validatePassword(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ _id: req.user!._id });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

        user.comparePassword(form.password, async (_: any, matchPassword: boolean) => {
            if (matchPassword) {
                await user.remove();
                return res.json({ message: 'Your account has been deleted.' });
            }

            res.status(403).json({ message: 'Wrong password.' });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while deleting. Please try again later or contact our support.',
        });
    }
};

const verifyEmail: RequestHandler = async (req, res) => {
    const token: string = req.params.verifyToken!;

    try {
        jwt.verify(token, JWT_VERIFICATION_SECRET_KEY);
    } catch (error) {
        return res.status(401).json({ message: 'Expired email token.' });
    }

    try {
        const user: Type.UserI | null = await User.findOne({
            verifyToken: token,
        });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

        user.verifyToken = '';
        user.isEmailVerified = true;

        if (user.tempEmail) {
            user.email = user.tempEmail;
            user.tempEmail = '';
        }

        await user.save();

        res.json({ message: 'Thank you! Your email has been verified.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong verifying your account. Please try again later.',
        });
    }
};

const resendVerifyEmail: RequestHandler = async (req, res) => {
    const form: Type.EmailForm = req.body;
    const { valid, errors } = validator.validateEmail(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });
        if (user.isEmailVerified) return res.json({ message: 'Your account is already verified.' });

        user.verifyToken = auth.createVerificationToken('email');
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong with the email verification. Please try again later.',
        });
    }
};

const resetPassword: RequestHandler = async (req, res) => {
    const form: Type.EmailForm = req.body;
    const { valid, errors } = validator.validateEmail(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });
        const response: { message: string; verifyToken?: string } = {
            message: 'Please check your email to reset your password.',
        };

        user.verifyToken = auth.createVerificationToken('password');
        await user.save();

        if (ENV === 'production') {
            const msg = Msg.resetPassword(user);
            await sgMail.send(msg);
        } else {
            response.verifyToken = user.verifyToken;
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong with the email verification. Please try again later.',
        });
    }
};

const updatePassword: RequestHandler = async (req, res) => {
    const token: string = req.params.verifyToken!;

    try {
        jwt.verify(token, JWT_VERIFICATION_SECRET_KEY);
    } catch (error) {
        return res.status(401).json({ message: 'Expired password token.' });
    }

    const form: Type.PasswordForm = req.body;
    const { valid, errors } = validator.validatePassword(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({
            verifyToken: token,
        });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });
        const response: { message: string; verifyToken?: string } = {
            message: 'Password updated successfully.',
        };

        user.verifyToken = '';
        user.password = form.password;
        await user.save();

        if (ENV === 'production') {
            const msg = Msg.updatePassword(user);
            await sgMail.send(msg);
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong with the email verification. Please try again later.',
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
    resetPassword,
    updatePassword,
};