import { createRouter, createWebHistory } from "vue-router";
import keycloakIns from "../lib/keycloak";
import { config } from "../const";
import { useLayoutStore } from "../stores/layout";
import { BASE_ROUTES } from "./routes/base";
import { AUTH_ROUTES } from "./routes/auth";
import { ORGANIZATION_ROUTES } from "./routes/organizations";

// const MODE = import.meta.env.MODE;

export const routes = [...BASE_ROUTES, ...AUTH_ROUTES, ...ORGANIZATION_ROUTES];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const layoutStore = useLayoutStore();
  layoutStore.isPageLoading = true;
  if (config.KEYCLOAK_DISABLED) {
    next();
  }
  if (!keycloakIns.authenticated) {
    await keycloakIns.login({
      redirectUri: config.ADMIN_URL + to.path,
    });
    next();
  } else {
    next();
  }
});

router.afterEach(async () => {
  const layoutStore = useLayoutStore();
  // await new Promise((resolve) => setTimeout(resolve, 75));
  layoutStore.isPageLoading = false;
});
