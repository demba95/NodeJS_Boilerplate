export type EmailMsg = {
    from: string;
    to: string;
    subject: string;
    html: string;
};

// _ User
export type User = {
    _id?: string;
    firstName: string;
    lastName: string;
};

export type LoginForm = {
    _id?: string;
    email: string;
    password: string;
};

export type DeleteForm = {
    password: string;
};

export type EmailForm = {
    email: string;
};

export type PasswordForm = {
    password: string;
    confirmPassword?: string;
};

export type SignUpFormExtra = {
    confirmPassword?: string;
    verifyToken?: string;
};

export type SignUpForm = User & LoginForm & SignUpFormExtra;

export type UpdateUserFormExtra = {
    password: string;
    email: string;
    newPassword: string;
    confirmNewPassword: string;
    telegramId: string;
};

export type UpdateUserForm = User & UpdateUserFormExtra;

// _ API

export type ApiForm = {
    _id?: string;
    name?: string;
    url?: string;
    key?: string;
    value?: string;
    description?: string;
    active?: boolean;
};
