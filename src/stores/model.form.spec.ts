import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useModelFormStore } from "./model.form";
import {
  DataFieldType,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";

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

  it("should getFormSchema", () => {
    const modelFormStore = useModelFormStore();
    modelFormStore.productDataModel = {
      id: "pid",
      name: "Handy",
      version: "1.0.0",
      visibility: VisibilityLevel.PUBLIC,
      ownedByOrganizationId: "oId",
      createdByUserId: "uId",
      sections: [
        {
          id: "s1",
          type: SectionType.GROUP,
          parentId: undefined,
          name: "Tech Specs",
          dataFields: [
            {
              id: "s1-f1",
              type: DataFieldType.TEXT_FIELD,
              name: "Processor",
              options: {},
            },
          ],
          subSections: ["s1.1"],
        },
        {
          id: "s1.1",
          type: SectionType.REPEATABLE,
          parentId: "s1",
          name: "Dimensions",
          dataFields: [],
          subSections: ["s1.1.1"],
        },
        {
          id: "s1.1.1",
          type: SectionType.GROUP,
          parentId: "s1.1",
          name: "Single Dimension",
          dataFields: [
            {
              id: "s1.1.1-f1",
              type: DataFieldType.TEXT_FIELD,
              name: "Amount",
              options: {},
            },
            {
              id: "s1.1.1-f2",
              type: DataFieldType.TEXT_FIELD,
              name: "Unit",
              options: {},
            },
          ],
          subSections: [],
        },
      ],
    };
    modelFormStore.getFormSchema("s1");
  });
});
