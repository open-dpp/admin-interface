import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import { ProductDataModelDraftDto, SectionType } from "@open-dpp/api-client";
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
});
