import { describe, expect, Mocked, test, vi } from "vitest";
import axiosIns from "../../lib/axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import UpdateModel from "../models/UpdateModel.vue";

vi.mock("../../lib/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedAxios = axiosIns as Mocked<typeof axiosIns>;

describe("UpdateModel.vue", () => {
  test("updates a model", async () => {
    const modelId = "productId";
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
        id: modelId,
        name: "My product",
        description: "Product description",
      },
    });
    mockedAxios.patch.mockResolvedValue({ status: 200 });
    render(UpdateModel, {
      props: { modelValue: true, modelId },
    });
    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(`models/${modelId}`),
    );
    expect(await screen.findByText("Modell aktualisieren")).toBeTruthy();
    await fireEvent.click(screen.getByText("Speichern"));
    expect(mockedAxios.patch).toHaveBeenCalledWith(`models/${modelId}`, {
      name: "My product",
      description: "Product description",
    });
    await fireEvent.update(screen.getByLabelText("Name"), "My new product");
    await fireEvent.update(
      screen.getByLabelText("Beschreibung"),
      "New product description",
    );
    await fireEvent.click(screen.getByText("Speichern"));
    expect(mockedAxios.patch).toHaveBeenCalledWith(`models/${modelId}`, {
      name: "My new product",
      description: "New product description",
    });
  });
});
