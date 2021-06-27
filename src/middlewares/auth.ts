import * as Type from '@cTypes/types';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN!;
const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY!;
const JWT_VERIFICATION_EXPIRES_IN = process.env.JWT_VERIFICATION_EXPIRES_IN!;

const auth: RequestHandler = (req, res, next) => {
    let token: string = req.get('Authorization') || req.query.token || req.body.token;

    try {
        if (token) {
            token = token.replace('Bearer ', '');
            const user = <Type.UserJWT>jwt.verify(token, JWT_SECRET_KEY);
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: 'Token not found.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

const createAccessToken: Type.JWTAccessFn = (user: Type.User) => {
    return jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName }, JWT_SECRET_KEY, {
        expiresIn: JWT_SECRET_EXPIRES_IN,
    });
};

const createVerificationToken: Type.JWTVerifyFn = (mode: string) => {
    return jwt.sign({ mode }, JWT_VERIFICATION_SECRET_KEY, {
        expiresIn: JWT_VERIFICATION_EXPIRES_IN,
    });
};

export { auth, createAccessToken, createVerificationToken };
