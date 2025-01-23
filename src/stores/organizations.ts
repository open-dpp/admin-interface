import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "../lib/axios.ts";

export const useOrganizationsStore = defineStore("organizations", () => {
  const organizations = ref<any[]>([]);

  const fetchOrganizations = async () => {
    const response = await axios.get("organizations");
    organizations.value = response.data;
  };

  const createOrganization = async (organization: any) => {
    const response = await axios.post("organizations", organization);
    organizations.value.push(response.data);
    return response.data;
  }

  return { organizations, fetchOrganizations, createOrganization };
});