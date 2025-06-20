import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../../stores/layout";
import { organizationBreadcrumbs } from "../organizations";
import { useDraftStore } from "../../../stores/draft";

const draftListBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...organizationBreadcrumbs(),
  {
    name: "Produktpass Designs",
    route: DRAFT_LIST,
    params: to.params,
  },
];

export const draftBreadcrumbs = async (to: RouteLocationNormalizedGeneric) => {
  const draftId = String(to.params.draftId);
  const draftStore = useDraftStore();
  let draftName = draftStore.draft?.name;
  if (draftName === undefined) {
    await draftStore.fetchDraft(draftId);
    draftName = draftStore.draft?.name;
  }
  return [
    ...draftListBreadcrumbs(to),
    {
      name: draftName || draftId || "Datenmodellentwurf",
      route: DRAFT,
      params: to.params,
    },
  ];
};

export const DRAFT: RouteRecordRaw = {
  path: "",
  name: "Draft",
  component: () =>
    import("../../../view/product-data-model-drafts/DraftView.vue"),
  beforeEnter: async (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = await draftBreadcrumbs(to);
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
