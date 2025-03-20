import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldType,
  ProductDataModelDraftDto,
  SectionType,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import { useDraftStore } from "../../stores/draft";
import DataFieldView from "./DataFieldView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<DataFieldView />", () => {
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

  it("renders section and modifies it", () => {
    const orgaId = "orgaId";
    const dataField = section.dataFields[0];

    cy.intercept(
      "PATCH",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/sections/${section.id}/data-fields/${dataField.id}`,
      {
        statusCode: 200,
        body: draft, // Mock response
      },
    ).as("modifyDataField");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    const draftStore = useDraftStore();
    draftStore.draft = draft;
    cy.wrap(
      router.push(
        `/organizations/${orgaId}/data-model-drafts/${draft.id}/sections/${section.id}/data-fields/${dataField.id}`,
      ),
    );
    cy.spy(router, "push").as("pushSpy");

    cy.mountWithPinia(DataFieldView, { router });

    cy.get('[data-cy="name"]').should("have.value", dataField.name);
    const newName = "New name for data field";
    cy.get('[data-cy="name"]').clear();
    cy.get('[data-cy="name"]').type(newName);
    cy.contains("button", "Speichern").click();
    cy.wait("@modifyDataField").its("request.body").should("deep.equal", {
      name: newName,
    });
    cy.get("@pushSpy").should(
      "have.been.calledWith",
      `/organizations/${orgaId}/data-model-drafts/${draft.id}`,
    );
  });
});
