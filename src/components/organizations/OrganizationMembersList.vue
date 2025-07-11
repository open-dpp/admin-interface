<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          Mitglieder
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Eine Liste von allen Mitgliedern dieser Organisation.
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <InviteMemberDialog
          v-if="layoutStore.modalOpen === ModalType.INVITE_USER_MODAL"
          :organization-id="organization.id"
          @close="layoutStore.closeModal()"
          @invited-user="emit('invitedUser')"
        />
        <button
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          @click="layoutStore.openModal(ModalType.INVITE_USER_MODAL)"
        >
          Benutzer einladen
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  scope="col"
                >
                  Name
                </th>
                <th
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  scope="col"
                >
                  Rolle
                </th>
                <th class="relative py-3.5 pl-3 pr-4 sm:pr-0" scope="col">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="member in members" :key="member.id">
                <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div class="flex items-center">
                    <div class="h-11 w-11 shrink-0">
                      <UserCircleIcon class="h-11 w-11 rounded-full" />
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900">
                        {{ member.email }}
                      </div>
                      <div class="mt-1 text-gray-500">{{ member.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div
                    v-if="organization.ownedByUserId === member.id"
                    class="text-gray-900"
                  >
                    Admin
                  </div>
                  <div
                    v-if="organization.createdByUserId === member.id"
                    class="mt-1 text-gray-500"
                  >
                    Ersteller
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { OrganizationDto, UserDto } from "@open-dpp/api-client";
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import InviteMemberDialog from "./InviteMemberDialog.vue";
import { ModalType, useLayoutStore } from "../../stores/layout";

const layoutStore = useLayoutStore();

defineProps<{
  organization: OrganizationDto;
  members: Array<UserDto>;
}>();

const emit = defineEmits<{
  (e: "invitedUser"): void;
}>();
</script>
