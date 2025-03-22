// models/entities/ImageAsset.ts
// Using interface to avoid circular imports
interface UserReference {
    id?: string;
    name: string;
    email: string;
}

export class ImageAsset {
    constructor(
        public id: string | undefined = undefined,
        public name: string = '',
        public url: string = '',
        public key: string = '',
        public user: UserReference | null = null,
        public created_at: Date | null = null,
        public updated_at: Date | null = null
    ) { }

    static Build(data?: Record<string, any>): ImageAsset {
        if (data) {
            return new ImageAsset(
                data.id,
                data.name || '',
                data.url || '',
                data.key || '',
                data.user || null,
                data.created_at ? new Date(data.created_at) : null,
                data.updated_at ? new Date(data.updated_at) : null
            );
        }
        return new ImageAsset();
    }

    toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            key: this.key,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}
