import { bot } from '@config/telegram';
import * as Type from '@cTypes';
import Device from '@models/device';
import User from '@models/user';
import { deleteMsg } from '@telegram/helpers';
import { RequestHandler } from 'express';

export const notify: RequestHandler = async (req, res) => {
    try {
        const { data, notify }: Type.IoTDeviceData = req.body;

        if (notify) {
            const device: Type.DeviceI = await Device.findOne({
                _id: req.device!._id,
                userId: req.device!.userId,
            });
            if (!device) return res.status(404).json({ message: 'Device not found.' });

            const user: Type.UserI = await User.findById(req.device!.userId);
            if (!user) return res.status(404).json({ message: 'User not found.' });

            if (user!.telegramId.length === 0)
                return res.status(400).json({ message: 'No telegram Id associated to your account.' });
            if (!user!.isTelegramVerified) return res.status(400).json({ message: 'Telegram not verified.' });

            const msg: string = `<b>Device:</b> ${device.name.toUpperCase()}\
                                \n\
                                \n   <u>Msg:</u> ${data.message}`;
            const { message_id: msgId }: any = await bot.telegram.sendMessage(user!.telegramId, msg, {
                parse_mode: 'HTML',
            });

            await deleteMsg(user!.telegramId, msgId);
        }

        res.json('Server received your message!');
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while executing your request.' });
    }
};
