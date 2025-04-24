import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import CreateDraftView from "./CreateDraftView.vue";
import { useIndexStore } from "../../stores";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<CreateDraftView />", () => {
  it("creates draft with corresponding view", () => {
    const orgaId = "orgaId";
    const draftName = "My draft";
    const viewName = `Standard view ${draftName}`;
    const draftId = "draftId";

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts`,
      {
        statusCode: 201,
        body: { id: draftId, name: draftName }, // Mock response
      },
    ).as("createDraft");

    cy.intercept("POST", `${API_URL}/organizations/${orgaId}/views`, {
      statusCode: 201,
      body: { name: viewName }, // Mock response
    }).as("viewDraft");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);
    cy.wrap(router.push(`/organizations/${orgaId}/data-model-drafts/create`));
    cy.spy(router, "push").as("pushSpy");
    cy.mountWithPinia(CreateDraftView, {
      router,
    });
    cy.get('[data-cy="name"]').type(draftName);
    cy.contains("button", "Erstellen").click();
    cy.wait("@createDraft")
      .its("request.body")
      .should("deep.equal", { name: draftName });

    cy.wait("@viewDraft")
      .its("request.body")
      .should("deep.equal", { name: viewName, dataModelId: draftId });

    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/data-model-drafts/${draftId}`,
    );
  });
});
