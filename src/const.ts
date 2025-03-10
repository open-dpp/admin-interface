const envRegex = /__[A-Z_]__/g

const config_string = (name: string, env: string): string => {
  const viteKey = 'VITE_' + name;
  const vite = import.meta.env[viteKey];
  if (vite) {
    const viteType = typeof vite;
    if (typeof vite === "string") {
      return vite;
    }
    throw new Error(`Malformed vite config ${viteKey} should be string but is type ${viteType} with value ${vite}. The application will not work as expected`);
  } else {
    if (!env.match(envRegex)) {
      return env;
    }

    throw new Error(`Malformed config no value for environment variable ${name}, should be replaced by search and replace. The application will not work as expected`);
  }
}

const config_bool = (name: string, env: string): boolean => {
  const viteKey = 'VITE_' + name;
  const vite = import.meta.env[viteKey];
  if (vite) {
    const viteType = typeof vite;
    if (typeof vite === 'boolean') {
      return vite;
    }
    throw new Error(`Malformed vite config ${viteKey} should be boolean but is type ${viteType} with value ${vite}. The application will not work as expected`);
  } else {
    if (!env.match(envRegex)) {
      if (!env.match('false') && !env.match('true')) {
        throw new Error(`Malformed config environment of ${name}, should either be true or false, but is ${env}. The application will not work as expected.`)
      }

      return name === 'true';
    }

    throw new Error(`Malformed config no value for enviornment variable ${name}, should be replaced by search and replace`);
  }
}

export const config = {
  KEYCLOAK_DISABLED: config_bool('KEYCLOAK_DISABLED', 'ENV__KEYCLOAK_DISABLED__'),
  KEYCLOAK_URL: config_string('KEYCLOAK_ROOT', 'ENV__KEYCLOAK_ROOT__'),
  API_URL: config_string('API_ROOT', 'ENV__API_ROOT__'),
  ADMIN_URL: config_string('ADMIN_ROOT', 'ENV__ADMIN_ROOT__'),
  VIEW_ROOT_URL: config_string('VIEW_ROOT', 'ENV__VIEW_ROOT__')
}

// local storage keys that are not runtime dependent 
const LOCAL_STORAGE_PREFIX = "open-dpp-local";
export const LAST_SELECTED_ORGANIZATION_ID_KEY = `${LOCAL_STORAGE_PREFIX}-last-selected-organization-id`;
export const QUICK_ACCESS_ITEMS_KEY = `${LOCAL_STORAGE_PREFIX}-quick-access-items`;
