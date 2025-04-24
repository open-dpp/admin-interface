import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { SidebarContentType, useDraftSidebarStore } from "./draftSidebar";
import NodeSelection from "../components/product-data-model-drafts/NodeSelection.vue";
import { SectionType } from "@open-dpp/api-client";
import NodeForm from "../components/product-data-model-drafts/NodeForm.vue";

describe("DraftSidebarStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  it("should open NodeSelection and close sidebar", async () => {
    const draftSidebarStore = useDraftSidebarStore();
    expect(draftSidebarStore.isOpen).toBeFalsy();
    draftSidebarStore.open(SidebarContentType.NODE_SELECTION, {
      parentId: "p1",
    });
    expect(draftSidebarStore.title).toEqual("Knoten hinzufügen");
    expect(draftSidebarStore.subTitle).toEqual("Auswahl");
    expect(draftSidebarStore.isOpen).toBeTruthy();
    expect(draftSidebarStore.content).toEqual(NodeSelection);
    expect(draftSidebarStore.contentProps).toEqual({ parentId: "p1" });
    draftSidebarStore.close();
    expect(draftSidebarStore.isOpen).toBeFalsy();
  });

  it("should set NodeForm", async () => {
    const draftSidebarStore = useDraftSidebarStore();
    draftSidebarStore.setContentWithProps(SidebarContentType.NODE_FORM, {
      type: SectionType.REPEATABLE,
      parentId: "id",
    });
    expect(draftSidebarStore.title).toEqual("Knoten hinzufügen");
    expect(draftSidebarStore.subTitle).toEqual("Konfiguration");
    expect(draftSidebarStore.content).toEqual(NodeForm);
    expect(draftSidebarStore.contentProps).toEqual({
      type: SectionType.REPEATABLE,
      parentId: "id",
    });
  });
});
