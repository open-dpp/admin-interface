import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../../stores/layout";
import { organizationBreadcrumbs } from "../organizations";

const draftListBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...organizationBreadcrumbs(to),
  {
    name: "Produktpass Designs",
    route: DRAFT_LIST,
    params: to.params,
  },
];

export const draftBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...draftListBreadcrumbs(to),
  {
    name: to.params.draftId + "" || "Datenmodellentwurf",
    route: DRAFT,
    params: to.params,
  },
];

export const DRAFT: RouteRecordRaw = {
  path: "",
  name: "Draft",
  component: () =>
    import("../../../view/product-data-model-drafts/DraftView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = draftBreadcrumbs(to);
  },
};

export const DRAFT_LIST: RouteRecordRaw = {
  path: "",
  name: "Drafts",
  component: () =>
    import("../../../view/product-data-model-drafts/DraftListView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = draftListBreadcrumbs(to);
  },
};

export const DRAFT_CREATE: RouteRecordRaw = {
  path: "create",
  name: "DraftsCreate",
  props: true,
  component: () =>
    import("../../../view/product-data-model-drafts/CreateDraftView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      ...draftListBreadcrumbs(to),
      {
        name: "Erstellen",
        route: DRAFT_CREATE,
        params: to.params,
      },
    ];
  },
};

export const DRAFT_PARENT: RouteRecordRaw = {
  path: ":draftId",
  children: [DRAFT],
};

export const ORGANIZATION_DRAFTS_PARENT: RouteRecordRaw = {
  path: "data-model-drafts",
  children: [DRAFT_LIST, DRAFT_CREATE, DRAFT_PARENT],
};
