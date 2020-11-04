type LoginResponse = {
    body: {
        token: string;
    };
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
