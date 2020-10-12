import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import * as type from '../utils/types';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY;

const auth: RequestHandler = (req, res, next) => {
    try {
        let token: string =
            req.get('Authorization') || req.query.token || req.body.token;

        if (token) {
            token = token.replace('Bearer ', '');
            const user = <type.UserJWT>jwt.verify(token, JWT_SECRET_KEY);
            if (!user) {
                return res.status(400).json({ message: 'Not authorized.' });
            }

            req.user = user;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while authorizing request. Please try again later.',
        });
    }
};

const createAccessToken: type.JWTFnAccessFn = (user: type.User) => {
    return jwt.sign(
        { _id: user._id, firstName: user.firstName, lastName: user.lastName },
        JWT_SECRET_KEY,
        { expiresIn: '7d' }
    );
};

const createVerificationToken: type.JWTFnVerifyFn = (mode, expiration) => {
    return jwt.sign({ mode }, JWT_VERIFICATION_SECRET_KEY, {
        expiresIn: expiration,
    });
};

export { auth, createAccessToken, createVerificationToken };
