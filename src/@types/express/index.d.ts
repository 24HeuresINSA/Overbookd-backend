import { IUser } from "@entities/User";

declare module 'express' {
    export interface Request  {
        body: {
            keycloakID?: string;
            value: string;
            key: string;
        };
    }
}
