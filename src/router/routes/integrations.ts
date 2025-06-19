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

const aasConnectionsBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...integrationBreadcrumbs(to),
  {
    name: "Proalpha",
    route: AAS_CONNECTIONS,
    params: to.params,
  },
];

export const INTEGRATIONS: RouteRecordRaw = {
  path: "",
  name: "Integrationen",
  component: () => import("../../view/integrations/IntegrationView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = integrationBreadcrumbs(to);
  },
};

export const AAS_CONNECTIONS: RouteRecordRaw = {
  path: "",
  name: "Verbindungen",
  component: () => import("../../view/integrations/ConnectionListView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = aasConnectionsBreadcrumbs(to);
  },
};

export const AAS_CONNECTION_CREATE: RouteRecordRaw = {
  path: "create",
  name: "Verbindung erstellen",
  component: () => import("../../view/integrations/CreateConnectionView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      ...aasConnectionsBreadcrumbs(to),
      {
        name: "Erstellen",
        route: AAS_CONNECTION_CREATE,
        params: to.params,
      },
    ];
  },
};

const PRO_ALPHA_INTEGRATION_PARENT: RouteRecordRaw = {
  path: `${PRO_ALPHA_INTEGRATION_ID}/connections`,
  children: [AAS_CONNECTIONS, AAS_CONNECTION_CREATE],
};

export const ORGANIZATION_INTEGRATIONS_PARENT: RouteRecordRaw = {
  path: "integrations",
  children: [INTEGRATIONS, PRO_ALPHA_INTEGRATION_PARENT],
};
