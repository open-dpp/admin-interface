import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldDto,
  DataFieldType,
  GranularityLevel,
  ItemDto,
  SectionDto,
  SectionType,
  TemplateDto,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import ItemView from "./ItemView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<ItemView />", () => {
  it("renders model form and modify its data", async () => {
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
      granularityLevel: GranularityLevel.ITEM,
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
      granularityLevel: GranularityLevel.ITEM,
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
      granularityLevel: GranularityLevel.MODEL,
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
      granularityLevel: GranularityLevel.ITEM,
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
      granularityLevel: GranularityLevel.ITEM,
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
      granularityLevel: GranularityLevel.MODEL,
    };

    // see: https://on.cypress.io/mounting-vue
    const templateDto: TemplateDto = {
      id: "pdm1",
      name: "Laptop neu",
      version: "1.0",
      createdByUserId: "userId",
      ownedByOrganizationId: "ownedByOrganizationId",
      sections: [section1, section2, section3],
    };
    const item = {
      id: "someId",
      dataValues: [
        { value: "val1", dataFieldId: "f1", dataSectionId: "s1", row: 0 },
        { value: "val2", dataFieldId: "f2", dataSectionId: "s1", row: 0 },
      ],
      productDataModelId: templateDto.id,
      uniqueProductIdentifiers: [
        {
          uuid: "uuid",
          referenceId: "someId",
        },
      ],
    };

    const otherItem: ItemDto = {
      id: "otherId",
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
      templateId: templateDto.id,
      uniqueProductIdentifiers: [
        {
          uuid: "uuid",
          referenceId: "ref1",
        },
      ],
    };

    const orgaId = "orga1";
    const modelId = "model1";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/models/${modelId}/items/*`,
      (req) => {
        const itemId = req.url.split("/").pop();
        req.reply({
          statusCode: 200,
          body: itemId === item.id ? item : otherItem, // Mock response
        });
      },
    ).as("getItem");

    cy.intercept("GET", `${API_URL}/templates/${templateDto.id}`, {
      statusCode: 200,
      body: templateDto, // Mock response
    }).as("getProductModelData");

    cy.intercept(
      "PATCH",
      `${API_URL}/organizations/${orgaId}/models/${modelId}/items/${item.id}/data-values`,
      {
        statusCode: 200,
        body: item, // Mock response
      },
    ).as("updateData");
    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/models/${modelId}`,
      {
        statusCode: 200,
        body: { id: modelId },
      },
    );

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.mountWithPinia(ItemView, { router });
    cy.wrap(
      router.push(
        `/organizations/${orgaId}/models/${modelId}/items/${item.id}`,
      ),
    ).then(() => {
      cy.wait("@getItem").its("response.statusCode").should("eq", 200);
      cy.wait("@getProductModelData")
        .its("response.statusCode")
        .should("eq", 200);
      cy.contains("Artikelpass Informationen").should("be.visible");

      cy.contains("Artikel mit ID uuid").should("be.visible");

      cy.get('[data-cy="section-card-s3"]').within(() => {
        cy.contains("Wird auf Modelebene gesetzt").should("be.visible");
        cy.contains("Speichern").should("not.exist");
      });
      cy.get('[data-cy="s1.f1.0"]').should("have.value", "val1");
      cy.get('[data-cy="s1.f2.0"]').should("have.value", "val2");
      cy.get('[data-cy="s1.f3.0"]').should(
        "contain.text",
        "Wird auf Modelebene gesetzt",
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
          { dataSectionId: "s1", dataFieldId: "f2", value: "val2add2", row: 0 },
        ]);
        expect(interceptor.response?.statusCode).to.equal(200);
        cy.wrap(
          router.push(
            `/organizations/${orgaId}/models/${modelId}/items/${otherItem.id}`,
          ),
        ).then(() => {
          cy.wait("@getItem").its("response.statusCode").should("eq", 200);
          cy.wait("@getProductModelData")
            .its("response.statusCode")
            .should("eq", 200);
          cy.get('[data-cy="s1.f1.0"]').should("have.value", "otherVal1");
          cy.get('[data-cy="s1.f2.0"]').should("have.value", "otherVal2");
        });
      });
    });
  });
});
