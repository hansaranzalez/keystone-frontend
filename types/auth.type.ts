export const LOCALSTORAGE_ACCESS_TOKEN_VARIABLE = 'ecommerce-token'

export enum HttpStatus {
    SUCCESS = 200,
    CREATED = 201,
    ERROR = 500,
}

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export interface IAuthStatus {
    isAuthenticated: boolean;
    userRole: Role;
    userId: string;
}

export interface IServerAuthResponse {
    accessToken: string;
}

export interface ICurrentUser {
    id: string;
    name: string;
    role: Role;
    email: string;
}