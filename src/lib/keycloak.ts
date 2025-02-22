import Keycloak, { KeycloakInitOptions } from "keycloak-js";
import { setAxiosAuthHeader } from "./axios";
import { API_URL, KEYCLOAK_URL } from "../const";
import apiClient from "./api-client";

export const keycloakIns = new Keycloak({
  url: KEYCLOAK_URL,
  realm: "open-dpp",
  clientId: "frontend",
});

const initOptions: KeycloakInitOptions = {
  scope: "openid profile",
  pkceMethod: "S256",
  checkLoginIframe: false,
};

// use the access token from cypress if it exists
if (window.localStorage.getItem("access_token")) {
  initOptions.token = window.localStorage.getItem("access_token") || undefined;
}

// use the refresh token from cypress if it exists
if (window.localStorage.getItem("refresh_token")) {
  initOptions.refreshToken =
    window.localStorage.getItem("refresh_token") || undefined;
}

export const initializeKeycloak = async (keycloak: Keycloak) => {
  await keycloak.init(initOptions);
  if (keycloak.authenticated && keycloak.token && keycloak.tokenParsed) {
    setAxiosAuthHeader(keycloak.token);
    apiClient.setApiKey(keycloak.token);
    // const usedForm = keycloak.tokenParsed?.used_form;
    //keycloakIns.loadUserProfile();
    // const authStore = useAuthStore();
    // authStore.authContext = TokenAuthContext.fromParsedKeycloakToken(keycloak.token, keycloak.tokenParsed);
    // await authStore.login();
  }

  setInterval(() => updateKeycloakToken(keycloak), 60000);
  return keycloak;
};

export const updateKeycloakToken = async (keycloak: Keycloak) => {
  const isRefreshed = await keycloak.updateToken(70);
  if (isRefreshed && keycloak.token) {
    setAxiosAuthHeader(keycloak.token);
    apiClient.setApiKey(keycloak.token);
  }
};

export const logout = async () => {
  // const authStore = useAuthStore();
  // authStore.logout();
  await keycloakIns.logout({ redirectUri: window.location.origin });
};

export const generateRegistrationLink = (token: string) => {
  return API_URL + "/register/" + token;
};

export default keycloakIns;
