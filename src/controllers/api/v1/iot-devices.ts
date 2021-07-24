import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import IoT from '@models/iot';
import User from '@models/user';
import { RequestHandler } from 'express';

export const notify: RequestHandler = async (req, res) => {
    try {
        const { data, notify }: Type.IoTData = req.body;

        if (notify) {
            const iot: Type.IoTI | null = await IoT.findOne({ _id: req.iot!._id, userId: req.iot!.userId });
            if (!iot) return res.status(404).json({ message: 'Device not found.' });

            const user: Type.UserI | null = await User.findOne({ _id: req.iot!.userId });
            if (!user) return res.status(404).json({ message: 'User not found.' });

            if (user!.telegramId.length === 0)
                return res.status(400).json({ message: 'No telegram Id associated to your account.' });
            if (!user!.isTelegramVerified) return res.status(400).json({ message: 'Telegram not verified.' });

            const msg: string = `<b>Device:</b> ${iot.name}\
                                \n\
                                \n   <u>Msg:</u> ${data.message}`;
            bot.telegram.sendMessage(user!.telegramId, msg, { parse_mode: 'HTML' });
        }

        res.json('Server received your message!');
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while executing your request. Please try again.',
        });
    }
};
