import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import apiClient from "../lib/api-client";
import { waitFor } from "@testing-library/vue";
import { findEmptyGridSpaces, useDraftStore } from "./draft";
import {
  DataFieldType,
  GranularityLevel,
  LayoutDto,
  ProductDataModelDraftDto,
  SectionType,
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
        options: {},
        layout: {
          colStart: { sm: 1 },
          colSpan: { sm: 1 },
          rowStart: { sm: 1 },
          rowSpan: { sm: 1 },
        },
        granularityLevel: GranularityLevel.MODEL,
      },
    ],
    subSections: [],
    layout: {
      cols: { sm: 1, lg: 8 },
      colStart: { sm: 1, lg: 9 },
      colSpan: { sm: 2, xl: 3 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
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
    await draftStore.fetchDraft(draft.id);
    await waitFor(() =>
      expect(apiClient.productDataModelDrafts.getById).toHaveBeenCalledWith(
        draft.id,
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
      layout: {
        cols: { sm: 1 },
        colStart: { sm: 2 },
        colSpan: { sm: 7 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
    };
    await draftStore.addSection(newSection);
    await waitFor(() =>
      expect(apiClient.productDataModelDrafts.addSection).toHaveBeenCalledWith(
        draft.id,
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
      layout: {
        cols: { sm: 1 },
        colStart: { sm: 2 },
        colSpan: { sm: 7 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
    };
    await draftStore.modifySection(section.id, modifySection);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.modifySection,
      ).toHaveBeenCalledWith(draft.id, section.id, modifySection),
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
      layout: {
        colStart: { sm: 2 },
        colSpan: { sm: 7 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      granularityLevel: GranularityLevel.MODEL,
    };
    await draftStore.addDataField(sectionId, newDataField);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.addDataField,
      ).toHaveBeenCalledWith(draft.id, sectionId, newDataField),
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
      ).toHaveBeenCalledWith(draft.id, sectionId),
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
      ).toHaveBeenCalledWith(draft.id, section.id, dataFieldId),
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
      layout: {
        colStart: { sm: 2 },
        colSpan: { sm: 7 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
    };
    await draftStore.modifyDataField(dataFieldId, modification);
    await waitFor(() =>
      expect(
        apiClient.productDataModelDrafts.modifyDataField,
      ).toHaveBeenCalledWith(draft.id, section.id, dataFieldId, modification),
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
        draft.id,
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
});

describe("findEmptyGridSpaces", () => {
  it("should find spaces", () => {
    const items: LayoutDto[] = [
      {
        colStart: { sm: 1 },
        colSpan: { sm: 2 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      {
        colStart: { sm: 3 },
        colSpan: { sm: 1 },
        rowStart: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      {
        colStart: { sm: 1 },
        colSpan: { sm: 1 },
        rowStart: { sm: 2 },
        rowSpan: { sm: 1 },
      },
    ];

    const result = findEmptyGridSpaces(items, 3);
    expect(result).toEqual([
      {
        colStart: { sm: 2 },
        rowStart: { sm: 2 },
        colSpan: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      {
        colStart: { sm: 3 },
        rowStart: { sm: 2 },
        colSpan: { sm: 1 },
        rowSpan: { sm: 1 },
      },
      {
        colSpan: {
          sm: 1,
        },
        colStart: {
          sm: 1,
        },
        rowSpan: {
          sm: 1,
        },
        rowStart: {
          sm: 3,
        },
      },
      {
        colSpan: {
          sm: 1,
        },
        colStart: {
          sm: 2,
        },
        rowSpan: {
          sm: 1,
        },
        rowStart: {
          sm: 3,
        },
      },
      {
        colSpan: {
          sm: 1,
        },
        colStart: {
          sm: 3,
        },
        rowSpan: {
          sm: 1,
        },
        rowStart: {
          sm: 3,
        },
      },
    ]);
  });
});
