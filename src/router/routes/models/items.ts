import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../../stores/layout";
import { modelBreadcrumbs } from "./models";

const itemListBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...modelBreadcrumbs(to),
  {
    name: "Artikelpässe",
    route: ITEM_LIST,
    params: to.params,
  },
];

export const ITEM_LIST: RouteRecordRaw = {
  path: "",
  name: "OrganizationModelsItems",
  component: () => import("../../../view/items/ItemListView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = itemListBreadcrumbs(to);
  },
};

export const ITEM: RouteRecordRaw = {
  path: "",
  name: "Item",
  component: () => import("../../../view/items/ItemView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = itemListBreadcrumbs(to);
  },
};

export const ITEM_QRCODE: RouteRecordRaw = {
  path: "qr-code",
  name: "ItemQrCode",
  component: () => import("../../../view/items/ItemQrCode.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      ...itemListBreadcrumbs(to),
      {
        name: "Artikel",
        route: ITEM_QRCODE,
        params: to.params,
      },
    ];
  },
};

export const ITEM_PARENT: RouteRecordRaw = {
  path: ":itemId",
  children: [ITEM, ITEM_QRCODE],
};

export const ITEMS_PARENT: RouteRecordRaw = {
  path: "items",
  children: [ITEM_LIST, ITEM_PARENT],
};
