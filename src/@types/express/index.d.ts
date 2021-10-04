import {IConfig} from "@entities/Config";
import {Grant} from "keycloak-connect";

declare module 'express' {
    export interface Request  {
        kauth: {
            grant: Grant,
        };
        body: {
            _id?: string;
            name?: RegExp | string | QuerySelector<RegExp | string> | any;
            keycloakID?: string;

        } | friendRequest | IConfig;
    }
}
