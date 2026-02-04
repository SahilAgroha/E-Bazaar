import { User } from "./userTypes";

export interface AuthResponse {
    jwt: string;
    message: string;
    role: string;
    user: User;
}