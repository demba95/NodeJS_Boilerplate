import { RequestHandler } from 'express';

export const newMessage: RequestHandler = async (req, res) => {
    try {
        console.log(req.body);
        res.json('ok');
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while executing your request. Please try again.',
        });
    }
};
