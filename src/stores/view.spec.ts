import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import apiClient from "../lib/api-client";
import { waitFor } from "@testing-library/vue";
import {
  GridContainerDto,
  GridItemDto,
  ViewDto,
  NodeType,
} from "@open-dpp/api-client";
import { randomUUID } from "node:crypto";
import { useViewStore } from "./view";

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

  const gridItem: GridItemDto = {
    id: randomUUID(),
    type: NodeType.GRID_ITEM,
    colSpan: { sm: 7, lg: 8 },
    colStart: { xs: 5, sm: 9 },
    rowSpan: { sm: 4, lg: 4 },
    rowStart: { xs: 2, lg: 8 },
  };

  const gridContainer: GridContainerDto = {
    id: randomUUID(),
    type: NodeType.GRID_CONTAINER,
    cols: { sm: 7, lg: 8 },
    children: [gridItem],
  };

  const view: ViewDto = {
    id: randomUUID(),
    name: "name",
    version: "1.0.0",
    ownedByOrganizationId: randomUUID(),
    createdByUserId: randomUUID(),
    nodes: [gridContainer],
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

  it("should generate grid col classes", () => {
    const viewStore = useViewStore();
    viewStore.view = view;
    const classes = viewStore.generateClassesForNode(gridContainer.id);
    expect(classes).toEqual("sm:grid-cols-7 lg:grid-cols-8");
  });

  it("should generate grid item classes", () => {
    const viewStore = useViewStore();
    viewStore.view = view;
    const classes = viewStore.generateClassesForNode(gridItem.id);
    expect(classes).toEqual(
      "sm:col-span-7 lg:col-span-8 xs:col-start-5 sm:col-start-9 sm:row-span-4 lg:row-span-4 xs:row-start-2 lg:row-start-8",
    );
  });

  it("find node", () => {
    const viewStore = useViewStore();
    viewStore.view = view;
    let found = viewStore.findNodeWithParentById(gridItem.id);
    expect(found?.node).toEqual(gridItem);
    expect(found?.parent).toEqual(gridContainer);

    found = viewStore.findNodeWithParentById(gridContainer.id);
    expect(found?.node).toEqual(gridContainer);
    expect(found?.parent).toBeUndefined();
  });
});
