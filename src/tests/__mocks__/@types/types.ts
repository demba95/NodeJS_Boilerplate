type LoginResponse = {
    body: string;
};

type ResponseMsg = {
    body: {
        message: string;
    };
};

type UserProfile = {
    body: {
        firstName: string;
        lastName: string;
        email: string;
    };
};
