import { EmailMsg } from '@cTypes';

export type EmailFn<U, H> = {
    (user: U, host?: H): EmailMsg;
};
