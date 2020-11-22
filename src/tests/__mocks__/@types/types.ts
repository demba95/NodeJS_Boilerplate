type LoginResponse = {
    body: string;
};

type ResponseMSG = {
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
