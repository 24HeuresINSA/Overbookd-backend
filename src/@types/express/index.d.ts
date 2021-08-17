import { IUser } from "@entities/User";

declare module 'express' {
    export interface Request  {
        body: {
            _id?: string;
            name?: RegExp | string | QuerySelector<RegExp | string> | any;
            keycloakID?: string;

        } | friendRequest | Config;
    }
}

export interface Config {
    value: string,
    key: string,
}

export interface friendRequest {
    from: string,
    to: {
        id: string,
        username: string,
    }
}
