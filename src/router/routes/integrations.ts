import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";
import { organizationBreadcrumbs } from "./organizations";
import { PRO_ALPHA_INTEGRATION_ID } from "../../const";

export const integrationBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...organizationBreadcrumbs(to),
  {
    name: "Integrationen",
    route: INTEGRATIONS,
    params: to.params,
  },
];

const proAlphaBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...integrationBreadcrumbs(to),
  {
    name: "Proalpha",
    route: PRO_ALPHA_INTEGRATION,
    params: to.params,
  },
];

export const CONNECTION_CREATE: RouteRecordRaw = {
  path: `${PRO_ALPHA_INTEGRATION_ID}/create`,
  name: "Verbindung erstellen",
  component: () => import("../../view/integrations/CreateConnectionView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      ...proAlphaBreadcrumbs(to),
      {
        name: "Erstellen",
        route: CONNECTION_CREATE,
        params: to.params,
      },
    ];
  },
};

export const PRO_ALPHA_INTEGRATION: RouteRecordRaw = {
  path: PRO_ALPHA_INTEGRATION_ID,
  name: "Proalpha Integration",
  component: () => import("../../view/integrations/ConnectionListView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = proAlphaBreadcrumbs(to);
  },
};

export const INTEGRATIONS: RouteRecordRaw = {
  path: "",
  name: "Integrationen",
  component: () => import("../../view/integrations/IntegrationView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = integrationBreadcrumbs(to);
  },
};

// const PRO_ALPHA_INTEGRATION: RouteRecordRaw = {
//   path: PRO_ALPHA_INTEGRATION_ID,
//   name: "Proalpha Integration",
// };

export const ORGANIZATION_INTEGRATIONS_PARENT: RouteRecordRaw = {
  path: "integrations",
  children: [INTEGRATIONS, PRO_ALPHA_INTEGRATION],
};
