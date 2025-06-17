import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";
import { organizationBreadcrumbs } from "./organizations";

export const statisticBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...organizationBreadcrumbs(to),
  {
    name: "Auswertungen",
    route: STATISTICS,
    params: to.params,
  },
];

export const STATISTICS: RouteRecordRaw = {
  path: "",
  name: "Auswertungen",
  props: true,
  component: () => import("../../view/underConstruction/StatisticDummy.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = statisticBreadcrumbs(to);
  },
};

export const ORGANIZATION_STATISTICS_PARENT: RouteRecordRaw = {
  path: "statistics",
  children: [STATISTICS],
};
