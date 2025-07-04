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

describe("<ModelView />", () => {
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
      type: DataFieldType.PRODUCT_PASSPORT_LINK,
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

    const dataField3: DataFieldDto = {
      id: "f3",
      type: DataFieldType.TEXT_FIELD,
      name: "Neuer Title 3 auf Itemebene",
      options: {
        min: 2,
      },
      layout: {
        colStart: { sm: 2 },
        colSpan: { sm: 1 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      granularityLevel: GranularityLevel.ITEM,
    };

    const section1: SectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      name: "Technische Spezifikation",
      parentId: undefined,
      subSections: ["s1-1"],
      dataFields: [dataField1, dataField2, dataField3],
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
      id: "s2",
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
      granularityLevel: GranularityLevel.MODEL,
    };

    const section3: SectionDto = {
      id: "s3",
      type: SectionType.REPEATABLE,
      name: "Footprints",
      subSections: [],
      dataFields: [dataField21],
      layout: {
        cols: { sm: 3 },
        colStart: { sm: 1 },
        colSpan: { sm: 3 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      granularityLevel: GranularityLevel.ITEM,
    };

    // see: https://on.cypress.io/mounting-vue
    const productDataModel: ProductDataModelDto = {
      id: "pdm1",
      name: "Laptop neu",
      version: "1.0",
      visibility: VisibilityLevel.PRIVATE,
      createdByUserId: "userId",
      ownedByOrganizationId: "ownedByOrganizationId",
      sections: [section1, section2, section3],
    };

    const uuidToOtherPassport = "uuid1";

    const model = {
      id: "someId",
      name: "My model",
      dataValues: [
        { value: "val1", dataFieldId: "f1", dataSectionId: "s1", row: 0 },
        {
          value: uuidToOtherPassport,
          dataFieldId: "f2",
          dataSectionId: "s1",
          row: 0,
        },
      ],
      productDataModelId: productDataModel.id,
      uniqueProductIdentifiers: [
        {
          uuid: "own-uuid",
          referenceId: "someId",
        },
      ],
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
          value: uuidToOtherPassport,
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

    const refernceMock = {
      id: "ref1",
      modelId: "modelId",
      organizationId: orgaId,
      granularityLevel: GranularityLevel.ITEM,
    };

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/unique-product-identifiers/${uuidToOtherPassport}/reference`,
      {
        statusCode: 200,
        body: refernceMock, // Mock response
      },
    ).as("getUniqueProductIdentifierReference");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.mountWithPinia(ModelView, { router });

    cy.wrap(router.push(`/organizations/${orgaId}/models/${model.id}`));

    cy.wait("@getModel").its("response.statusCode").should("eq", 200);
    cy.wait("@getProductModelData")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Modellpass Informationen").should("be.visible");
    cy.contains("own-uuid").should("be.visible");
    cy.get('[data-cy="section-card-s3"]').within(() => {
      cy.contains("Wird auf Artikelebene gesetzt").should("be.visible");
      cy.contains("Speichern").should("not.exist");
    });
    cy.get('[data-cy="s1.f1.0"]').should("have.value", "val1");
    cy.get('[data-cy="s1.f2.0"]').should("have.value", uuidToOtherPassport);
    cy.get('[data-cy="s1.f3.0"]').should(
      "contain.text",
      "Wird auf Artikelebene gesetzt",
    );
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
        { dataSectionId: "s1", dataFieldId: "f2", value: "uuid1add2", row: 0 },
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
        cy.get('[data-cy="s1.f2.0"]').should("have.value", uuidToOtherPassport);
        cy.spy(router, "push").as("pushSpy");
        cy.contains("Referenz nicht gesetzt").should("be.visible");
        cy.get('[data-cy="Visit s1.f2.0"]').click();
        cy.wait("@getUniqueProductIdentifierReference")
          .its("response.statusCode")
          .should("eq", 200);
        cy.get("@pushSpy").should(
          "have.been.calledWith",
          `/organizations/${orgaId}/models/${refernceMock.modelId}/items/${refernceMock.id}`,
        );
      });
    });
  });
});
