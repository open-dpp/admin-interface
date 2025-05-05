import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { SidebarContentType, useDraftSidebarStore } from "./draftSidebar";
import ItemSelection from "../components/product-data-model-drafts/ItemSelection.vue";
import { SectionType } from "@open-dpp/api-client";
import ItemForm from "../components/product-data-model-drafts/ItemForm.vue";

describe("DraftSidebarStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  it("should open NodeSelection and close sidebar", async () => {
    const draftSidebarStore = useDraftSidebarStore();
    expect(draftSidebarStore.isOpen).toBeFalsy();
    draftSidebarStore.open(SidebarContentType.ITEM_SELECTION, {
      parentId: "p1",
    });
    expect(draftSidebarStore.title).toEqual("Knoten hinzufügen");
    expect(draftSidebarStore.subTitle).toEqual("Auswahl");
    expect(draftSidebarStore.isOpen).toBeTruthy();
    expect(draftSidebarStore.content).toEqual(ItemSelection);
    expect(draftSidebarStore.contentProps).toEqual({ parentId: "p1" });
    draftSidebarStore.close();
    expect(draftSidebarStore.isOpen).toBeFalsy();
  });

  it("should set NodeForm", async () => {
    const draftSidebarStore = useDraftSidebarStore();
    draftSidebarStore.setContentWithProps(SidebarContentType.ITEM_FORM, {
      type: SectionType.REPEATABLE,
      parentId: "id",
    });
    expect(draftSidebarStore.title).toEqual("Knoten hinzufügen");
    expect(draftSidebarStore.subTitle).toEqual("Konfiguration");
    expect(draftSidebarStore.content).toEqual(ItemForm);
    expect(draftSidebarStore.contentProps).toEqual({
      type: SectionType.REPEATABLE,
      parentId: "id",
    });
  });
});
