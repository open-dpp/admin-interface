import { describe, expect, Mocked, test, vi } from "vitest";
import axiosIns from "../../lib/axios";
import { fireEvent, render, screen } from "@testing-library/vue";
import CreateProduct from "../products/CreateProduct.vue";

vi.mock("../../lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedAxios = axiosIns as Mocked<typeof axiosIns>;

describe("CreateProduct.vue", () => {
  test("creates a product with given name and description", async () => {
    mockedAxios.post.mockResolvedValue({ status: 201 });
    render(CreateProduct, {
      props: { modelValue: true },
    });
    expect(await screen.findByText("Neues Produkt")).toBeTruthy();
    const nameInput = screen.getByLabelText("Name");
    const descriptionInput = screen.getByLabelText("Beschreibung");

    await fireEvent.update(nameInput, "My new product");
    await fireEvent.update(descriptionInput, "My product description");
    await fireEvent.click(screen.getByText("Speichern"));
    expect(mockedAxios.post).toHaveBeenCalledWith("products", {
      name: "My new product",
      description: "My product description",
    });
  });
});
