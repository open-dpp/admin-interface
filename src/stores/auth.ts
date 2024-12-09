import {defineStore} from 'pinia'
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    const selectedOrganization = ref<string>();

    return {selectedOrganization}
});