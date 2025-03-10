import { createMemoryHistory, createRouter } from "vue-router";

import { config } from "../../const";
import { routes } from "../../router";
import CreateModelView from "./CreateModelView.vue";
import { useIndexStore } from "../../stores";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<CreateModelVew />", () => {
  it("creates model with selected product data model", () => {
    const laptopModel = { name: "Laptop neu", id: "id1" };
    const phoneModel = { name: "Handy", id: "id2" };

    cy.intercept("GET", `${config.API_URL}/product-data-models`, {
      statusCode: 200,
      body: [laptopModel, phoneModel], // Mock response
    }).as("getProductDataModels");

    const modelId = "mid1";
    const orgaId = "orgaId";
    cy.intercept("POST", `${config.API_URL}/organizations/${orgaId}/models`, {
      statusCode: 201,
      body: { id: modelId }, // Mock response
    }).as("createModel");

    cy.intercept(
      "POST",
      `${config.API_URL}/organizations/${orgaId}/models/${modelId}/product-data-models/${phoneModel.id}`,
      {
        statusCode: 200,
        body: { id: modelId, productDataModelId: "p1" }, // Mock response
      },
    ).as("assignProductDataModel");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);
    cy.wrap(router.push(`/organizations/${orgaId}/models/create`));
    cy.spy(router, "push").as("pushSpy");
    cy.mountWithPinia(CreateModelView, {
      props: { organizationId: orgaId },
      router,
    });
    cy.wait("@getProductDataModels")
      .its("response.statusCode")
      .should("eq", 200);
    cy.get('[data-cy="name"]').type("My first model");
    cy.get('[data-cy="productDataModelId"]').select(phoneModel.name);
    cy.contains("button", "Erstellen").click();
    cy.wait("@createModel")
      .its("request.body")
      .should("deep.equal", { name: "My first model" });
    cy.wait("@assignProductDataModel")
      .its("response.statusCode")
      .should("eq", 200);
    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/models`,
    );
  });
});
