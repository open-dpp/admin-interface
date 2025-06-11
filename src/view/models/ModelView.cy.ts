import ModelView from "./ModelView.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldDto,
  DataFieldType,
  GranularityLevel,
  ProductDataModelDto,
  SectionDto,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<Model />", () => {
  it("renders model form and modify its data", () => {
    const dataField1: DataFieldDto = {
      id: "f1",
      type: DataFieldType.TEXT_FIELD,
      name: "Prozessor",
      options: {
        min: 24,
      },
      layout: {
        colStart: { sm: 1 },
        colSpan: { sm: 1 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      granularityLevel: GranularityLevel.MODEL,
    };
    const dataField2: DataFieldDto = {
      id: "f2",
      type: DataFieldType.TEXT_FIELD,
      name: "Neuer Title 2",
      options: {
        min: 2,
      },
      layout: {
        colStart: { sm: 2 },
        colSpan: { sm: 1 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      granularityLevel: GranularityLevel.MODEL,
    };

    const section1: SectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      name: "Technische Spezifikation",
      parentId: undefined,
      subSections: ["s1-1"],
      dataFields: [dataField1, dataField2],
      layout: {
        cols: { sm: 3 },
        colStart: { sm: 1 },
        colSpan: { sm: 3 },
        rowSpan: { sm: 1 },
        rowStart: { sm: 1 },
      },
    };

    const dataField21: DataFieldDto = {
      id: "f1-1",
      type: DataFieldType.TEXT_FIELD,
      name: "Größe",
      options: {
        min: 24,
      },
      layout: {
        colStart: { sm: 1 },
        colSpan: { sm: 1 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      granularityLevel: GranularityLevel.MODEL,
    };

    const section2 = {
      id: "s1-1",
      type: SectionType.REPEATABLE,
      name: "Dimensions",
      parentId: "s1",
      subSections: [],
      dataFields: [dataField21],
      layout: {
        cols: { sm: 3 },
        colStart: { sm: 1 },
        colSpan: { sm: 3 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
    };

    // see: https://on.cypress.io/mounting-vue
    const productDataModel: ProductDataModelDto = {
      id: "pdm1",
      name: "Laptop neu",
      version: "1.0",
      visibility: VisibilityLevel.PRIVATE,
      createdByUserId: "userId",
      ownedByOrganizationId: "ownedByOrganizationId",
      sections: [section1, section2],
    };
    const model = {
      id: "someId",
      name: "My model",
      dataValues: [
        { value: "val1", dataFieldId: "f1", dataSectionId: "s1", row: 0 },
        { value: "val2", dataFieldId: "f2", dataSectionId: "s1", row: 0 },
      ],
      productDataModelId: productDataModel.id,
    };

    const otherModel = {
      id: "otherId",
      name: "My other model",
      dataValues: [
        {
          value: "otherVal1",
          dataFieldId: "f1",
          dataSectionId: "s1",
          row: 0,
        },
        {
          value: "otherVal2",
          dataFieldId: "f2",
          dataSectionId: "s1",
          row: 0,
        },
      ],
      productDataModelId: productDataModel.id,
    };

    const orgaId = "orga1";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/models/*`,
      (req) => {
        const modelId = req.url.split("/").pop();
        req.reply({
          statusCode: 200,
          body: modelId === model.id ? model : otherModel, // Mock response
        });
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

    cy.mountWithPinia(ModelView, { router });
    cy.wrap(router.push(`/organizations/${orgaId}/models/${model.id}`));

    cy.wait("@getModel").its("response.statusCode").should("eq", 200);
    cy.wait("@getProductModelData")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Modellpass Informationen").should("be.visible");
    cy.get('[data-cy="s1.f1.0"]').should("have.value", "val1");
    cy.get('[data-cy="s1.f2.0"]').should("have.value", "val2");
    cy.get('[data-cy="s1.f1.0"]').type("add1");
    cy.get('[data-cy="s1.f2.0"]').type("add2");
    cy.contains("button", "Speichern").click();
    cy.wait("@updateData").then((interceptor) => {
      expect(interceptor.request.body).to.deep.equal([
        {
          dataSectionId: "s1",
          dataFieldId: "f1",
          value: "val1add1",
          row: 0,
        },
        { dataSectionId: "s1", dataFieldId: "f2", value: "val2add2", row: 0 },
      ]);
      expect(interceptor.response?.statusCode).to.equal(200);
      cy.wrap(
        router.push(`/organizations/${orgaId}/models/${otherModel.id}`),
      ).then(() => {
        cy.wait("@getModel").its("response.statusCode").should("eq", 200);
        cy.wait("@getProductModelData")
          .its("response.statusCode")
          .should("eq", 200);
        cy.get('[data-cy="s1.f1.0"]').should("have.value", "otherVal1");
        cy.get('[data-cy="s1.f2.0"]').should("have.value", "otherVal2");
      });
    });
  });
});
