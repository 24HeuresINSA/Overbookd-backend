import Keycloak from "keycloak-connect";
import {MemoryStore} from "express-session";


export const memoryStore = new MemoryStore();

export const keycloak = new Keycloak({
    store: memoryStore
}, {
    "realm": "project_a",
    "bearer-only": true,
    "auth-server-url": "http://localhost:8080/auth/",
    "ssl-required": "external",
    "resource": "project_a_api",
    "confidential-port": 0
});