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
    addDataField: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    productDataModelDrafts: {
      getById: mocks.getDraftId,
      addSection: mocks.addSection,
      addDataField: mocks.addDataField,
    },
  },
}));

describe("DraftStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  const draft: ProductDataModelDraftDto = {
    id: "draftId",
    name: "My draft",
    version: "1.0.0",
    publications: [],
    sections: [],
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
});
