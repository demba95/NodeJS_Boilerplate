import { Obj } from './1_shared';
import { EmailMsg, User } from './2_types';

// _ Email
type EmailFn<U, H> = {
    (user: U, host?: H): EmailMsg;
};

// _ Validator
type CheckFn<T> = {
    (value: T): boolean;
};

type CheckPropertyFn = {
    (propertyName: string, data: Obj, length?: number | undefined): boolean;
};

type ValidatorFn<T> = {
    (data: T): {
        errors: Obj;
        valid: boolean;
    };
};

// _ MongoDB
type UpdateDocumentFn = {
    (document: Obj, body: Obj, permit: string[]): void;
};

// _ JWT
type JwtAccessFn = {
    (user: User): string;
};

type JwtVerifyFn = {
    (mode: string): string;
};

export { EmailFn, CheckFn, CheckPropertyFn, UpdateDocumentFn, JwtVerifyFn, JwtAccessFn, ValidatorFn };
