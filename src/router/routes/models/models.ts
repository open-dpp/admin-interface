import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../../stores/layout";
import { ITEMS_PARENT } from "./items";
import { organizationBreadcrumbs } from "../organizations";

const modelListBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...organizationBreadcrumbs(to),
  {
    name: "Modelle",
    route: MODEL_LIST,
    params: to.params,
  },
];

export const modelBreadcrumbs = (to: RouteLocationNormalizedGeneric) => [
  ...modelListBreadcrumbs(to),
  {
    name: to.params.modelId + "" || "Modell",
    route: MODEL,
    params: to.params,
  },
];

export const MODEL: RouteRecordRaw = {
  path: "",
  name: "Model",
  component: () => import("../../../view/models/ModelView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = modelBreadcrumbs(to);
  },
};

export const MODEL_QRCODE: RouteRecordRaw = {
  path: "qr-code",
  name: "ModelQrCode",
  component: () => import("../../../view/models/ModelQrCode.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      ...modelBreadcrumbs(to),
      {
        name: "QR Code",
        route: MODEL_QRCODE,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_MODEL_PARENT: RouteRecordRaw = {
  path: ":modelId",
  children: [MODEL, MODEL_QRCODE, ITEMS_PARENT],
};

// MODELS

export const MODEL_LIST: RouteRecordRaw = {
  path: "",
  name: "Models",
  component: () => import("../../../view/models/Models.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = modelListBreadcrumbs(to);
  },
};

export const MODEL_CREATE: RouteRecordRaw = {
  path: "create",
  name: "ModelCreate",
  props: true,
  component: () => import("../../../view/models/CreateModelView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      ...modelListBreadcrumbs(to),
      {
        name: "Erstellen",
        route: MODEL_CREATE,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_MODELS_PARENT: RouteRecordRaw = {
  path: "models",
  children: [MODEL_LIST, MODEL_CREATE, ORGANIZATION_MODEL_PARENT],
};
