import {defineStore} from 'pinia'
import {ref} from "vue";

export const useIndexStore = defineStore('index', () => {
    const selectedOrganization = ref<string | null>(null);

    return {selectedOrganization}
});