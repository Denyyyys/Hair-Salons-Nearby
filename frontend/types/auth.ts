export type AuthResponse = {
    token: string;
};

export type LoginRequest = {
    username: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    username: string;
    password: string;
};

export type JwtPayload = {
    sub?: string;
    exp?: number;
    iat?: number;
    email?: string;
    role?: string;
};