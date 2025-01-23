import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "../lib/axios.ts";

interface Organization {
  id: string;
  name: string;
}

export const useOrganizationsStore = defineStore("organizations", () => {
  const organizations = ref<Organization[]>([]);

  const fetchOrganizations = async () => {
    const response = await axios.get("organizations");
    organizations.value = response.data;
  };

  const createOrganization = async (data: { name: string }) => {
    const response = await axios.post("organizations", data);
    organizations.value.push(response.data);
    return response.data;
  };

  return { organizations, fetchOrganizations, createOrganization };
});
