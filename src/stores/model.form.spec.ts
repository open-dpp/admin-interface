import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { useModelFormStore } from "./model.form";
import {
  DataFieldDto,
  DataFieldType,
  DataValueCreateDto,
  ProductDataModelDto,
  SectionDto,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";

const mocks = vi.hoisted(() => {
  return {
    addModelData: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    models: {
      addModelData: mocks.addModelData,
    },
  },
}));

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
        { id: "id3", value: 7, dataSectionId: "s1.1", dataFieldId: "field3" },
        { id: "id4", value: 9, dataSectionId: "s1.1", dataFieldId: "field4" },
      ],
    };

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
          name: "Tech Specs",
          type: SectionType.GROUP,
          layout: {
            cols: { sm: 3 },
            colStart: { sm: 1 },
            colSpan: { sm: 1 },
            rowStart: { sm: 1 },
            rowSpan: { sm: 1 },
          },
          dataFields: [
            {
              id: "field1",
              type: DataFieldType.TEXT_FIELD,
              name: "Processor",
              options: {},
              layout: {
                colStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowStart: { sm: 1 },
                rowSpan: { sm: 1 },
              },
            },
            {
              id: "field2",
              type: DataFieldType.TEXT_FIELD,
              name: "RAM",
              options: {},
              layout: {
                colStart: { sm: 2 },
                colSpan: { sm: 1 },
                rowStart: { sm: 1 },
                rowSpan: { sm: 1 },
              },
            },
          ],
          subSections: ["s1.1"],
        },
        {
          id: "s1.1",
          name: "Sub Tech Specs",
          type: SectionType.GROUP,
          layout: {
            cols: { sm: 5 },
            colStart: { sm: 1 },
            colSpan: { sm: 1 },
            rowStart: { sm: 1 },
            rowSpan: { sm: 1 },
          },
          dataFields: [
            {
              id: "field3",
              type: DataFieldType.TEXT_FIELD,
              name: "Processor",
              options: {},
              layout: {
                colStart: { sm: 1 },
                colSpan: { sm: 1 },
                rowStart: { sm: 1 },
                rowSpan: { sm: 1 },
              },
            },
            {
              id: "field4",
              type: DataFieldType.TEXT_FIELD,
              name: "RAM",
              options: {},
              layout: {
                colStart: { sm: 2 },
                colSpan: { sm: 1 },
                rowStart: { sm: 1 },
                rowSpan: { sm: 1 },
              },
            },
          ],
          subSections: [],
        },
      ],
    };

    let result = modelFormStore.getFormData("s1", { id1: 8 });
    expect(result).toEqual({ id1: 8, id2: undefined, id3: 7, id4: 9 });

    result = modelFormStore.getFormData("s1", { id3: 9 });
    expect(result).toEqual({ id1: 2, id2: undefined, id3: 9, id4: 9 });
  });

  const dataFieldS1F1: DataFieldDto = {
    id: "s1-f1",
    type: DataFieldType.TEXT_FIELD,
    name: "Processor",
    options: {},
    layout: {
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
  };

  const section11Id = "s1.1";
  const section111Id = "s1.1.1";

  const section1: SectionDto = {
    id: "s1",
    type: SectionType.REPEATABLE,
    parentId: undefined,
    name: "Tech Specs",
    dataFields: [dataFieldS1F1],
    subSections: [section11Id],
    layout: {
      cols: { sm: 3 },
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
  };

  const section11: SectionDto = {
    id: section11Id,
    type: SectionType.GROUP,
    parentId: section1.id,
    name: "Dimensions",
    dataFields: [],
    subSections: ["s1.1.1"],
    layout: {
      cols: { sm: 5 },
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
  };

  const dataFieldS111F1: DataFieldDto = {
    id: "s1.1.1-f1",
    type: DataFieldType.TEXT_FIELD,
    name: "Amount",
    options: {},
    layout: {
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
  };

  const dataFieldS111F2: DataFieldDto = {
    id: "s1.1.1-f2",
    type: DataFieldType.TEXT_FIELD,
    name: "Unit",
    options: {},
    layout: {
      colStart: { sm: 2 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
  };

  const section111: SectionDto = {
    id: section111Id,
    type: SectionType.GROUP,
    parentId: section11.id,
    name: "Single Dimension",
    dataFields: [dataFieldS111F1, dataFieldS111F2],
    subSections: [],
    layout: {
      cols: { sm: 8 },
      colStart: { sm: 1 },
      colSpan: { sm: 1 },
      rowStart: { sm: 1 },
      rowSpan: { sm: 1 },
    },
  };

  const productDataModel: ProductDataModelDto = {
    id: "pid",
    name: "Handy",
    version: "1.0.0",
    visibility: VisibilityLevel.PUBLIC,
    ownedByOrganizationId: "oId",
    createdByUserId: "uId",
    sections: [section1, section11, section111],
  };

  const model = {
    id: "id1",
    description: "desc",
    uniqueProductIdentifiers: [],
    productDataModelId: "pid",
    owner: "oId",
    name: "my model",
    dataValues: [
      {
        id: "dvS1F1_row0",
        value: 2,
        dataSectionId: section1.id,
        dataFieldId: dataFieldS1F1.id,
        row: 0,
      },
      {
        id: "dvS111F1_row0",
        value: 7,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F1.id,
        row: 0,
      },
      {
        id: "dvS111F2_row0",
        value: 9,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F2.id,
        row: 0,
      },
      {
        id: "dvS1F1_row1",
        value: 2,
        dataSectionId: section1.id,
        dataFieldId: dataFieldS1F1.id,
        row: 1,
      },
      {
        id: "dvS111F1_row1",
        value: 7,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F1.id,
        row: 1,
      },
      {
        id: "dvS111F2_row1",
        value: 9,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F2.id,
        row: 1,
      },
    ],
  };

  it("should getFormSchema", () => {
    const modelFormStore = useModelFormStore();

    modelFormStore.productDataModel = productDataModel;

    modelFormStore.model = model;

    const actual = modelFormStore.getFormSchema(section1);

    const grid1Exp = {
      $el: "div",
      attrs: {
        class:
          "grid gap-1 items-center sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 sm:grid-cols-3",
      },
    };

    const grid11Exp = {
      $el: "div",
      attrs: {
        class:
          "grid gap-1 items-center sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 sm:grid-cols-5",
      },
    };

    const grid111Exp = {
      $el: "div",
      attrs: {
        class:
          "grid gap-1 items-center sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 sm:grid-cols-8",
      },
    };

    const fieldS111F1Exp = {
      $cmp: "TextField",
      props: {
        id: "dvS111F1_row0",
        name: "dvS111F1_row0",
        label: dataFieldS111F1.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1",
      },
    };
    const fieldS111F2Exp = {
      $cmp: "TextField",
      props: {
        id: "dvS111F2_row0",
        name: "dvS111F2_row0",
        label: dataFieldS111F2.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-2 sm:row-span-1 sm:row-start-1",
      },
    };

    const fieldS1F1Exp = {
      $cmp: "TextField",
      props: {
        id: "dvS1F1_row0",
        name: "dvS1F1_row0",
        label: dataFieldS1F1.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1",
      },
    };

    const expected = [
      {
        ...grid1Exp,
        children: [
          {
            ...grid11Exp,
            children: [
              {
                ...grid111Exp,
                children: [fieldS111F1Exp, fieldS111F2Exp],
              },
            ],
          },
          fieldS1F1Exp,
        ],
      },
      {
        $el: "div",
        attrs: {
          class: "w-full border-t border-gray-300 m-2",
        },
      },
      {
        ...grid1Exp,
        children: [
          {
            ...grid11Exp,
            children: [
              {
                ...grid111Exp,
                children: [
                  {
                    ...fieldS111F1Exp,
                    props: {
                      ...fieldS111F1Exp.props,
                      id: "dvS111F1_row1",
                      name: "dvS111F1_row1",
                    },
                  },
                  {
                    ...fieldS111F2Exp,
                    props: {
                      ...fieldS111F2Exp.props,
                      id: "dvS111F2_row1",
                      name: "dvS111F2_row1",
                    },
                  },
                ],
              },
            ],
          },
          {
            ...fieldS1F1Exp,
            props: {
              ...fieldS1F1Exp.props,
              id: "dvS1F1_row1",
              name: "dvS1F1_row1",
            },
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
  });

  it("should add row to section", () => {
    const modelFormStore = useModelFormStore();

    modelFormStore.productDataModel = productDataModel;

    modelFormStore.model = model;

    const expected: DataValueCreateDto[] = [
      {
        value: undefined,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F1.id,
        row: 2,
      },
      {
        value: undefined,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F2.id,
        row: 2,
      },
      {
        value: undefined,
        dataSectionId: section1.id,
        dataFieldId: dataFieldS1F1.id,
        row: 2,
      },
    ];
    mocks.addModelData.mockResolvedValue({
      data: { ...model, dataValues: [...model.dataValues, expected] },
    });
    modelFormStore.addRowToSection(section1.id);

    expect(mocks.addModelData).toHaveBeenCalledWith(model.id, expected);
  });
});
