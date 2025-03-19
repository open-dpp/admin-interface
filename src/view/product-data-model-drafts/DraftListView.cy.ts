import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import { ProductDataModelDraftGetAllDto } from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import DraftListView from "./DraftListView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<DraftListView />", () => {
  it("renders drafts and creates a new one", () => {
    const drafts: ProductDataModelDraftGetAllDto[] = [
      {
        id: "draft1",
        name: "My first draft",
      },
      {
        id: "draft2",
        name: "My second draft",
      },
    ];

    const orgaId = "orgaId";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts`,
      {
        statusCode: 200,
        body: drafts, // Mock response
      },
    ).as("getDrafts");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.wrap(router.push(`/organizations/${orgaId}/data-model-drafts`));
    cy.mountWithPinia(DraftListView, { router });

    cy.spy(router, "push").as("pushSpy");

    cy.wait("@getDrafts").its("response.statusCode").should("eq", 200);
    cy.contains("Datenmodellentwürfe").should("be.visible");
    cy.contains("Alle erstellten Datenmodellentwürfe").should("be.visible");
    drafts.forEach((d, index) => {
      const testId = `row-${index}`;
      const row = cy.get(`[data-cy="${testId}"]`);
      row.within(() => cy.contains(d.name).should("be.visible"));
      row.within(() => cy.contains("Editieren").click());
      cy.get("@pushSpy").should(
        "have.been.calledWith",
        `/organizations/${orgaId}/data-model-drafts/${d.id}`,
      );
    });
    cy.contains("Datenmodell entwerfen").click();
    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/data-model-drafts/create`,
    );
  });

  it("should fetch empty drafts on render and create first draft", () => {
    const orgaId = "orgaId";

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts`,
      {
        statusCode: 200,
        body: [], // Mock response
      },
    ).as("getDrafts");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);
    cy.spy(router, "push").as("pushSpy");
    cy.mountWithPinia(DraftListView, { router });
    cy.wrap(router.push(`/organizations/${orgaId}/data-model-drafts`));

    cy.wait("@getDrafts").its("response.statusCode").should("eq", 200);
    cy.contains("Neues Datenmodell entwerfen").should("be.visible");
    cy.contains("button", "Datenmodell entwerfen").click();
    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/data-model-drafts/create`,
    );
  });
});
