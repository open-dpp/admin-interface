import ModelView from "./ModelView.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import { ProductDataModelDto, SectionType } from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<Model />", () => {
  it("renders items and creates a new one", () => {
    // see: https://on.cypress.io/mounting-vue
    const productDataModel: ProductDataModelDto = {
      id: "pdm1",
      name: "Laptop neu",
      version: "1.0",
      sections: [
        {
          id: "s1",
          type: SectionType.GROUP,
          name: "Technische Spezifikation",
          dataFields: [
            {
              id: "f1",
              type: "TextField",
              name: "Prozessor",
              options: {
                min: 24,
              },
            },
            {
              id: "f2",
              type: "TextField",
              name: "Neuer Title 2",
              options: {
                min: 2,
              },
            },
          ],
        },
      ],
    };
    const model = {
      id: "someId",
      name: "My model",
      dataValues: [
        { id: "d1", value: "val1", dataFieldId: "f1", dataSectionId: "s1" },
        { id: "d2", value: "val2", dataFieldId: "f2", dataSectionId: "s1" },
      ],
      productDataModelId: productDataModel.id,
    };

    const orgaId = "orga1";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/models/${model.id}`,
      {
        statusCode: 200,
        body: model, // Mock response
      },
    ).as("getModel");

    cy.intercept(
      "GET",
      `${API_URL}/product-data-models/${productDataModel.id}`,
      {
        statusCode: 200,
        body: productDataModel, // Mock response
      },
    ).as("getProductModelData");

    cy.intercept(
      "PATCH",
      `${API_URL}/organizations/${orgaId}/models/${model.id}/data-values`,
      {
        statusCode: 200,
        body: model, // Mock response
      },
    ).as("updateData");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);
    cy.wrap(router.push(`/organizations/${orgaId}/models/${model.id}`));
    cy.mountWithPinia(ModelView, { router });
    cy.wait("@getModel").its("response.statusCode").should("eq", 200);
    cy.wait("@getProductModelData")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Modell Informationen").should("be.visible");
    cy.get('[data-cy="d1"]').should("have.value", "val1");
    cy.get('[data-cy="d2"]').should("have.value", "val2");
    cy.get('[data-cy="d1"]').type("add1");
    cy.get('[data-cy="d2"]').type("add2");
    cy.contains("button", "Speichern").click();
    cy.wait("@updateData").then((interceptor) => {
      expect(interceptor.request.body).to.deep.equal([
        {
          id: "d1",
          value: "val1add1",
        },
        { id: "d2", value: "val2add2" },
      ]);
      expect(interceptor.response?.statusCode).to.equal(200);
    });
  });
});
