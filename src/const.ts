const keycloakDisabled = false;

export { keycloakDisabled };
export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_ROOT as string;
export const API_URL = import.meta.env.VITE_API_ROOT;
export const ADMIN_URL = import.meta.env.VITE_ADMIN_ROOT;
export const VIEW_ROOT_URL = import.meta.env.VITE_VIEW_ROOT_URL;

// local storage keys
const LOCAL_STORAGE_PREFIX = 'open-dpp-local';
export const LAST_SELECTED_ORGANIZATION_ID_KEY = `${LOCAL_STORAGE_PREFIX}-last-selected-organization-id`;
export const QUICK_ACCESS_ITEMS_KEY = `${LOCAL_STORAGE_PREFIX}-quick-access-items`;