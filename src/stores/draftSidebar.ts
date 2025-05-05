import { defineStore } from "pinia";
import { Component, DefineComponent, markRaw, ref, shallowRef } from "vue";
import ItemSelection from "../components/product-data-model-drafts/ItemSelection.vue";
import ItemForm from "../components/product-data-model-drafts/ItemForm.vue";

export enum SidebarContentType {
  ITEM_SELECTION = "ITEM_SELECTION",
  ITEM_FORM = "ITEM_FORM",
}
type Comp = Component | DefineComponent;
type CompProps = Record<string, unknown>;
export const useDraftSidebarStore = defineStore("draftSidebar", () => {
  const isOpen = ref<boolean>(false);
  const title = ref<string>("Title");
  const subTitle = ref<string>("Sub Title");

  const content = shallowRef<Comp | null>(null);
  const contentProps = ref<CompProps>({});

  const sidebarContent = [
    {
      type: SidebarContentType.ITEM_SELECTION,
      title: "Knoten hinzufügen",
      subTitle: "Auswahl",
      content: ItemSelection,
    },
    {
      type: SidebarContentType.ITEM_FORM,
      title: "Knoten hinzufügen",
      subTitle: "Konfiguration",
      content: ItemForm,
    },
  ];

  const open = (type: SidebarContentType, initProps: CompProps) => {
    setContentWithProps(type, initProps);
    isOpen.value = true;
  };

  const setContentWithProps = (
    type: SidebarContentType,
    newProps: CompProps,
  ) => {
    const found = sidebarContent.find((s) => s.type === type);
    if (!found) {
      throw new Error(`Not supported sidebar content type ${type}`);
    }
    content.value = markRaw(found.content);
    title.value = found.title;
    subTitle.value = found.subTitle;
    contentProps.value = newProps;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    title,
    subTitle,
    content,
    isOpen,
    contentProps,
    open,
    setContentWithProps,
    close,
  };
});
