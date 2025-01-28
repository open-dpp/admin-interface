import { describe, expect, Mocked, test, vi } from "vitest";
import axiosIns from "../../lib/axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import UpdateProduct from "../products/UpdateProduct.vue";

vi.mock("../../lib/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedAxios = axiosIns as Mocked<typeof axiosIns>;

describe("UpdateProduct.vue", () => {
  test("updates a product", async () => {
    const productId = "productId";
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
        id: productId,
        name: "My product",
        description: "Product description",
      },
    });
    mockedAxios.patch.mockResolvedValue({ status: 200 });
    render(UpdateProduct, {
      props: { modelValue: true, productId },
    });
    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(`products/${productId}`),
    );
    expect(await screen.findByText("Produkt aktualisieren")).toBeTruthy();
    await fireEvent.click(screen.getByText("Speichern"));
    expect(mockedAxios.patch).toHaveBeenCalledWith(`products/${productId}`, {
      name: "My product",
      description: "Product description",
    });
    await fireEvent.update(screen.getByLabelText("Name"), "My new product");
    await fireEvent.update(
      screen.getByLabelText("Beschreibung"),
      "New product description",
    );
    await fireEvent.click(screen.getByText("Speichern"));
    expect(mockedAxios.patch).toHaveBeenCalledWith(`products/${productId}`, {
      name: "My new product",
      description: "New product description",
    });
  });
});
