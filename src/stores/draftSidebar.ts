import { defineStore } from "pinia";
import { Component, DefineComponent, markRaw, ref, shallowRef } from "vue";
import NodeSelection from "../components/product-data-model-drafts/NodeSelection.vue";
import NodeForm from "../components/product-data-model-drafts/NodeForm.vue";

export enum SidebarContentType {
  NODE_SELECTION = "NODE_SELECTION",
  NODE_FORM = "NODE_FORM",
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
      type: SidebarContentType.NODE_SELECTION,
      title: "Knoten hinzufügen",
      subTitle: "Auswahl",
      content: NodeSelection,
    },
    {
      type: SidebarContentType.NODE_FORM,
      title: "Knoten hinzufügen",
      subTitle: "Konfiguration",
      content: NodeForm,
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
