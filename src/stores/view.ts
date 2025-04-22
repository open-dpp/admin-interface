import { defineStore } from "pinia";
import { ref } from "vue";
import {
  AddNodeDto,
  GridContainerUpdateDto,
  GridItemUpdateDto,
  NodeType,
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

  return {
    view,
    nodeType,
    fetchView,
    createView,
    addNode,
    modifyNode,
    deleteNode,
  };
});
