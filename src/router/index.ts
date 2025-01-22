import { createRouter, createWebHistory } from "vue-router";
import keycloakIns from "../lib/keycloak.ts";
import { ADMIN_URL, keycloakDisabled } from "../const.ts";

// const MODE = import.meta.env.MODE;

export const routes = [
  { path: "/", component: () => import("../view/Dashboard.vue") },
  { path: "/users", component: () => import("../view/UserListView.vue") },
  { path: "/settings", component: () => import("../view/Settings.vue") },
  { path: "/products", component: () => import("../view/Products.vue") },
  {
    path: "/products/:productId/qr-code",
    component: () => import("../view/products/ProductQrCode.vue"),
  },
  {
    path: "/products/:productId",
    component: () => import("../view/products/Product.vue"),
  },
  {
    path: "/notifications",
    component: () => import("../view/Notifications.vue"),
  },
  { path: "/news", component: () => import("../view/News.vue") },
  { path: "/files", component: () => import("../view/Files.vue") },
  { path: "/stats", component: () => import("../view/Stats.vue") },
  { path: "/profile", component: () => import("../view/Profile.vue") },
  { path: "/logout", component: () => import("../view/Logout.vue") },
    {path: '/organizations/select', component: () => import('../view/organizations/SelectOrganizationView.vue')},
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.debug(to, from);
  if (keycloakDisabled) {
    next();
  }
  if (!keycloakIns.authenticated) {
    await keycloakIns.login({
      redirectUri: ADMIN_URL,
    });
    next();
  } else {
    next();
  }
});
