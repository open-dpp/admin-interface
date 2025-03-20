import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import apiClient from "../lib/api-client";
import { waitFor } from "@testing-library/vue";
import { useDraftStore } from "./draft";
import {
  DataFieldType,
  ProductDataModelDraftDto,
  SectionType,
} from "@open-dpp/api-client";

const mocks = vi.hoisted(() => {
  return {
    getDraftId: vi.fn(),
    addSection: vi.fn(),
    deleteSection: vi.fn(),
    addDataField: vi.fn(),
    deleteDataField: vi.fn(),
    modifySection: vi.fn(),
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
    const newSection = { name: "My new section", type: SectionType.GROUP };
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
    const modifySection = { name: "My new section name" };
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
});
