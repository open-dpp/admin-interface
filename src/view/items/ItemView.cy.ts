import ItemView from "./ItemView.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import Item from "../../types/Item";
import { routes } from "../../router";
import { useIndexStore } from "../../stores";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<ItemView />", () => {
  it("renders items and creates a new one", () => {
    // see: https://on.cypress.io/mounting-vue
    const data = [{ id: "i1" }];
    const modelId = "someId";
    const orgaId = "orgaId";
    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/models/${modelId}/items`,
      {
        statusCode: 200,
        body: data, // Mock response
      },
    ).as("getData");

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/models/${modelId}/items`,
      {
        statusCode: 201,
        body: data, // Mock response
      },
    ).as("createData");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);
    cy.wrap(router.push(`/organizations/${orgaId}/models/${modelId}/items`));

    cy.mountWithPinia(ItemView, { router });
    cy.wait("@getData").its("response.statusCode").should("eq", 200);
    cy.contains("Alle erstellten Artikel").should("be.visible");
    cy.contains("QR-Code").should("be.visible");
    cy.contains("button", "Artikel hinzufügen").click();

    cy.wait("@createData").its("response.statusCode").should("eq", 201);
    cy.wait("@getData").its("response.statusCode").should("eq", 200);
  });

  it("should fetch empty items on render and create first item", async () => {
    const data: Item[] = [];
    const modelId = "someId";
    const orgaId = "orgaId";
    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/models/${modelId}/items`,
      {
        statusCode: 200,
        body: data, // Mock response
      },
    ).as("getData");

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/models/${modelId}/items`,
      {
        statusCode: 201,
        body: data, // Mock response
      },
    ).as("createData");

    cy.wrap(router.push(`/organizations/${orgaId}/models/${modelId}/items`));
    cy.mountWithPinia(ItemView, { router });
    cy.wait("@getData").its("response.statusCode").should("eq", 200);
    cy.contains("Neuen Artikel hinzufügen").click();

    cy.wait("@createData").its("response.statusCode").should("eq", 201);
    cy.wait("@getData").its("response.statusCode").should("eq", 200);
  });
});
