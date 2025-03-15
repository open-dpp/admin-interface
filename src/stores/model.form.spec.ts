import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useModelFormStore } from "./model.form";

describe("ModelFormStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  it("should merge data values with form data", async () => {
    const modelFormStore = useModelFormStore();
    modelFormStore.model = {
      id: "id1",
      description: "desc",
      uniqueProductIdentifiers: [],
      productDataModelId: "pid",
      owner: "oId",
      name: "my model",
      dataValues: [
        { id: "id1", value: 2, dataSectionId: "s1", dataFieldId: "field1" },
        {
          id: "id2",
          value: undefined,
          dataSectionId: "s1",
          dataFieldId: "field2",
        },
      ],
    };

    let result = modelFormStore.getFormData("s1", { id1: 8 });
    expect(result).toEqual({ id1: 8, id2: undefined });

    result = modelFormStore.getFormData("s1", { id3: 9 });
    expect(result).toEqual({ id1: 2, id2: undefined });
  });
});
