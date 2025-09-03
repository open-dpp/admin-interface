import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";

export const analyticsBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  {
    name: "Auswertungen",
    route: Analytics,
    params: to.params,
  },
];

export const Analytics: RouteRecordRaw = {
  path: "",
  name: "Auswertungen",
  props: true,
  component: () => import("../../view/analytics/AnalyticsView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = analyticsBreadcrumbs(to);
  },
};

export const ORGANIZATION_ANALYTICS_PARENT: RouteRecordRaw = {
  path: "analytics",
  children: [Analytics],
};
