import ItemView from "./ItemView.vue";
import { createRouter, createMemoryHistory } from "vue-router";

import { API_URL } from "../const.ts";

const testRoutes = [
  {
    path: "/models/:modelId/items",
    component: () => import("./ItemView.vue"),
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes: testRoutes,
});

describe("<ItemView />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    const data = [{ id: "i1" }];
    const modelId = "someId";
    cy.intercept("GET", `${API_URL}/models/${modelId}/items`, {
      statusCode: 200,
      body: { data }, // Mock response
    }).as("getData");

    cy.wrap(router.push(`/models/${modelId}/items`));
    cy.mount(ItemView, { router });
    cy.wait("@getData").its("response.statusCode").should("eq", 200);
    cy.contains("button", "Artikel hinzufügen").should("exist");
  });
});
