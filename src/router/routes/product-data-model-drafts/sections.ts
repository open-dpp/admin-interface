import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../../stores/layout";
import { draftBreadcrumbs } from "./drafts";
import { DATA_FIELDS_PARENT } from "./data.fields";

export const sectionBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...draftBreadcrumbs(to),
  {
    name: "Abschnitt",
    route: SECTION,
    params: to.params,
  },
];

export const SECTION: RouteRecordRaw = {
  path: "",
  name: "Section",
  component: () =>
    import("../../../view/product-data-model-drafts/SectionView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = sectionBreadcrumbs(to);
  },
};

export const SECTION_PARENT: RouteRecordRaw = {
  path: ":sectionId",
  children: [SECTION, DATA_FIELDS_PARENT],
};

export const SECTIONS_PARENT: RouteRecordRaw = {
  path: "sections",
  children: [SECTION_PARENT],
};
