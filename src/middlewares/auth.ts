import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import * as type from '@custom_types/types';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN;
const JWT_VERIFICATION_SECRET_KEY = process.env.JWT_VERIFICATION_SECRET_KEY;
const JWT_VERIFICATION_EXPIRES_IN = process.env.JWT_VERIFICATION_EXPIRES_IN;

const auth: RequestHandler = (req, res, next) => {
    try {
        let token: string =
            req.get('Authorization') || req.query.token || req.body.token;

        try {
            if (token) {
                token = token.replace('Bearer ', '');
                const user = <type.UserJWT>jwt.verify(token, JWT_SECRET_KEY);
                if (!user) {
                    return res.status(401).json({ message: 'Not authorized.' });
                }

                req.user = user;
                next();
            } else {
                throw new Error();
            }
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                'ERROR: Something went wrong while authorizing request. Please try again later.',
        });
    }
};

const createAccessToken: type.JWTAccessFn = (user: type.User) => {
    return jwt.sign(
        { _id: user._id, firstName: user.firstName, lastName: user.lastName },
        JWT_SECRET_KEY,
        { expiresIn: JWT_SECRET_EXPIRES_IN }
    );
};

const createVerificationToken: type.JWTVerifyFn = (mode) => {
    return jwt.sign({ mode }, JWT_VERIFICATION_SECRET_KEY, {
        expiresIn: JWT_VERIFICATION_EXPIRES_IN,
    });
};

export { auth, createAccessToken, createVerificationToken };
