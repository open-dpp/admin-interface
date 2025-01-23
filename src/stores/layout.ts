import { defineStore } from "pinia";
import {computed, ref} from "vue";

export enum ModalType {}
export enum SidebarType {}

export interface BreadcrumItem {
  name: string;
  path: string;
}

export interface QuickAccessItem {
  name: string;
  path: string;
}

export const useLayoutStore = defineStore("layout", () => {
  const breadcrumbs = ref<BreadcrumItem[]>([]);
  const modalOpen = ref<ModalType | null>(null);
  const sidebarOpen = ref<SidebarType | null>(null);
  const isPageLoading = ref(false);
  const quickAccessItems = ref<QuickAccessItem[]>(localStorage.getItem('quickAccessItems') ? JSON.parse(localStorage.getItem('quickAccessItems')!) : []);

  const isAnyModalOpen = computed(() => !!modalOpen.value);
  const isAnySidebarOpen = computed(() => !!sidebarOpen.value);

  const openModal = (type: ModalType) => {
    if (!isAnyModalOpen.value) {
      modalOpen.value = type;
    }
  }

  const closeModal = () => {
    modalOpen.value = null;
  }

  const openSidebar = (type: SidebarType) => {
    if (!isAnySidebarOpen.value) {
      sidebarOpen.value = type;
    }
  }

  const closeSidebar = () => {
    sidebarOpen.value = null;
  }

  const addQuickAccessItem = (item: QuickAccessItem) => {
    quickAccessItems.value = quickAccessItems.value.filter(i => i.path === item.path);
    if (quickAccessItems.value.length === 5) {
      quickAccessItems.value.pop();
    }
    quickAccessItems.value.push(item);
    localStorage.setItem('quickAccessItems', JSON.stringify(quickAccessItems.value));
  }

  return { isAnyModalOpen, isAnySidebarOpen, openModal, closeModal, openSidebar, closeSidebar, breadcrumbs, isPageLoading, quickAccessItems, addQuickAccessItem };
});
