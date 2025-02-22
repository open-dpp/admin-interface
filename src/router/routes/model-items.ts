import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";
import { ORGANIZATION_MODEL, ORGANIZATION_MODELS } from "./models";

export const ITEM: RouteRecordRaw = {
  path: "",
  name: "OrganizationModelsItem",
  component: () => import("../../view/items/ItemQrCode.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      {
        name: "Modelle",
        route: ORGANIZATION_MODELS,
        params: to.params,
      },
      {
        name: to.params.modelId + "" || "Modell",
        route: ORGANIZATION_MODEL,
        params: to.params,
      },
      {
        name: "Artikel Liste",
        route: MODEL_ITEMS,
        params: to.params,
      },
      {
        name: "Artikel",
        route: ITEM,
        params: to.params,
      },
    ];
  },
};

export const ITEM_QRCODE: RouteRecordRaw = {
  path: "qr-code",
  name: "OrganizationModelsItemQrCode",
  component: () => import("../../view/items/ItemQrCode.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      {
        name: "Modelle",
        route: ORGANIZATION_MODELS,
        params: to.params,
      },
      {
        name: to.params.modelId + "" || "Modell",
        route: ORGANIZATION_MODEL,
        params: to.params,
      },
      {
        name: "Artikel Liste",
        route: MODEL_ITEMS,
        params: to.params,
      },
      {
        name: "Artikel",
        route: ITEM,
        params: to.params,
      },
    ];
  },
};

export const ITEM_PARENT: RouteRecordRaw = {
  path: ":itemId",
  children: [ITEM, ITEM_QRCODE],
};

export const MODEL_ITEMS: RouteRecordRaw = {
  path: "",
  name: "OrganizationModelsItems",
  component: () => import("../../view/items/ItemView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      {
        name: "Modelle",
        route: ORGANIZATION_MODELS,
        params: to.params,
      },
      {
        name: to.params.modelId + "" || "Modell",
        route: ORGANIZATION_MODEL,
        params: to.params,
      },
      {
        name: "Artikel Liste",
        route: MODEL_ITEMS,
        params: to.params,
      },
    ];
  },
};

export const ITEMS_PARENT: RouteRecordRaw = {
  path: "items",
  children: [MODEL_ITEMS, ITEM_PARENT],
};
