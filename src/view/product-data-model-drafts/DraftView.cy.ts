import { createMemoryHistory, createRouter } from "vue-router";

import { API_URL } from "../../const";
import { routes } from "../../router";
import {
  DataFieldDto,
  DataFieldRefDto,
  DataFieldType,
  NodeType,
  ProductDataModelDraftDto,
  SectionDraftDto,
  SectionGridDto,
  SectionType,
  TargetGroup,
} from "@open-dpp/api-client";
import { useIndexStore } from "../../stores";
import DraftView from "./DraftView.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("<DraftView />", () => {
  const section: SectionDraftDto = {
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
    subSections: [],
  };

  const sectionGridNode: SectionGridDto = {
    id: "sg1",
    type: NodeType.SECTION_GRID,
    cols: { sm: 3 },
    colStart: { sm: 1 },
    colSpan: { sm: 1 },
    children: [],
    sectionId: section.id,
  };

  const draft: ProductDataModelDraftDto = {
    data: {
      id: "draftId",
      name: "My draft",
      version: "1.0.0",
      publications: [],
      sections: [section],
      createdByUserId: "u1",
      ownedByOrganizationId: "o1",
    },
    view: {
      id: "view1",
      targetGroup: TargetGroup.ALL,
      version: "1.0.0",
      nodes: [sectionGridNode],
      dataModelId: "draftId",
    },
  };

  it("renders draft and creates a section", () => {
    const orgaId = "orgaId";
    const newSectionName = "Mein neuer Abschnitt";

    const sectionToCreate = {
      id: "sCreate1",
      name: "Sustain",
      type: SectionType.REPEATABLE,
      dataFields: [],
      subSections: [],
    };

    const sectionGridToCreate: SectionGridDto = {
      id: "sgCreate1",
      type: NodeType.SECTION_GRID,
      cols: { sm: 3 },
      colStart: { sm: 1 },
      colSpan: { sm: 3 },
      sectionId: sectionToCreate.id,
      children: [],
    };

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.data.id}`,
      {
        statusCode: 200,
        body: draft, // Mock response
      },
    ).as("getDraft");

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.data.id}/sections`,
      {
        statusCode: 200,
        body: {
          data: {
            ...draft.data,
            sections: [...draft.data.sections, sectionToCreate],
          },
          view: {
            ...draft.view,
            nodes: [...draft.view.nodes, sectionGridToCreate],
          },
        },
      },
    ).as("createSection");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.wrap(
      router.push(
        `/organizations/${orgaId}/data-model-drafts/${draft.data.id}`,
      ),
    );
    cy.mountWithPinia(DraftView, { router });

    cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
    cy.contains(`Datenmodellentwurf ${draft.data.name}`).should("be.visible");
    cy.contains(`Version ${draft.data.version}`).should("be.visible");
    cy.contains("button", "Hinzufügen").click();
    cy.contains(`Knoten hinzufügen`).should("be.visible");
    cy.contains(`Auswahl`).should("be.visible");
    // Check that text field is not selectable at root level
    cy.contains("li", "Textfeld").should("not.exist");
    cy.contains("li", "Repeater").click();
    cy.get('[data-cy="name"]').type(newSectionName);
    cy.get('[data-cy="select-col-number"]').select(
      sectionGridToCreate.cols.sm!.toFixed(),
    );
    cy.get('[data-cy="submit"]').click();
    cy.wait("@createSection").then(({ request }) => {
      const expected = {
        name: newSectionName,
        type: SectionType.REPEATABLE,
        view: {
          cols: sectionGridToCreate.cols,
          colSpan: { sm: 1 },
          colStart: { sm: 1 },
          rowStart: { sm: 1 },
        },
      };
      cy.expectDeepEqualWithDiff(request.body, expected);
    });

    cy.contains(`Knoten hinzufügen`).should("not.be.visible");
  });

  it("renders draft and creates a data field", () => {
    const orgaId = "orgaId";

    const dataFieldToCreate: DataFieldDto = {
      id: "dCreate1",
      type: DataFieldType.TEXT_FIELD,
      name: "Processor",
      options: {},
    };

    const dataFieldRefToCreate: DataFieldRefDto = {
      id: "drefCreate1",
      type: NodeType.DATA_FIELD_REF,
      fieldId: dataFieldToCreate.id,
      colStart: { sm: 2 },
      rowStart: { sm: 1 },
      colSpan: { sm: 1 },
      children: [],
      parentId: sectionGridNode.id,
    };

    cy.intercept(
      "GET",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.data.id}`,
      {
        statusCode: 200,
        body: draft,
      },
    ).as("getDraft");

    cy.intercept(
      "POST",
      `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.data.id}/sections/${section.id}/data-fields`,
      {
        statusCode: 200,
        body: {
          data: {
            ...draft.data,
            sections: [
              {
                ...section,
                dataFields: [section.dataFields, dataFieldToCreate],
              },
            ],
          },
          view: {
            ...draft.view,
            nodes: [
              { ...sectionGridNode, children: [dataFieldRefToCreate.id] },
              dataFieldRefToCreate,
            ],
          },
        }, // Mock response
      },
    ).as("createDataField");

    const indexStore = useIndexStore();
    indexStore.selectOrganization(orgaId);

    cy.wrap(
      router.push(
        `/organizations/${orgaId}/data-model-drafts/${draft.data.id}`,
      ),
    );
    cy.mountWithPinia(DraftView, { router });

    cy.wait("@getDraft").its("response.statusCode").should("eq", 200);

    // add data field
    cy.get(`[data-cy="${sectionGridNode.id}-1"]`).click();
    cy.contains("li", "Textfeld").click();
    cy.get('[data-cy="name"]').type(dataFieldToCreate.name);
    cy.get('[data-cy="submit"]').click();

    cy.wait("@createDataField").then(({ request }) => {
      const expected = {
        name: dataFieldToCreate.name,
        type: DataFieldType.TEXT_FIELD,
        view: {
          colSpan: { sm: 1 },
          colStart: { sm: 2 },
          rowStart: { sm: 1 },
        },
      };
      cy.expectDeepEqualWithDiff(request.body, expected);
    });

    cy.get(`[data-cy="${dataFieldRefToCreate.id}"]`)
      .find("input")
      .should("have.attr", "placeholder", dataFieldToCreate.name);
  });
  //
  // it("renders nested view", () => {
  //   const dataField: DataFieldDto = {
  //     id: "d1",
  //     name: "Processor",
  //     type: DataFieldType.TEXT_FIELD,
  //     options: {},
  //   };
  //
  //   const section: SectionDto = {
  //     id: "s1",
  //     name: "Sustain",
  //     type: SectionType.GROUP,
  //     dataFields: [dataField],
  //     subSections: [],
  //   };
  //
  //   const draftNested: ProductDataModelDraftDto = {
  //     id: "draftId",
  //     name: "My draft",
  //     version: "1.0.0",
  //     publications: [],
  //     sections: [section],
  //     createdByUserId: "u1",
  //     ownedByOrganizationId: "o1",
  //   };
  //   const dataFieldRef: DataFieldRefDto = {
  //     id: "dref1",
  //     type: NodeType.DATA_FIELD_REF,
  //     fieldId: dataField.id,
  //   };
  //   const gridItem1: GridItemDto = {
  //     type: NodeType.GRID_ITEM,
  //     id: "gi1",
  //     colSpan: {},
  //     rowSpan: { lg: 5 },
  //     content: dataFieldRef,
  //   };
  //   const gridItem2: GridItemDto = {
  //     type: NodeType.GRID_ITEM,
  //     id: "gi2",
  //     colSpan: { xs: 3, md: 1 },
  //   };
  //   const gridContainer: SectionGridDto = {
  //     type: NodeType.GRID_CONTAINER,
  //     id: "gc1",
  //     children: [gridItem1, gridItem2],
  //     cols: { md: 4 },
  //     sectionId: section.id,
  //   };
  //   const view: ViewDto = {
  //     id: "view1",
  //     name: "My View",
  //     version: "1.0.0",
  //     ownedByOrganizationId: "o1",
  //     createdByUserId: "u1",
  //     nodes: [gridContainer],
  //     dataModelId: "draftId",
  //   };
  //
  //   const orgaId = "orgaId";
  //
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draftNested, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/views?dataModelId=${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: view, // Mock response
  //     },
  //   ).as("getView");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.wait("@getView").its("response.statusCode").should("eq", 200);
  //   cy.get('[data-cy="gc1"]')
  //     .should("have.class", "grid")
  //     .and("have.class", "md:grid-cols-4");
  //   cy.get('[data-cy="gi1"]')
  //     .should("have.class", "xs:col-span-1")
  //     .and("have.class", "lg:row-span-5");
  //   cy.get('[data-cy="gi2"]')
  //     .should("have.class", "xs:col-span-3")
  //     .and("have.class", "md:col-span-1");
  //   cy.get('[data-cy="gi1"]').within(() => {
  //     // Assert that an input of type text exists
  //     cy.get('input[type="text"]').should("exist");
  //   });
  // });

  // it("renders draft and publish it", () => {
  //   const orgaId = "orgaId";
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   cy.intercept(
  //     "POST",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/publish`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("publishDraft");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   const notificationStore = useNotificationStore();
  //
  //   cy.spy(notificationStore, "addSuccessNotification").as("notifySpy");
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.get('[data-cy="selectVisibility"]').click();
  //   cy.contains("für jeden sichtbar").click();
  //   cy.contains("button", "Veröffentlichen").click();
  //   cy.wait("@publishDraft").its("request.body").should("deep.equal", {
  //     visibility: VisibilityLevel.PUBLIC,
  //   });
  //
  //   cy.get("@notifySpy").should(
  //     "have.been.calledWith",
  //     "Ihr Entwurf wurde erfolgreich veröffentlicht. Sie können nun darauf basierend Modelle anlegen.",
  //     {
  //       label: "Modell anlegen",
  //       to: `/organizations/${orgaId}/models/create`,
  //     },
  //   );
  // });
  //
  // it("renders draft and deletes section", () => {
  //   const orgaId = "orgaId";
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   cy.intercept(
  //     "DELETE",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/sections/${section.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("deleteSection");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.get('[data-cy="deleteSection"]').click();
  //   cy.wait("@deleteSection").its("response.statusCode").should("eq", 200);
  // });
  //
  // it("renders draft and navigates to section edit", () => {
  //   const orgaId = "orgaId";
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.get('[data-cy="editSection"]').click();
  //   cy.spy(router, "push").as("pushSpy");
  //   cy.get("@pushSpy").should(
  //     "have.been.calledWith",
  //     `/organizations/${orgaId}/data-model-drafts/${draft.id}/sections/${section.id}`,
  //   );
  // });
  //
  // it("renders draft and navigates to data field edit", () => {
  //   const orgaId = "orgaId";
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.get('[data-cy="editDataField"]').click();
  //   cy.spy(router, "push").as("pushSpy");
  //   cy.get("@pushSpy").should(
  //     "have.been.calledWith",
  //     `/organizations/${orgaId}/data-model-drafts/${draft.id}/sections/${section.id}/data-fields/${section.dataFields[0].id}`,
  //   );
  // });
  //
  // it("renders draft and creates a new data field", () => {
  //   const orgaId = "orgaId";
  //   const newDataFieldName = "Mein neues Datenfeld";
  //
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   cy.intercept(
  //     "POST",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/sections/${section.id}/data-fields`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("createDataField");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.contains(section.name).should("be.visible");
  //   section.dataFields.forEach((d) => {
  //     cy.contains(d.name).should("be.visible");
  //   });
  //
  //   cy.contains("button", "Datenfeld hinzufügen").click();
  //   cy.contains("li", "Textfeld").click();
  //   cy.get('[data-cy="name"]').type(newDataFieldName);
  //   cy.contains("button", "Erstellen").click();
  //   cy.wait("@createDataField").its("request.body").should("deep.equal", {
  //     name: newDataFieldName,
  //     type: DataFieldType.TEXT_FIELD,
  //   });
  // });
  //
  // it("renders draft and deletes a data field", () => {
  //   const orgaId = "orgaId";
  //   const dataFieldIdToDelete = section.dataFields[0].id;
  //   cy.intercept(
  //     "GET",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("getDraft");
  //
  //   cy.intercept(
  //     "DELETE",
  //     `${API_URL}/organizations/${orgaId}/product-data-model-drafts/${draft.id}/sections/${section.id}/data-fields/${dataFieldIdToDelete}`,
  //     {
  //       statusCode: 200,
  //       body: draft, // Mock response
  //     },
  //   ).as("deleteDataField");
  //
  //   const indexStore = useIndexStore();
  //   indexStore.selectOrganization(orgaId);
  //
  //   cy.wrap(
  //     router.push(`/organizations/${orgaId}/data-model-drafts/${draft.id}`),
  //   );
  //   cy.mountWithPinia(DraftView, { router });
  //
  //   cy.wait("@getDraft").its("response.statusCode").should("eq", 200);
  //   cy.contains(section.name).should("be.visible");
  //   section.dataFields.forEach((d) => {
  //     cy.contains(d.name).should("be.visible");
  //   });
  //   cy.get('[data-cy="deleteDataField"]').click();
  //   cy.wait("@deleteDataField").its("response.statusCode").should("eq", 200);
  // });
});
