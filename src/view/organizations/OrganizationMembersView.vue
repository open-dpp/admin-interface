<template>
  <section>
    <OrganizationMembersList
      v-if="organization"
      :members="members"
      :organization="organization"
      @invited-user="fetchMembers"
    />
  </section>
</template>
<script lang="ts" setup>
import OrganizationMembersList from "../../components/organizations/OrganizationMembersList.vue";
import { onMounted, ref } from "vue";
import { OrganizationDto, UserDto } from "@open-dpp/api-client";
import apiClient from "../../lib/api-client";
import { useIndexStore } from "../../stores";

const indexStore = useIndexStore();

const members = ref<Array<UserDto>>([]);
const organization = ref<OrganizationDto | null>(null);

const fetchMembers = async () => {
  if (indexStore.selectedOrganization) {
    const res = await apiClient.organizations.getMembers(
      indexStore.selectedOrganization,
    );
    members.value = res.data;
  }
};

onMounted(async () => {
  if (indexStore.selectedOrganization) {
    const resOrg = await apiClient.organizations.getById(
      indexStore.selectedOrganization,
    );
    organization.value = resOrg.data;
    await fetchMembers();
  }
});
</script>
