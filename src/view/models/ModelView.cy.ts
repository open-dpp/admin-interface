import ModelView from "./ModelView.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldDto,
  DataFieldRefDto,
  DataFieldType,
  NodeType,
  ProductDataModelDto,
  SectionDto,
  SectionGridDto,
  SectionType,
  TargetGroup,
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
    };
    const dataFieldRef1: DataFieldRefDto = {
      id: "df1",
      children: [],
      type: NodeType.DATA_FIELD_REF,
      fieldId: dataField1.id,
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
    };
    const dataField2: DataFieldDto = {
      id: "f2",
      type: DataFieldType.TEXT_FIELD,
      name: "Neuer Title 2",
      options: {
        min: 2,
      },
    };
    const dataFieldRef2: DataFieldRefDto = {
      id: "df2",
      children: [],
      type: NodeType.DATA_FIELD_REF,
      fieldId: dataField2.id,
      colStart: { sm: 2 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
    };
    const section1: SectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      name: "Technische Spezifikation",
      parentId: undefined,
      subSections: ["s1.1"],
      dataFields: [dataField1, dataField2],
    };

    const sectionGrid: SectionGridDto = {
      id: "sg1",
      type: NodeType.SECTION_GRID,
      cols: { sm: 3 },
      colStart: { sm: 1 },
      colSpan: { sm: 3 },
      sectionId: section1.id,
      children: [dataFieldRef1.id, dataFieldRef2.id],
    };

    const dataField21: DataFieldDto = {
      id: "f1.1",
      type: DataFieldType.TEXT_FIELD,
      name: "Größe",
      options: {
        min: 24,
      },
    };

    const dataFieldRef21: DataFieldRefDto = {
      id: "df1.1",
      children: [],
      type: NodeType.DATA_FIELD_REF,
      fieldId: dataField21.id,
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
    };

    const section2 = {
      id: "s1.1",
      type: SectionType.REPEATABLE,
      name: "Dimensions",
      parentId: "s1",
      subSections: [],
      dataFields: [dataField21],
    };

    const sectionGrid2: SectionGridDto = {
      id: "sg2",
      type: NodeType.SECTION_GRID,
      cols: { sm: 3 },
      colStart: { sm: 1 },
      colSpan: { sm: 3 },
      sectionId: section2.id,
      children: [dataFieldRef21.id],
    };

    // see: https://on.cypress.io/mounting-vue
    const productDataModel: ProductDataModelDto = {
      data: {
        id: "pdm1",
        name: "Laptop neu",
        version: "1.0",
        visibility: VisibilityLevel.PRIVATE,
        createdByUserId: "userId",
        ownedByOrganizationId: "ownedByOrganizationId",
        sections: [section1, section2],
      },
      view: {
        id: "viewId",
        version: "1.0",
        dataModelId: "pdm1",
        targetGroup: TargetGroup.ALL,
        nodes: [
          sectionGrid,
          dataFieldRef1,
          dataFieldRef2,
          sectionGrid2,
          dataFieldRef21,
        ],
      },
    };
    const model = {
      id: "someId",
      name: "My model",
      dataValues: [
        { id: "d1", value: "val1", dataFieldId: "f1", dataSectionId: "s1" },
        { id: "d2", value: "val2", dataFieldId: "f2", dataSectionId: "s1" },
      ],
      productDataModelId: productDataModel.data.id,
    };

    const otherModel = {
      id: "otherId",
      name: "My other model",
      dataValues: [
        {
          id: "otherD1",
          value: "otherVal1",
          dataFieldId: "f1",
          dataSectionId: "s1",
        },
        {
          id: "otherD2",
          value: "otherVal2",
          dataFieldId: "f2",
          dataSectionId: "s1",
        },
      ],
      productDataModelId: productDataModel.data.id,
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
      `${API_URL}/product-data-models/${productDataModel.data.id}`,
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
      cy.wrap(
        router.push(`/organizations/${orgaId}/models/${otherModel.id}`),
      ).then(() => {
        cy.wait("@getModel").its("response.statusCode").should("eq", 200);
        cy.wait("@getProductModelData")
          .its("response.statusCode")
          .should("eq", 200);
        cy.get('[data-cy="otherD1"]').should("have.value", "otherVal1");
        cy.get('[data-cy="otherD2"]').should("have.value", "otherVal2");
      });
    });
  });
});
