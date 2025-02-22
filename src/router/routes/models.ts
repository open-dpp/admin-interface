import { RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";
import { useLayoutStore } from "../../stores/layout";
import { ITEMS_PARENT } from "./model-items";
import { ORGANIZATION, ORGANIZATIONS } from "./organizations";

// MODEL

export const ORGANIZATION_MODEL: RouteRecordRaw = {
  path: "",
  name: "OrganizationModel",
  component: () => import("../../view/models/ModelView.vue"),
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
    ];
  },
};

export const ORGANIZATION_MODEL_QRCODE: RouteRecordRaw = {
  path: "qr-code",
  name: "OrganizationModelsQrCode",
  component: () => import("../../view/models/ModelQrCode.vue"),
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
        name: "QR Code",
        route: ORGANIZATION_MODEL_QRCODE,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_MODEL_PARENT: RouteRecordRaw = {
  path: ":modelId",
  children: [ORGANIZATION_MODEL, ORGANIZATION_MODEL_QRCODE, ITEMS_PARENT],
};

// MODELS

export const ORGANIZATION_MODELS: RouteRecordRaw = {
  path: "",
  name: "OrganizationModels",
  component: () => import("../../view/models/Models.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      { name: "Organisationen", route: ORGANIZATIONS, params: to.params },
      {
        name: to.params.organizationId + "" || "Organisation",
        route: ORGANIZATION,
        params: to.params,
      },
      {
        name: "Modelle",
        route: ORGANIZATION_MODELS,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_MODELS_CREATE: RouteRecordRaw = {
  path: "create",
  name: "OrganizationModelsCreate",
  props: true,
  component: () => import("../../view/models/CreateModelView.vue"),
  beforeEnter: (to: RouteLocationNormalizedGeneric) => {
    const layoutStore = useLayoutStore();
    layoutStore.breadcrumbs = [
      {
        name: "Modelle",
        route: ORGANIZATION_MODELS,
        params: to.params,
      },
      {
        name: "Erstellen",
        route: ORGANIZATION_MODELS_CREATE,
        params: to.params,
      },
    ];
  },
};

export const ORGANIZATION_MODELS_PARENT: RouteRecordRaw = {
  path: "models",
  children: [
    ORGANIZATION_MODELS,
    ORGANIZATION_MODELS_CREATE,
    ORGANIZATION_MODEL_PARENT,
  ],
};
