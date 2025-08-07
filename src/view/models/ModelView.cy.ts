import ModelView from "./ModelView.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldDto,
  DataFieldType,
  DataSectionDto,
  GranularityLevel,
  ProductPassportDto,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import {
  dataFieldFactory,
  dataSectionFactory,
  productPassportFactory,
} from "../../testing-utils/fixtures/product-passport.factory";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<ModelView />", () => {
  it("renders model form and modify its data", () => {
    const dataField1 = dataFieldFactory.build({ id: "f1" });
    const dataField2 = dataFieldFactory.build({
      id: "f2",
      type: DataFieldType.PRODUCT_PASSPORT_LINK,
    });
    const dataField3: DataFieldDto = dataFieldFactory.build({
      id: "f3",
      granularityLevel: GranularityLevel.ITEM,
    });
    const uuidToOtherPassport = "uuid1";

    const section1 = dataSectionFactory
      .addDataField(dataField1)
      .addDataField(dataField2)
      .addDataField(dataField3)
      .addDataValue(dataField1.id, "val1")
      .addDataValue(dataField2.id, uuidToOtherPassport)
      .build({ id: "s1", subSections: ["s1-1"] });

    const section1OtherPassport = dataSectionFactory
      .addDataField(dataField1)
      .addDataField(dataField2)
      .addDataField(dataField3)
      .addDataValue(dataField1.id, "otherVal1")
      .addDataValue(dataField2.id, uuidToOtherPassport)
      .build({ id: "s1", subSections: ["s1-1"] });

    const dataField21: DataFieldDto = dataFieldFactory.build({ id: "f1-1" });

    const section2: DataSectionDto = dataSectionFactory
      .addDataField(dataField21)
      .build({ id: "s2", parentId: "s1" });
    const dataField31: DataFieldDto = dataFieldFactory.build({ id: "f3-1" });

    const section3: DataSectionDto = dataSectionFactory
      .addDataField(dataField31)
      .build({
        id: "s3",
        granularityLevel: GranularityLevel.ITEM,
      });

    // see: https://on.cypress.io/mounting-vue
    const productPassportDto: ProductPassportDto = productPassportFactory
      .addDataSection(section1)
      .addDataSection(section2)
      .addDataSection(section3)
      .build({ name: "Laptop neu" });

    const otherProductPassportDto: ProductPassportDto = productPassportFactory
      .addDataSection(section1OtherPassport)
      .addDataSection(section2)
      .addDataSection(section3)
      .build({ name: "Other laptop" });

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
