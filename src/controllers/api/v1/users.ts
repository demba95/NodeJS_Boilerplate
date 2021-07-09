import { bot } from '@config/telegram';
import * as Type from '@cTypes/types';
import * as auth from '@middlewares/auth';
import User from '@models/user';
import * as email from '@msg/email';
import sgMail from '@sendgrid/mail';
import * as validator from '@validator/validator';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

sgMail.setApiKey(process.env.SENDGRID_KEY!);

const JWT_VERIFICATION_SECRET_KEY: string = process.env.JWT_VERIFICATION_SECRET_KEY!;
const ENV: string = process.env.ENV!;
const LOGIN_WAIT_TIME: number = 5;
const LOGIN_MAX_TRY: number = 5;

const addTry: Type.AddTryFn = async (user, res) => {
    try {
        const loginCount: number = +user.loginCount! + 1;
        const waitTime: number = LOGIN_WAIT_TIME * +user.waitCount! * +user.waitCount!;

        user.loginCount = loginCount;
        if (loginCount > LOGIN_MAX_TRY) user.waitCount = +user.waitCount! + 1;
        await user.save();

        if (LOGIN_MAX_TRY - user.loginCount! >= 0) {
            return res.status(400).json({
                message: `Wrong credentials, you have ${LOGIN_MAX_TRY - loginCount + 1} more tries.`,
            });
        }

        if (LOGIN_MAX_TRY - user.loginCount! === -1)
            return res.status(400).json({
                message: `Too many unsuccessful tries. Next try you will be blocked for ${LOGIN_WAIT_TIME} mins.`,
            });

        res.status(400).json({ message: `You have been blocked for ${waitTime} mins.` });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while trying to login. Please try again later or contact our support.',
        });
    }
};

const checkTimeElapsed: Type.CheckTimeElapsed = async (user, res) => {
    let loginCount: number = +user.loginCount!;

    switch (true) {
        case loginCount <= LOGIN_MAX_TRY:
            return true;
        case loginCount > LOGIN_MAX_TRY:
            const date: number = new Date().getTime();
            const updateDate: number = new Date(user.updatedAt!).getTime();

            if ((date - updateDate) / 1000 / 60 >= LOGIN_WAIT_TIME * +user.waitCount! * +user.waitCount!) {
                user.loginCount = 0;
                user.waitCount = 0;
                await user.save();
                return true;
            }

            addTry(user, res);

            return false;
        default:
            return false;
    }
};

const signUpUser: RequestHandler = async (req, res) => {
    const form: Type.SignUpForm = req.body;
    const { valid, errors } = validator.validateUserSignUp(form);
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
            const msg = email.signUp(newUser, req.headers.host!);
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
    const { valid, errors } = validator.validateUserLogin(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });
        if (user.status === 'suspended')
            return res
                .status(400)
                .json({ message: 'Your account has been suspended. Please contact our support team.' });

        if (await checkTimeElapsed(user, res)) {
            user.comparePassword(form.password, (_: any, matchPassword: boolean) => {
                const response: { message: string; verifyToken?: string } = {
                    message: 'Please verify your email first.',
                };
                if (matchPassword) {
                    if (user.status === 'activated') {
                        const token = auth.createAccessToken(user);
                        return res.json(token);
                    }

                    if (ENV !== 'production') response.verifyToken = user.verifyToken;

                    return res.status(403).json(response);
                } else {
                    addTry(user, res);
                }
            });
        }
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
    const { valid, errors } = validator.validateUserUpdate(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({
            _id: req.user!._id,
        });
        if (!user) return res.status(404).json({ message: 'Wrong credentials.' });

        if (user.email !== form.email) {
            const email: Type.UserI | null = await User.findOne({
                email: form.email,
            });
            if (email)
                return res.status(400).json({
                    message: `Email (${form.email}) is already in use.`,
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
                if (
                    (!validator.isEmpty(form.telegramId) && user.telegramId === '') ||
                    (!validator.isEmpty(form.telegramId) && form.telegramId.trim() !== user.telegramId)
                ) {
                    if (form.telegramId.trim() !== user.telegramId) {
                        const userExists: Type.UserI | null = await User.findOne({ telegramId: form.telegramId });
                        if (userExists && userExists.isTelegramVerified)
                            return res.status(400).json({ message: `Telegram ${form.telegramId} is already in use.` });
                    }

                    user.telegramId = form.telegramId;
                    user.isTelegramVerified = false;

                    if (ENV !== 'test') {
                        const msg: string = 'Please send /verify to confirm your telegram.';
                        await bot.telegram.sendMessage(form.telegramId, msg, { parse_mode: 'HTML' });
                    }
                } else {
                    user.telegramId = '';
                    user.isTelegramVerified = false;
                }
                if (user.email !== form.email) {
                    response.message += ` An email has been sent to ${form.email}. Please verify your new email to update your email address.`;
                    user.tempEmail = form.email;
                    user.verifyToken = auth.createVerificationToken('email');
                    await user.save();

                    try {
                        if (ENV === 'production') {
                            const msg = email.updateEmail(user, req.headers.host!);
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
    const { valid, errors } = validator.validateUserPassword(form);
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
        if (!user)
            return res.status(404).json({ message: 'Invalid email token, please reset your email and try again.' });

        user.verifyToken = '';
        user.status = 'activated';

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
    const { valid, errors } = validator.validateUserEmail(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({ email: form.email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });
        if (user.status === 'activated') return res.json({ message: 'Your account is already verified.' });

        user.verifyToken = auth.createVerificationToken('email');

        res.json({ message: 'A verification code was sent to your email.' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong with the email verification. Please try again later.',
        });
    }
};

const resetPassword: RequestHandler = async (req, res) => {
    const form: Type.EmailForm = req.body;
    const { valid, errors } = validator.validateUserEmail(form);
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
            const msg = email.resetPassword(user);
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
    const { valid, errors } = validator.validateUserPassword(form);
    if (!valid) return res.status(400).json(errors);

    try {
        const user: Type.UserI | null = await User.findOne({
            verifyToken: token,
        });
        if (!user)
            return res
                .status(404)
                .json({ message: 'Your token has expired, please reset your password and try again.' });
        const response: { message: string; verifyToken?: string } = {
            message: 'Password updated successfully.',
        };

        user.verifyToken = '';
        user.password = form.password;
        await user.save();

        if (ENV === 'production') {
            const msg = email.updatePassword(user);
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
