import {
  createRouter,
  createWebHistory,
  RouteLocationNormalizedGeneric,
} from "vue-router";
import keycloakIns from "../lib/keycloak";
import { ADMIN_URL, keycloakDisabled } from "../const";
import { useLayoutStore } from "../stores/layout";

// const MODE = import.meta.env.MODE;

export const routes = [
  {
    path: "/",
    component: () => import("../view/Dashboard.vue"),
    beforeEnter: () => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [];
    },
  },
  { path: "/users", component: () => import("../view/UserListView.vue") },
  { path: "/settings", component: () => import("../view/Settings.vue") },
  {
    path: "/products",
    component: () => import("../view/Products.vue"),
    beforeEnter: () => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [{ name: "Produkte", path: "/products" }];
    },
  },
  {
    path: "/products/:productId/qr-code",
    component: () => import("../view/products/ProductQrCode.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Produkte", path: "/products" },
        { name: "Produkt", path: "/product/" + to.params.productId },
        {
          name: "QR Code",
          path: "/product/" + to.params.productId + "/qr-code",
        },
      ];
    },
  },
  {
    path: "/products/:productId",
    component: () => import("../view/products/Product.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Produkte", path: "/products" },
        { name: "Produkt", path: "/product/" + to.params.productId },
      ];
    },
  },
  {
    path: "/models/:modelId/items",
    component: () => import("../view/ItemView.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Produkte", path: "/products/" },
        { name: "Produkt", path: "/products/" + to.params.modelId },
        {
          name: "Artikel",
          path: "/models/" + to.params.modelId + "/items",
        },
      ];
    },
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
  {
    path: "/organizations",
    component: () => import("../view/organizations/SelectOrganizationView.vue"),
    beforeEnter: () => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Organisationen", path: "/organizations" },
      ];
    },
  },
  {
    path: "/organizations/create",
    component: () => import("../view/organizations/CreateOrganizationView.vue"),
    beforeEnter: () => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Organisationen", path: "/organizations" },
      ];
    },
  },
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
