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

// Facebook SDK type declarations
export interface FacebookAuthResponse {
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
    userID: string;
    code?: string; // The auth code returned when using response_type: 'code'
}

export interface FacebookLoginStatusResponse {
    status: 'connected' | 'not_authorized' | 'unknown';
    authResponse: FacebookAuthResponse | null;
}

export interface FacebookLoginOptions {
    config_id?: string;
    response_type?: 'code' | 'token';
    scope?: string;
    return_scopes?: boolean;
    auth_type?: string;
}

// Extend the global Window interface to include Facebook SDK
declare global {
    interface Window {
        FB: {
            init(options: {
                appId: string;
                cookie?: boolean;
                xfbml?: boolean;
                version: string;
            }): void;
            login(
                callback: (response: FacebookLoginStatusResponse) => void,
                options?: FacebookLoginOptions
            ): void;
            getLoginStatus(
                callback: (response: FacebookLoginStatusResponse) => void
            ): void;
            logout(callback: (response: any) => void): void;
            AppEvents: any;
            api: any;
        };
        fbAsyncInit?(): void;
    }
}