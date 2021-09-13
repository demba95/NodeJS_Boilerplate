import { Obj, UserI } from '@cTypes';

export type JwtAccessFn = {
    (user: UserI): string;
};

export type JwtVerifyFn = {
    (mode: string, attrs: Obj, secretKey: string, expiresIn: number): string;
};
