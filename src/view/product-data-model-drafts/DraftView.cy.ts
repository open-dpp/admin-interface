import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldType,
  ProductDataModelDraftDto,
  SectionType,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import DraftView from "./DraftView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<DraftView />", () => {
  it("renders draft and creates a new section", () => {
    const draft: ProductDataModelDraftDto = {
      id: "draftId",
      name: "My draft",
      version: "1.0.0",
      publications: [],
      sections: [],
      createdByUserId: "u1",
      ownedByOrganizationId: "u2",
    };
    const orgaId = "orgaId";
    const newSectionName = "Mein neuer Abschnitt";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
      {
        statusCode: 200,
        body: draft, // Mock response
      },
    ).as("getDraft");

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/sections`,
      {
        statusCode: 200,
        body: draft, // Mock response
      },
    ).as("createSection");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.wrap(
      router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
    );
    cy.mountWithPinia(DraftView, { router });

    cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
    cy.contains(`Datenmodellentwurf ${draft.name}`).should("be.visible");
    cy.contains("button", "Abschnitt hinzufügen").click();
    cy.contains("li", "Repeater").click();
    cy.get('[data-cy="name"]').type(newSectionName);
    cy.contains("button", "Erstellen").click();
    cy.wait("@createSection").its("request.body").should("deep.equal", {
      name: newSectionName,
      type: SectionType.REPEATABLE,
    });
  });

  it("renders draft and creates a new section data field", () => {
    const section = {
      id: "s1",
      name: "Tech Specs",
      type: SectionType.GROUP,
      dataFields: [
        {
          id: "d1",
          name: "Processor",
          type: DataFieldType.TEXT_FIELD,
        },
      ],
    };
    const draft: ProductDataModelDraftDto = {
      id: "draftId",
      name: "My draft",
      version: "1.0.0",
      publications: [],
      sections: [section],
      createdByUserId: "u1",
      ownedByOrganizationId: "u2",
    };
    const orgaId = "orgaId";
    const newDataFieldName = "Mein neues Datenfeld";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
      {
        statusCode: 200,
        body: draft, // Mock response
      },
    ).as("getDraft");

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/sections/${section.id}/data-fields`,
      {
        statusCode: 200,
        body: draft, // Mock response
      },
    ).as("createDataField");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.wrap(
      router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
    );
    cy.mountWithPinia(DraftView, { router });

    cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
    cy.contains(section.name).should("be.visible");
    section.dataFields.forEach((d) => {
      cy.contains(d.name).should("be.visible");
    });

    cy.contains("button", "Datenfeld hinzufügen").click();
    cy.contains("li", "Textfeld").click();
    cy.get('[data-cy="name"]').type(newDataFieldName);
    cy.contains("button", "Erstellen").click();
    cy.wait("@createDataField").its("request.body").should("deep.equal", {
      name: newDataFieldName,
      type: DataFieldType.TEXT_FIELD,
    });
  });
});
