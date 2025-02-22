import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";
import { ORGANIZATION_MODELS_PARENT } from "./models";

export const ORGANIZATIONS: RouteRecordRaw = {
  path: "",
  name: "Organizations",
  component: () =>
    import("../../view/organizations/SelectOrganizationView.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      { name: "Organisationen", route: ORGANIZATIONS },
    ];
  },
};

export const ORGANIZATION_CREATE: RouteRecordRaw = {
  path: "create",
  name: "OrganizationCreate",
  component: () =>
    import("../../view/organizations/CreateOrganizationView.vue"),
  beforeEnter: () => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      { name: "Organisationen", route: ORGANIZATIONS },
    ];
  },
};

export const ORGANIZATION: RouteRecordRaw = {
  path: "",
  name: "Organization",
  props: true,
  component: () => import("../../view/organizations/OrganizationView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      { name: "Organisationen", route: ORGANIZATIONS },
      {
        name: to.params.organizationId + "" || "Organisation",
        route: ORGANIZATION,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_MEMBERS: RouteRecordRaw = {
  path: "members",
  name: "OrganizationMembers",
  props: true,
  component: () =>
    import("../../view/organizations/OrganizationMembersView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      { name: "Organisationen", route: ORGANIZATIONS },
      {
        name: to.params.organizationId + "" || "Organisation",
        route: ORGANIZATION,
        params: to.params,
      },
      {
        name: "Mitglieder",
        route: ORGANIZATION_MEMBERS,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_PARENT: RouteRecordRaw = {
  path: ":organizationId",
  children: [ORGANIZATION, ORGANIZATION_MEMBERS, ORGANIZATION_MODELS_PARENT],
};

export const ORGANIZATIONS_PARENT: RouteRecordRaw = {
  path: "/organizations",
  children: [ORGANIZATIONS, ORGANIZATION_CREATE, ORGANIZATION_PARENT],
};

export const ORGANIZATION_ROUTES = [ORGANIZATIONS_PARENT];
