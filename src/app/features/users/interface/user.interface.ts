export interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

export interface Role {
    id: number;
    code: string;
    description: string;
}