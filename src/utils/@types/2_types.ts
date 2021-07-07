type EmailMsg = {
    from: string;
    to: string;
    subject: string;
    html: string;
};

// _ User
type User = {
    _id?: string;
    firstName: string;
    lastName: string;
};

type LoginForm = {
    _id?: string;
    email: string;
    password: string;
};

type DeleteForm = {
    password: string;
};

type EmailForm = {
    email: string;
};

type PasswordForm = {
    password: string;
    confirmPassword?: string;
};

type SignUpFormExtra = {
    confirmPassword?: string;
    verifyToken?: string;
};

type SignUpForm = User & LoginForm & SignUpFormExtra;

type UpdateUserFormExtra = {
    password: string;
    email: string;
    newPassword: string;
    confirmNewPassword: string;
};

type UpdateUserForm = User & UpdateUserFormExtra;

// _ API

type ApiForm = {
    _id?: string;
    name?: string;
    url?: string;
    key?: string;
    value?: string;
    description?: string;
    active?: boolean;
};

export { User, ApiForm, LoginForm, SignUpForm, UpdateUserForm, DeleteForm, EmailForm, PasswordForm, EmailMsg };
