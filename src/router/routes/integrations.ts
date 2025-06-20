import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";

export const integrationBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  {
    name: "Integrationen",
    route: INTEGRATIONS,
    params: to.params,
  },
];

export const INTEGRATIONS: RouteRecordRaw = {
  path: "",
  name: "Integrationen",
  props: true,
  component: () => import("../../view/underConstruction/IntegrationDummy.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = integrationBreadcrumbs(to);
  },
};

export const ORGANIZATION_INTEGRATIONS_PARENT: RouteRecordRaw = {
  path: "integrations",
  children: [INTEGRATIONS],
};
