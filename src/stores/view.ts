import { defineStore } from "pinia";
import { ref } from "vue";
import {
  AddNodeDto,
  GridContainerDto,
  GridContainerUpdateDto,
  GridItemDto,
  GridItemUpdateDto,
  isGridContainerOrSubclass,
  isGridItem,
  NodeDto,
  NodeType,
  ResponsiveConfigDto,
  ViewCreateDto,
  ViewDto,
} from "@open-dpp/api-client";
import apiClient from "../lib/api-client";

export const useViewStore = defineStore("view", () => {
  const nodeType = ref<NodeType>();
  const view = ref<ViewDto>();

  const fetchView = async (dataModelId: string) => {
    const response = await apiClient.views.getByDataModelId(dataModelId);
    view.value = response.data;
  };

  const createView = async (data: ViewCreateDto) => {
    const response = await apiClient.views.create(data);
    view.value = response.data;
  };

  const addNode = async (addNodeDto: AddNodeDto) => {
    if (view.value) {
      const response = await apiClient.views.addNode(view.value.id, addNodeDto);
      view.value = response.data;
    }
  };

  const deleteNode = async (nodeId: string) => {
    if (view.value) {
      const response = await apiClient.views.deleteNode(view.value.id, nodeId);
      view.value = response.data;
    }
  };

  const modifyNode = async (
    nodeId: string,
    updateNodeDto: GridContainerUpdateDto | GridItemUpdateDto,
  ) => {
    if (view.value) {
      const response = await apiClient.views.modifyNode(
        view.value.id,
        nodeId,
        updateNodeDto,
      );
      view.value = response.data;
    }
  };

  const generateClasses = (config: ResponsiveConfigDto, className: string) => {
    const hasBreakpoints = Object.keys(config).length > 0;

    const effectiveBreakpoints = hasBreakpoints ? config : { xs: 1 }; // default if none are provided

    return Object.entries(effectiveBreakpoints).map(
      ([key, value]) => `${key}:${className}-${value}`,
    );
  };

  const generateGridContainerClasses = (
    gridContainer: GridContainerDto,
  ): string => {
    return generateClasses(gridContainer.cols, "grid-cols").join(" ");
  };

  const generateGridItemClasses = (gridItem: GridItemDto): string => {
    const classes = generateClasses(gridItem.colSpan, "col-span");
    if (gridItem.colStart) {
      classes.push(...generateClasses(gridItem.colStart, "col-start"));
    }
    if (gridItem.rowSpan) {
      classes.push(...generateClasses(gridItem.rowSpan, "row-span"));
    }
    if (gridItem.rowStart) {
      classes.push(...generateClasses(gridItem.rowStart, "row-start"));
    }
    return classes.join(" ");
  };

  const generateClassesForNode = (nodeId: string): string => {
    const found = findNodeWithParentById(nodeId);
    if (found) {
      if (isGridContainerOrSubclass(found.node)) {
        return generateGridContainerClasses(found.node);
      }
      if (isGridItem(found.node)) {
        return generateGridItemClasses(found.node);
      }
    }
    return "";
  };

  const getChildNodes = (node: NodeDto) => {
    if (isGridContainerOrSubclass(node)) {
      return node.children;
    } else if (isGridItem(node)) {
      return node.content ? [node.content] : [];
    } else {
      return [];
    }
  };

  const findNodeWithParent = (
    tree: NodeDto[],
    predicate: (node: NodeDto) => boolean,
    parent: NodeDto | undefined = undefined,
  ): { node: NodeDto; parent: NodeDto | undefined } | undefined => {
    for (const node of tree) {
      if (predicate(node)) {
        return { node, parent };
      }
      if (getChildNodes(node).length > 0) {
        const found = findNodeWithParent(getChildNodes(node), predicate, node);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  };

  const findNodeWithParentById = (
    id: string,
  ): { node: NodeDto; parent: NodeDto | undefined } | undefined => {
    if (view.value) {
      return findNodeWithParent(view.value.nodes, (node) => node.id === id);
    }
    return undefined;
  };

  return {
    view,
    nodeType,
    fetchView,
    createView,
    addNode,
    modifyNode,
    deleteNode,
    generateClassesForNode,
    findNodeWithParentById,
  };
});
