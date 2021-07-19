import * as Type from '@cTypes';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
const JWT_SECRET_EXPIRES_IN: string = process.env.JWT_SECRET_EXPIRES_IN!;
const JWT_VERIFICATION_SECRET_KEY: string = process.env.JWT_VERIFICATION_SECRET_KEY!;
const JWT_VERIFICATION_EXPIRES_IN: string = process.env.JWT_VERIFICATION_EXPIRES_IN!;

const auth: RequestHandler = (req, res, next) => {
    let token: string = req.get('Authorization') || req.query.token || req.body.token;

    try {
        if (token) {
            token = token.replace('Bearer ', '');
            const user = <Type.UserJwtI>jwt.verify(token, JWT_SECRET_KEY);
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: 'Token not found.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

const createAccessToken: Type.JwtAccessFn = (user) => {
    return jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, JWT_SECRET_KEY, {
        expiresIn: JWT_SECRET_EXPIRES_IN,
    });
};

const createVerificationToken: Type.JwtVerifyFn = (mode) => {
    return jwt.sign({ mode }, JWT_VERIFICATION_SECRET_KEY, {
        expiresIn: JWT_VERIFICATION_EXPIRES_IN,
    });
};

export { auth, createAccessToken, createVerificationToken };
