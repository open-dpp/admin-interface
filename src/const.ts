const keycloakDisabled = false;

export { keycloakDisabled };
export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_ROOT as string;
export const API_URL = import.meta.env.VITE_API_ROOT;
export const ADMIN_URL = import.meta.env.VITE_ADMIN_ROOT;
export const VIEW_ROOT_URL = import.meta.env.VITE_ROOT_URL;
