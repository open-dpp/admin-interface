import ModelView from "./ModelView.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldDto,
  DataFieldType,
  DataSectionDto,
  GranularityLevel,
  ModelDto,
  ProductPassportDto,
  SectionType,
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
      granularityLevel: GranularityLevel.MODEL,
    };
    const dataField2: DataFieldDto = {
      id: "f2",
      type: DataFieldType.PRODUCT_PASSPORT_LINK,
      name: "Neuer Title 2",
      options: {
        min: 2,
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
      granularityLevel: GranularityLevel.ITEM,
    };
    const uuidToOtherPassport = "uuid1";

    const section1: DataSectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      name: "Technische Spezifikation",
      parentId: undefined,
      subSections: ["s1-1"],
      dataFields: [dataField1, dataField2, dataField3],
      dataValues: [{ f1: "val1", f2: uuidToOtherPassport }],
    };

    const section1OtherPassport: DataSectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      name: "Technische Spezifikation",
      parentId: undefined,
      subSections: ["s1-1"],
      dataFields: [dataField1, dataField2, dataField3],
      dataValues: [
        {
          f1: "otherVal1",
          f2: uuidToOtherPassport,
        },
      ],
    };

    const dataField21: DataFieldDto = {
      id: "f1-1",
      type: DataFieldType.TEXT_FIELD,
      name: "Größe",
      options: {
        min: 24,
      },
      granularityLevel: GranularityLevel.MODEL,
    };

    const section2: DataSectionDto = {
      id: "s2",
      type: SectionType.REPEATABLE,
      name: "Dimensions",
      parentId: "s1",
      subSections: [],
      dataFields: [dataField21],
      granularityLevel: GranularityLevel.MODEL,
      dataValues: [],
    };

    const section3: DataSectionDto = {
      id: "s3",
      type: SectionType.REPEATABLE,
      name: "Footprints",
      subSections: [],
      dataFields: [dataField21],
      granularityLevel: GranularityLevel.ITEM,
      dataValues: [],
    };

    // see: https://on.cypress.io/mounting-vue
    const productPassportDto: ProductPassportDto = {
      id: "pdm1",
      name: "Laptop neu",
      description: "Laptop neu desc",
      dataSections: [section1, section2, section3],
    };

    const otherProductPassportDto: ProductPassportDto = {
      id: "pdm1",
      name: "Other Laptop",
      description: "Other Laptop",
      dataSections: [section1OtherPassport, section2, section3],
    };

    const model = {
      id: "someId",
      uniqueProductIdentifiers: [
        {
          uuid: "own-uuid",
          referenceId: "someId",
        },
      ],
    };

    const otherModel = {
      id: "otherId",
      uniqueProductIdentifiers: [
        {
          uuid: "other-uuid",
          referenceId: "otherId",
        },
      ],
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

    cy.intercept("GET", `${API_URL}/product-passports/*`, (req) => {
      const uuid = req.url.split("/").pop();
      req.reply({
        statusCode: 200,
        body:
          uuid === model.uniqueProductIdentifiers[0].uuid
            ? productPassportDto
            : otherProductPassportDto,
      }); // Mock response
    }).as("getTemplate");

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
    cy.wait("@getTemplate").its("response.statusCode").should("eq", 200);
    cy.contains("Modellpass Informationen").should("be.visible");
    cy.contains("own-uuid").should("be.visible");
    cy.get('[data-cy="section-card-s3"]').within(() => {
      cy.contains("Wird auf Artikelebene gesetzt").should("be.visible");
      cy.contains("Speichern").should("not.exist");
    });
    const section1Card = cy.get('[data-cy="section-card-s1"]');
    section1Card.within(() => {
      cy.get('[data-cy="f1"]').should("have.value", "val1");
      cy.get('[data-cy="f2"]').should("have.value", uuidToOtherPassport);
      cy.get('[data-cy="f3"]').should(
        "contain.text",
        "Wird auf Artikelebene gesetzt",
      );
      cy.get('[data-cy="f1"]').type("add1");
      cy.get('[data-cy="f2"]').type("add2");
      cy.contains("button", "Speichern").click();
    });
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
        cy.wait("@getTemplate").its("response.statusCode").should("eq", 200);
        let section1Card = cy.get('[data-cy="section-card-s1"]');
        section1Card.within(() => {
          cy.get('[data-cy="f1"]').should("have.value", "otherVal1");
          cy.get('[data-cy="f2"]').should("have.value", uuidToOtherPassport);
        });
        cy.spy(router, "push").as("pushSpy");
        cy.contains("other-uuid").should("be.visible");
        section1Card = cy.get('[data-cy="section-card-s1"]');
        section1Card.within(() => {
          cy.get('[data-cy="Visit f2"]').click();
        });
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
