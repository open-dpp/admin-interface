import { defineStore } from "pinia";
import { ref } from "vue";
import {LAST_SELECTED_ORGANIZATION_ID_KEY} from "../const.ts";

export const useIndexStore = defineStore("index", () => {
  const selectedOrganization = ref<string | null>(localStorage.getItem(LAST_SELECTED_ORGANIZATION_ID_KEY) ? localStorage.getItem(LAST_SELECTED_ORGANIZATION_ID_KEY) : null);

  const selectOrganization = (organizationId: string | null) => {
    if (!organizationId) {
      localStorage.removeItem(LAST_SELECTED_ORGANIZATION_ID_KEY);
      selectedOrganization.value = null;
      return;
    }
    localStorage.setItem(LAST_SELECTED_ORGANIZATION_ID_KEY, organizationId);
    selectedOrganization.value = organizationId;
  }

  return { selectedOrganization, selectOrganization };
});
