import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../../stores/layout";
import { draftBreadcrumbs } from "./drafts";

export const dataFieldBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...draftBreadcrumbs(to),
  {
    name: "Datenfeld",
    route: DATA_FIELD,
    params: to.params,
  },
];

export const DATA_FIELD: RouteRecordRaw = {
  path: "",
  name: "DataField",
  component: () =>
    import("../../../view/product-data-model-drafts/DataFieldView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = dataFieldBreadcrumbs(to);
  },
};

export const DATA_FIELD_PARENT: RouteRecordRaw = {
  path: ":dataFieldId",
  children: [DATA_FIELD],
};

export const DATA_FIELDS_PARENT: RouteRecordRaw = {
  path: "data-fields",
  children: [DATA_FIELD_PARENT],
};
