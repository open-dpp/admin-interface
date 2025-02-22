import { RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";

export const DASHBOARD: RouteRecordRaw = {
  path: "/",
  name: "Dashboard",
  component: () => import("../../view/Dashboard.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [{ name: "Dashboard", route: DASHBOARD }];
  },
};

export const SETTINGS: RouteRecordRaw = {
  path: "/settings",
  name: "Settings",
  component: () => import("../../view/Settings.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [{ name: "Settings", route: SETTINGS }];
  },
};

export const NOTIFICATIONS: RouteRecordRaw = {
  path: "/notifications",
  name: "Notifications",
  component: () => import("../../view/Notifications.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [{ name: "Notifications", route: NOTIFICATIONS }];
  },
};

export const NEWS: RouteRecordRaw = {
  path: "/news",
  name: "News",
  component: () => import("../../view/News.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [{ name: "News", route: NEWS }];
  },
};

export const FILES: RouteRecordRaw = {
  path: "/files",
  name: "Files",
  component: () => import("../../view/Files.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [{ name: "Dateien", route: FILES }];
  },
};

export const STATS: RouteRecordRaw = {
  path: "/stats",
  name: "Stats",
  component: () => import("../../view/Stats.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [{ name: "Stats", route: STATS }];
  },
};

export const BASE_ROUTES = [
  DASHBOARD,
  SETTINGS,
  NOTIFICATIONS,
  NEWS,
  FILES,
  STATS,
];
