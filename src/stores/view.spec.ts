import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import apiClient from "../lib/api-client";
import { waitFor } from "@testing-library/vue";
import { ViewDto } from "@open-dpp/api-client";
import { randomUUID } from "node:crypto";
import { useViewStore } from "./view";
import { NodeType } from "../../../open-dpp-api-client";

const mocks = vi.hoisted(() => {
  return {
    create: vi.fn(),
    getByDataModelId: vi.fn(),
    addNode: vi.fn(),
    deleteNode: vi.fn(),
    modifyNode: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    views: {
      create: mocks.create,
      addNode: mocks.addNode,
      deleteNode: mocks.deleteNode,
      modifyNode: mocks.modifyNode,
      getByDataModelId: mocks.getByDataModelId,
    },
  },
}));

describe("ViewStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  const view: ViewDto = {
    id: randomUUID(),
    name: "name",
    version: "1.0.0",
    ownedByOrganizationId: randomUUID(),
    createdByUserId: randomUUID(),
    nodes: [{ id: randomUUID(), type: NodeType.GRID_CONTAINER }],
    dataModelId: randomUUID(),
  };

  it("should create view", async () => {
    const viewStore = useViewStore();
    mocks.create.mockResolvedValue({ data: view });
    const dataModelId = randomUUID();
    await viewStore.createView({ name: "name", dataModelId });
    await waitFor(() =>
      expect(apiClient.views.create).toHaveBeenCalledWith({
        name: "name",
        dataModelId,
      }),
    );
    expect(viewStore.view).toEqual(view);
  });

  it("should fetch view", async () => {
    const viewStore = useViewStore();
    mocks.getByDataModelId.mockResolvedValue({ data: view });
    const dataModelId = randomUUID();
    await viewStore.fetchView(dataModelId);
    await waitFor(() =>
      expect(apiClient.views.getByDataModelId).toHaveBeenCalledWith(
        dataModelId,
      ),
    );
    expect(viewStore.view).toEqual(view);
  });

  it("should add node to view", async () => {
    const viewStore = useViewStore();
    viewStore.view = view;
    mocks.addNode.mockResolvedValue({ data: view });
    const addNodeDto = {
      node: {
        type: NodeType.GRID_CONTAINER,
        cols: 4,
      },
    };
    await viewStore.addNode(addNodeDto);
    await waitFor(() =>
      expect(apiClient.views.addNode).toHaveBeenCalledWith(view.id, addNodeDto),
    );
    expect(viewStore.view).toEqual(view);
  });

  it("should delete node to view", async () => {
    const viewStore = useViewStore();
    viewStore.view = view;
    mocks.deleteNode.mockResolvedValue({ data: view });
    await viewStore.deleteNode(view.nodes[0].id);
    await waitFor(() =>
      expect(apiClient.views.deleteNode).toHaveBeenCalledWith(
        view.id,
        view.nodes[0].id,
      ),
    );
    expect(viewStore.view).toEqual(view);
  });

  it("should modify node to view", async () => {
    const viewStore = useViewStore();
    viewStore.view = view;
    mocks.modifyNode.mockResolvedValue({ data: view });
    await viewStore.modifyNode(view.nodes[0].id, { cols: { md: 4 } });
    await waitFor(() =>
      expect(apiClient.views.modifyNode).toHaveBeenCalledWith(
        view.id,
        view.nodes[0].id,
        { cols: { md: 4 } },
      ),
    );
    expect(viewStore.view).toEqual(view);
  });
});
