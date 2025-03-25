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
  it("creates model with selected product data model", () => {
    const orgaId = "orgaId";
    const draftName = "My draft";

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts`,
      {
        statusCode: 201,
        body: { name: draftName }, // Mock response
      },
    ).as("createDraft");

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
    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/data-model-drafts`,
    );
  });
});
