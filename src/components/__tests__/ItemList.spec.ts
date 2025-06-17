import { describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/vue";
import ItemList from "../items/ItemList.vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { routes } from "../../router";
import { createPinia } from "pinia";

const pinia = createPinia();
const router = createRouter({
  history: createMemoryHistory(),
  routes: routes,
});

describe("ItemList.vue", () => {
  test("should render items", async () => {
    const items = [{ id: "id1" }, { id: "id2" }];
    render(ItemList, {
      props: {
        items,
      },
      global: {
        plugins: [pinia, router],
      },
    });
    expect(screen.getByText("Artikelpässe")).toBeTruthy();
    expect(screen.getByText("Alle Pässe auf Einzelartikelebene.")).toBeTruthy();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    const headerCells = within(rows[0]).getAllByRole("columnheader");
    expect(headerCells.map((h) => h.textContent)).toEqual(["ID", "Aktionen"]);

    rows.slice(1).forEach((row, index) => {
      const cells = within(row).getAllByRole("cell");
      expect(cells[0].textContent).toEqual(items[index].id);
      expect(cells[1].textContent).toEqual("EditierenQR-Code");
    });
  });
  test("should create item", async () => {
    const items = [{ id: "id1" }, { id: "id2" }];
    const { emitted } = render(ItemList, {
      props: {
        items,
      },
      global: {
        plugins: [pinia, router],
      },
    });
    const createButton = screen.getByRole("button", {
      name: "Artikelpass hinzufügen",
    });
    await fireEvent.click(createButton);

    expect(emitted().add[0]).toEqual([]);
  });
});
