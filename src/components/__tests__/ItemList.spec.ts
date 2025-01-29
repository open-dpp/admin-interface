import { describe, expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/vue";
import ItemList from "../products/ItemList.vue";

describe("ItemList.vue", () => {
  test("should render items", async () => {
    const items = [{ id: "id1" }, { id: "id2" }];
    render(ItemList, {
      props: {
        items,
      },
    });
    expect(screen.getByText("Artikel")).toBeTruthy();
    expect(screen.getByText("Alle erstellten Artikel")).toBeTruthy();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    const headerCells = within(rows[0]).getAllByRole("columnheader");
    expect(headerCells.map((h) => h.textContent)).toEqual(["", " ID "]);
    expect(
      (within(headerCells[0]).getByRole("checkbox") as HTMLInputElement)
        .checked,
    ).toBeFalsy();
    rows.slice(1).forEach((row, index) => {
      const cells = within(row).getAllByRole("cell");
      expect(
        (within(cells[0]).getByRole("checkbox") as HTMLInputElement).checked,
      ).toBeFalsy();
      expect(cells[1].textContent).toEqual(items[index].id);
    });
  });
  test("should create item", async () => {
    const items = [{ id: "id1" }, { id: "id2" }];
    const { emitted } = render(ItemList, {
      props: {
        items,
      },
    });
    const createButton = screen.getByRole("button", {
      name: "Artikel hinzufügen",
    });
    await fireEvent.click(createButton);

    expect(emitted().add[0]).toEqual([]);
  });
});
