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
  {
    path: "/users",
    component: () =>
      import("../view/organizations/OrganizationMembersView.vue"),
  },
  { path: "/settings", component: () => import("../view/Settings.vue") },
  {
    path: "/models",
    component: () => import("../view/models/Models.vue"),
    beforeEnter: () => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [{ name: "Modelle", path: "/models" }];
    },
  },
  {
    path: "/models/:modelId/qr-code",
    component: () => import("../view/models/ModelQrCode.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Modelle", path: "/models" },
        { name: "Modell", path: "/models/" + to.params.modelId },
        {
          name: "QR Code",
          path: "/models/" + to.params.modelId + "/qr-code",
        },
      ];
    },
  },
  {
    path: "/models/create",
    component: () => import("../view/models/CreateModelView.vue"),
    beforeEnter: () => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Modelle", path: "/models" },
        { name: "Erstellen", path: "#" },
      ];
    },
  },
  {
    path: "/models/:modelId",
    component: () => import("../view/models/Model.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Modelle", path: "/models" },
        {
          name: to.params.modelId + "" || "Modell",
          path: "/models/" + to.params.modelId,
        },
      ];
    },
  },
  {
    path: "/models/:modelId/items",
    component: () => import("../view/items/ItemView.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Modelle", path: "/models/" },
        { name: "Modell", path: "/models/" + to.params.modelId },
        {
          name: "Artikel Liste",
          path: "/models/" + to.params.modelId + "/items",
        },
      ];
    },
  },
  {
    path: "/models/:modelId/items/:itemId/qr-code",
    component: () => import("../view/items/ItemQrCode.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Modelle", path: "/models/" },
        { name: "Modell", path: "/models/" + to.params.modelId },
        {
          name: "Artikel Liste",
          path: "/models/" + to.params.modelId + "/items",
        },
        {
          name: "Artikel",
          path: `/models/${to.params.modelId}/items/${to.params.itemId}`,
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
  {
    path: "/organizations/:organizationId",
    props: true,
    component: () => import("../view/organizations/OrganizationView.vue"),
    beforeEnter: (to: RouteLocationNormalizedGeneric) => {
      const layoutStore = useLayoutStore();
      layoutStore.breadcrumbs = [
        { name: "Organisationen", path: "/organizations" },
        {
          name: "Organisation",
          path: "/organizations/" + to.params.organizationId,
        },
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
