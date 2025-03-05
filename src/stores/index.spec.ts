import { setActivePinia, createPinia } from "pinia";
import { vi, expect, it } from "vitest";
import { useIndexStore } from "./index";
import apiClient from "../lib/api-client";

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
  },
}));

describe("IndexStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  it("should update organization id of api client on orga select", () => {
    const indexStore = useIndexStore();
    const id = "someId";
    indexStore.selectOrganization(id);
    expect(apiClient.setActiveOrganizationId).toHaveBeenCalled();
  });
});
