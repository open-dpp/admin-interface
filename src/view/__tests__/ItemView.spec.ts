import { describe, expect, it, Mocked, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/vue";
import ItemView from "../ItemView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../../router";
import axiosIns from "../../lib/axios.ts";
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

vi.mock("../../lib/axios.ts", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedAxios = axiosIns as Mocked<typeof axiosIns>;

describe("ItemView", () => {
  it("should fetch items on render and create new items", async () => {
    const data = [{ id: "i1" }];
    mockedAxios.get.mockResolvedValue({ data });
    const modelId = "someId";
    await router.push(`/models/${modelId}/items`);
    await router.isReady();
    render(ItemView, {
      global: {
        plugins: [router],
      },
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(`/models/${modelId}/items`);
    const createButton = screen.getByRole("button", {
      name: "Artikel hinzufügen",
    });
    await fireEvent.click(createButton);
    expect(mockedAxios.post).toHaveBeenCalledWith(`/models/${modelId}/items`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/models/${modelId}/items`);
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });
});
