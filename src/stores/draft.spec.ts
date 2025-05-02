import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import apiClient from "../lib/api-client";
import { waitFor } from "@testing-library/vue";
import { findEmptyGridSpaces, useDraftStore } from "./draft";
import {
  DataFieldType,
  NodeDto,
  NodeType,
  ProductDataModelDraftDto,
  SectionGridDto,
  SectionType,
  TargetGroup,
  VisibilityLevel,
} from "@open-dpp/api-client";

const mocks = vi.hoisted(() => {
  return {
    getDraftId: vi.fn(),
    create: vi.fn(),
    addSection: vi.fn(),
    deleteSection: vi.fn(),
    addDataField: vi.fn(),
    deleteDataField: vi.fn(),
    modifySection: vi.fn(),
    modifyDataField: vi.fn(),
    publish: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    productDataModelDrafts: {
      getById: mocks.getDraftId,
      addSection: mocks.addSection,
      addDataField: mocks.addDataField,
      deleteSection: mocks.deleteSection,
      deleteDataField: mocks.deleteDataField,
      modifySection: mocks.modifySection,
      modifyDataField: mocks.modifyDataField,
      publish: mocks.publish,
      create: mocks.create,
    },
  },
}));

describe("DraftStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

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
    subSections: [],
  };

  const sectionGrid: SectionGridDto = {
    id: "sg1",
    type: NodeType.SECTION_GRID,
    cols: { sm: 1, lg: 8 },
    colStart: { sm: 1, lg: 9 },
    colSpan: { sm: 2, xl: 3 },
    sectionId: section.id,
    children: [],
  };

  const draft: ProductDataModelDraftDto = {
    data: {
      id: "draftId",
      name: "My draft",
      version: "1.0.0",
      publications: [],
      sections: [section],
      createdByUserId: "u1",
      ownedByOrganizationId: "u2",
    },
    view: {
      id: "viewId",
      dataModelId: "draftId",
      version: "1.0.0",
      targetGroup: TargetGroup.ALL,
      nodes: [sectionGrid],
    },
  };

  it("should create draft", async () => {
    const draftStore = useDraftStore();
    mocks.create.mockResolvedValue({ data: draft });
    const createDto = {
      name: "My draft",
    };
    await draftStore.createDraft(createDto);
    await waitFor(() =>
      expect(apiClient.productDataModelDrafts.create).toHaveBeenCalledWith(
        createDto,
      ),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should fetch draft", async () => {
    const draftStore = useDraftStore();
    mocks.getDraftId.mockResolvedValue({ data: draft });
    await draftStore.fetchDraft(draft.data.id);
    await waitFor(() =>
      expect(apiClient.productDataModelDrafts.getById).toHaveBeenCalledWith(
        draft.data.id,
      ),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should add section", async () => {
    const draftStore = useDraftStore();
    mocks.addSection.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const newSection = {
      name: "My new section",
      type: SectionType.GROUP,
      view: { cols: { sm: 1 }, colStart: { sm: 2 }, colSpan: { sm: 7 } },
    };
    await draftStore.addSection(newSection);
    await waitFor(() =>
      expect(apiClient.productDataModelDrafts.addSection).toHaveBeenCalledWith(
        draft.data.id,
        newSection,
      ),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should modify section", async () => {
    const draftStore = useDraftStore();
    mocks.modifySection.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const modifySection = {
      name: "My new section name",
      view: { cols: { sm: 1 }, colStart: { sm: 2 }, colSpan: { sm: 7 } },
    };
    await draftStore.modifySection(section.id, modifySection);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.modifySection,
      ).toHaveBeenCalledWith(draft.data.id, section.id, modifySection),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should add data field", async () => {
    const draftStore = useDraftStore();
    mocks.addDataField.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const sectionId = "sectionId";
    const newDataField = {
      name: "My new data field",
      type: DataFieldType.TEXT_FIELD,
      view: { colStart: { sm: 2 }, colSpan: { sm: 7 } },
    };
    await draftStore.addDataField(sectionId, newDataField);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.addDataField,
      ).toHaveBeenCalledWith(draft.data.id, sectionId, newDataField),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should delete section", async () => {
    const draftStore = useDraftStore();
    mocks.deleteSection.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const sectionId = "sectionId";
    await draftStore.deleteSection(sectionId);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.deleteSection,
      ).toHaveBeenCalledWith(draft.data.id, sectionId),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should delete data field", async () => {
    const draftStore = useDraftStore();
    mocks.deleteDataField.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const dataFieldId = section.dataFields[0].id;
    await draftStore.deleteDataField(dataFieldId);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.deleteDataField,
      ).toHaveBeenCalledWith(draft.data.id, section.id, dataFieldId),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should modify data field", async () => {
    const draftStore = useDraftStore();
    mocks.modifyDataField.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const dataFieldId = section.dataFields[0].id;
    const modification = {
      name: "new name",
      options: { min: 2 },
      view: { colStart: { sm: 2 }, colSpan: { sm: 7 } },
    };
    await draftStore.modifyDataField(dataFieldId, modification);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.modifyDataField,
      ).toHaveBeenCalledWith(
        draft.data.id,
        section.id,
        dataFieldId,
        modification,
      ),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should publish draft", async () => {
    const draftStore = useDraftStore();
    mocks.publish.mockResolvedValue({ data: draft });
    draftStore.draft = draft;
    const publishRequest = { visibility: VisibilityLevel.PRIVATE };
    await draftStore.publish(publishRequest);
    await waitFor(() =>
      expect(apiClient.productDataModelDrafts.publish).toHaveBeenCalledWith(
        draft.data.id,
        publishRequest,
      ),
    );
    expect(draftStore.draft).toEqual(draft);
  });

  it("should find section by id", async () => {
    const draftStore = useDraftStore();
    draftStore.draft = draft;
    const found = draftStore.findSectionById(section.id);
    expect(found).toEqual(section);
  });

  it("should generate classes for section grid", () => {
    const draftStore = useDraftStore();
    draftStore.draft = draft;
    const classes = draftStore.generateClassesForNodeById(sectionGrid.id);

    expect(classes).toEqual(
      "sm:col-span-2 xl:col-span-3 sm:col-start-1 lg:col-start-9 sm:grid-cols-1 lg:grid-cols-8",
    );
  });
});

describe("findEmptyGridSpaces", () => {
  it("should find spaces", () => {
    const notRelevantProps = {
      id: "df2",
      type: NodeType.DATA_FIELD_REF,
      fieldId: "f2",
      children: [],
    };
    const items: NodeDto[] = [
      {
        ...notRelevantProps,
        colStart: { md: 1 },
        colSpan: { md: 2 },
        rowStart: { md: 1 },
        rowSpan: { md: 1 },
      },
      {
        ...notRelevantProps,
        colStart: { md: 3 },
        colSpan: { md: 1 },
        rowStart: { md: 1 },
        rowSpan: { md: 1 },
      },
      {
        ...notRelevantProps,
        colStart: { md: 1 },
        colSpan: { md: 1 },
        rowStart: { md: 2 },
        rowSpan: { md: 1 },
      },
    ];

    const result = findEmptyGridSpaces(items, 3, "md");
    expect(result).toEqual([
      { colStart: { md: 2 }, rowStart: { md: 2 }, colSpan: { md: 1 } },
      { colStart: { md: 3 }, rowStart: { md: 2 }, colSpan: { md: 1 } },
    ]);
  });
});
