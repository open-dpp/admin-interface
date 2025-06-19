import { createMemoryHistory, createRouter } from "vue-router";
import { routes } from "../../router";
import { useIndexStore } from "../../stores";
import IntegrationView from "./IntegrationView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<IntegrationView />", () => {
  it("renders and navigates to pro alpha integration", () => {
    const orgaId = "orga1";
    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.mountWithPinia(IntegrationView, { router });
    cy.wrap(router.push(`/organizations/${orgaId}/integrations`));

    cy.contains("Alle Ihre Integrationen").should("be.visible");
    cy.contains("Editieren").click();
    cy.spy(router, "push").as("pushSpy");
    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/integrations/pro-alpha/connections`,
    );
  });
});
