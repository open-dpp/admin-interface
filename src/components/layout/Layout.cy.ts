import { createMemoryHistory, createRouter } from "vue-router";
import { routes } from "../../router";
import { useIndexStore } from "../../stores";
import Layout from "./Layout.vue";
import { API_URL } from "../../const";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<CreateModelVew />", () => {
  it("should render sidebar and route to correct view", () => {
    const orgaId = "orgaI";

    cy.intercept("GET", `${API_URL}/organizations/${orgaId}/models`, {
      statusCode: 200,
      body: [], // Mock response
    }).as("getModels");

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
    // cy.wrap(router.push(`/organizations/${orgaId}/models/create`));
    cy.spy(router, "push").as("pushSpy");
    cy.mountWithPinia(Layout, {
      router,
    });
    cy.get('[data-cy="openSidebar"]').click();
    cy.get('[data-cy="sidebar"]').within(() => {
      cy.contains("Modelle").click();
      cy.get("@pushSpy").should(
        "have.been.calledWith",
        `/organizations/${orgaId}/models`,
      );
      cy.wait("@getModels").its("response.statusCode").should("eq", 200);
      cy.contains("Datenmodell entwerfen").click();
      cy.get("@pushSpy").should(
        "have.been.calledWith",
        `/organizations/${orgaId}/data-model-drafts`,
      );
      cy.wait("@getDrafts").its("response.statusCode").should("eq", 200);
    });
  });
});
