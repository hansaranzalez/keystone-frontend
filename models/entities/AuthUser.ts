// types/auth.type.ts
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export class AuthUser {
    constructor(
        public id: string | undefined = undefined,
        public name: string = '',
        public email: string = '',
        public role: Role = Role.USER,
        public profile_image_url: string | null = null,
        public is_active: Status = Status.ACTIVE,
        public is_verified: boolean = false,
        public last_login: Date | null = null,
        public last_password_change: Date | null = null,
        public google_auth: boolean = false,
        public facebook_auth: boolean = false,
        public created_at: Date | null = null,
        public updated_at: Date | null = null
    ) { }

    static Build(data?: Record<string, any>): AuthUser {
        if (data) {
            return new AuthUser(
                data.id,
                data.name,
                data.email,
                data.role || Role.USER,
                data.profile_image_url,
                data.is_active || Status.ACTIVE,
                data.is_verified || false,
                data.last_login ? new Date(data.last_login) : null,
                data.last_password_change ? new Date(data.last_password_change) : null,
                data.google_auth || false,
                data.facebook_auth || false,
                data.created_at ? new Date(data.created_at) : null,
                data.updated_at ? new Date(data.updated_at) : null
            );
        }
        return new AuthUser();
    }

    toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            profile_image_url: this.profile_image_url,
            is_active: this.is_active,
            is_verified: this.is_verified,
            last_login: this.last_login,
            last_password_change: this.last_password_change,
            google_auth: this.google_auth,
            facebook_auth: this.facebook_auth,
        };
    }

    // Helper methods for common checks
    isAdmin(): boolean {
        return this.role === Role.ADMIN;
    }

    isActiveUser(): boolean {
        return this.is_active === Status.ACTIVE;
    }

    hasVerifiedEmail(): boolean {
        return this.is_verified;
    }

    hasSocialAuth(): boolean {
        return this.google_auth || this.facebook_auth;
    }

    getLastLoginFormatted(): string {
        return this.last_login ? this.last_login.toLocaleDateString() : 'Never';
    }

    getLastPasswordChangeFormatted(): string {
        return this.last_password_change ? this.last_password_change.toLocaleDateString() : 'Never';
    }
}

// We can now export the same class as User for semantic purposes
export { AuthUser as User };