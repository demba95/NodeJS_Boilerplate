import * as Type from '@cTypes';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
const JWT_SECRET_EXPIRES_IN: number = +process.env.JWT_SECRET_EXPIRES_IN!;
const JWT_DEVICE_SECRET_KEY: string = process.env.JWT_DEVICE_SECRET_KEY!;

const auth: RequestHandler = (req, res, next) => {
    let token: string = req.get('Authorization') || req.query.token || req.body.token;

    try {
        if (token) {
            token = token.replace('Bearer ', '');
            req.user = <Type.UserJwtI>jwt.verify(token, JWT_SECRET_KEY);
            next();
        } else {
            res.status(401).json({ message: 'Token not found.' });
        }
    } catch (error: any) {
        return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

const authDevice: RequestHandler = (req, res, next) => {
    let token: string = req.get('Authorization') || req.query.token || req.body.token;

    try {
        if (token) {
            token = token.replace('Bearer ', '');
            req.device = <Type.DeviceJwtI>jwt.verify(token, JWT_DEVICE_SECRET_KEY);
            next();
        } else {
            res.status(401).json({ message: 'Token not found.' });
        }
    } catch (error: any) {
        return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

const createAccessToken: Type.JwtAccessFn = (user) => {
    return jwt.sign(
        { _id: user!._id, firstName: user!.firstName, lastName: user!.lastName, admin: user!.admin },
        JWT_SECRET_KEY,
        { expiresIn: `${JWT_SECRET_EXPIRES_IN}d` }
    );
};

const createCustomToken: Type.JwtVerifyFn = (mode, attrs = {}, secretKey, expiresIn) => {
    attrs['mode'] = mode;
    if (expiresIn > 0) return jwt.sign(attrs, secretKey, { expiresIn: `${expiresIn}d` });
    return jwt.sign(attrs, secretKey);
};

export { auth, authDevice, createAccessToken, createCustomToken };
