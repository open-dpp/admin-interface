import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL, PRO_ALPHA_INTEGRATION_ID } from "../../const";
import { routes } from "../../router";
import {
  AasConnectionDto,
  AasPropertyWithParentDto,
  AssetAdministrationShellType,
  DataFieldType,
  GranularityLevel,
  ProductDataModelDto,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import ConnectionView from "./ConnectionView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<ConnectionView />", () => {
  it("renders connection and modifies it", () => {
    const dataFieldId1 = "f1";
    const dataFieldId2 = "f2";
    const sectionId1 = "s1";
    const sectionId2 = "s2";
    const aasConnection: AasConnectionDto = {
      id: "con1",
      name: "Connection 1",
      modelId: "modelId",
      aasType: AssetAdministrationShellType.Truck,
      dataModelId: "dataModelId",
      fieldAssignments: [
        {
          dataFieldId: dataFieldId1,
          sectionId: sectionId1,
          idShortParent: "p1",
          idShort: "i1",
        },
        {
          dataFieldId: dataFieldId2,
          sectionId: sectionId2,
          idShortParent: "p2",
          idShort: "i2",
        },
      ],
    };
    const mockedProperties: AasPropertyWithParentDto[] = [
      {
        parentIdShort: "p1",
        property: {
          idShort: "i1",
          valueType: "xs:string",
          modelType: "Property",
        },
      },
      {
        parentIdShort: "p2",
        property: {
          idShort: "i2",
          valueType: "xs:string",
          modelType: "Property",
        },
      },
    ];

    const productDataModel: ProductDataModelDto = {
      id: "dataModelId",
      name: "Test Product Data Model",
      version: "1.0.0",
      visibility: VisibilityLevel.PRIVATE,
      createdByUserId: "userId",
      ownedByOrganizationId: "orgaId",
      sections: [
        {
          id: "s0",
          name: "Section 0",
          type: SectionType.GROUP,
          subSections: ["s2"],
          layout: {
            colStart: { sm: 1 },
            rowStart: { sm: 1 },
            colSpan: { sm: 1 },
            rowSpan: { sm: 1 },
            cols: { sm: 3 },
          },
          dataFields: [
            {
              id: "f0",
              name: "Field 0",
              type: DataFieldType.TEXT_FIELD,
              layout: {
                colStart: { sm: 1 },
                rowStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowSpan: { sm: 1 },
              },
              granularityLevel: GranularityLevel.ITEM,
            },
          ],
        },
        {
          id: sectionId1,
          name: "Section 1",
          type: SectionType.GROUP,
          subSections: [],
          layout: {
            colStart: { sm: 1 },
            rowStart: { sm: 1 },
            colSpan: { sm: 1 },
            rowSpan: { sm: 1 },
            cols: { sm: 3 },
          },
          dataFields: [
            {
              id: dataFieldId1,
              name: "Field 1",
              type: DataFieldType.TEXT_FIELD,
              layout: {
                colStart: { sm: 1 },
                rowStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowSpan: { sm: 1 },
              },
              granularityLevel: GranularityLevel.ITEM,
            },
          ],
        },
        {
          id: sectionId2,
          parentId: "s0",
          name: "Section 2",
          type: SectionType.GROUP,
          subSections: [],
          layout: {
            colStart: { sm: 1 },
            rowStart: { sm: 1 },
            colSpan: { sm: 1 },
            rowSpan: { sm: 1 },
            cols: { sm: 3 },
          },
          dataFields: [
            {
              id: dataFieldId2,
              name: "Field 2",
              type: DataFieldType.TEXT_FIELD,
              layout: {
                colStart: { sm: 1 },
                rowStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowSpan: { sm: 1 },
              },
              granularityLevel: GranularityLevel.ITEM,
            },
            {
              id: "f3",
              name: "Field 3",
              type: DataFieldType.TEXT_FIELD,
              layout: {
                colStart: { sm: 2 },
                rowStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowSpan: { sm: 1 },
              },
              granularityLevel: GranularityLevel.ITEM,
            },
            {
              id: "f4",
              name: "Field 4",
              type: DataFieldType.TEXT_FIELD,
              layout: {
                colStart: { sm: 3 },
                rowStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowSpan: { sm: 1 },
              },
              granularityLevel: GranularityLevel.MODEL,
            },
          ],
        },
      ],
    };

    const orgaId = "orgaId";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/integration/aas/connections/${aasConnection.id}`,
      {
        statusCode: 200,
        body: aasConnection, // Mock response
      },
    ).as("getConnection");

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/integration/aas/${aasConnection.aasType}/properties`,
      {
        statusCode: 200,
        body: mockedProperties, // Mock response
      },
    ).as("getAasProperties");

    cy.intercept(
      "GET",
      `${API_URL}/product-data-models/${productDataModel.id}`,
      {
        statusCode: 200,
        body: productDataModel, // Mock response
      },
    ).as("getProductDataModel");

    cy.intercept(
      "PATCH",
      `${API_URL}/organizations/${orgaId}/integration/aas/connections/${aasConnection.id}`,
      {
        statusCode: 200,
        body: aasConnection, // Mock response
      },
    ).as("modifyConnection");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.wrap(
      router.push(
        `/organizations/${orgaId}/integrations/${PRO_ALPHA_INTEGRATION_ID}/connections/${aasConnection.id}`,
      ),
    ).then(() => {
      cy.mountWithPinia(ConnectionView, { router });
      cy.wait("@getConnection").its("response.statusCode").should("eq", 200);
      cy.wait("@getAasProperties").its("response.statusCode").should("eq", 200);
      cy.wait("@getProductDataModel")
        .its("response.statusCode")
        .should("eq", 200);
      cy.contains("Verbindungsinformationen").should("be.visible");
      cy.get('[data-cy="aas-select-0"]').should("have.value", "p1/i1");
      cy.get('[data-cy="aas-select-1"]').should("have.value", "p2/i2");
      cy.get('[data-cy="aas-select-0"]').select("p2/i2");
      cy.get('[data-cy="aas-select-1"]').select("p1/i1");

      cy.get('[data-cy="dpp-select-0"]').should("have.value", "s1/f1");
      cy.get('[data-cy="dpp-select-1"]').should("have.value", "s2/f2");
      cy.get('[data-cy="dpp-select-0"]').select("s0/f0");
      cy.get('[data-cy="dpp-select-1"]').select("s2/f3");

      cy.contains("button", "Feldverknüpfung hinzufügen").click();
      cy.get('[data-cy="aas-select-2"]').select("p1/i1");
      cy.get('[data-cy="dpp-select-2"]').select("s1/f1");

      cy.contains("button", "Speichern").click();
      cy.wait("@modifyConnection").then(({ request }) => {
        const expected = {
          name: aasConnection.name,
          modelId: aasConnection.modelId,
          fieldAssignments: [
            {
              dataFieldId: "f0",
              sectionId: "s0",
              idShortParent: "p2",
              idShort: "i2",
            },
            {
              dataFieldId: "f3",
              sectionId: "s2",
              idShortParent: "p1",
              idShort: "i1",
            },
            {
              dataFieldId: "f1",
              sectionId: "s1",
              idShortParent: "p1",
              idShort: "i1",
            },
          ],
        };
        cy.expectDeepEqualWithDiff(request.body, expected);
      });
    });

    // cy.spy(router, "push").as("pushSpy");
  });
});
