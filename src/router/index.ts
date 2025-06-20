import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import keycloakIns from "../lib/keycloak";
import { ADMIN_URL, keycloakDisabled } from "../const";
import { useLayoutStore } from "../stores/layout";

import { AUTH_ROUTES } from "./routes/auth";
import { ORGANIZATION_ROUTES } from "./routes/organizations";
import { useIndexStore } from "../stores";

// const MODE = import.meta.env.MODE;

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: () => {
      const indexStore = useIndexStore();
      const org = indexStore.selectedOrganization;

      if (org) {
        return `/organizations/${indexStore.selectedOrganization}/models`;
      } else {
        return "/organizations"; // fallback
      }
    },
  },
  ...AUTH_ROUTES,
  ...ORGANIZATION_ROUTES,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const layoutStore = useLayoutStore();
  layoutStore.isPageLoading = true;
  if (keycloakDisabled) {
    next();
  }
  if (!keycloakIns.authenticated) {
    await keycloakIns.login({
      redirectUri: ADMIN_URL + to.path,
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
