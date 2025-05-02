import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { useModelFormStore } from "./model.form";
import {
  DataFieldDto,
  DataFieldRefDto,
  DataFieldType,
  DataValueCreateDto,
  NodeType,
  ProductDataModelDto,
  SectionDto,
  SectionGridDto,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";
import { TargetGroup } from "../../../open-dpp-api-client";

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
      data: {
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
            dataFields: [
              {
                id: "field1",
                type: DataFieldType.TEXT_FIELD,
                name: "Processor",
                options: {},
              },
              {
                id: "field2",
                type: DataFieldType.TEXT_FIELD,
                name: "RAM",
                options: {},
              },
            ],
            subSections: ["s1.1"],
          },
          {
            id: "s1.1",
            name: "Sub Tech Specs",
            type: SectionType.GROUP,
            dataFields: [
              {
                id: "field3",
                type: DataFieldType.TEXT_FIELD,
                name: "Processor",
                options: {},
              },
              {
                id: "field4",
                type: DataFieldType.TEXT_FIELD,
                name: "RAM",
                options: {},
              },
            ],
            subSections: [],
          },
        ],
      },
      view: {
        id: "viewId",
        version: "1.0.0",
        targetGroup: TargetGroup.ALL,
        dataModelId: "pid",
        nodes: [],
      },
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
  };

  const dataFieldRefS1F1: DataFieldRefDto = {
    id: "s1-f1-ref",
    children: [],
    type: NodeType.DATA_FIELD_REF,
    fieldId: dataFieldS1F1.id,
    colStart: { sm: 1 },
    colSpan: { sm: 1 },
    rowStart: { sm: 1 },
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
  };

  const sectionGridId11 = "sg11";

  const sectionGrid1: SectionGridDto = {
    id: "sg1",
    type: NodeType.SECTION_GRID,
    cols: { sm: 3 },
    colStart: { sm: 1 },
    colSpan: { sm: 1 },
    sectionId: section1.id,
    children: [sectionGridId11, dataFieldRefS1F1.id],
  };

  const section11: SectionDto = {
    id: section11Id,
    type: SectionType.GROUP,
    parentId: section1.id,
    name: "Dimensions",
    dataFields: [],
    subSections: ["s1.1.1"],
  };

  const sectionGridId111 = "sg111";

  const sectionGrid11: SectionGridDto = {
    id: sectionGridId11,
    type: NodeType.SECTION_GRID,
    cols: { sm: 5 },
    colStart: { sm: 1 },
    colSpan: { sm: 1 },
    sectionId: section11.id,
    parentId: sectionGrid1.id,
    children: [sectionGridId111],
  };

  const dataFieldS111F1: DataFieldDto = {
    id: "s1.1.1-f1",
    type: DataFieldType.TEXT_FIELD,
    name: "Amount",
    options: {},
  };

  const dataFieldRefS111F1: DataFieldRefDto = {
    id: "s1.1.1-f1-ref",
    children: [],
    type: NodeType.DATA_FIELD_REF,
    fieldId: dataFieldS111F1.id,
    colStart: { sm: 1 },
    colSpan: { sm: 1 },
    rowStart: { sm: 1 },
  };

  const dataFieldS111F2: DataFieldDto = {
    id: "s1.1.1-f2",
    type: DataFieldType.TEXT_FIELD,
    name: "Unit",
    options: {},
  };

  const dataFieldRefS111F2: DataFieldRefDto = {
    id: "s1.1.1-f2-ref",
    children: [],
    type: NodeType.DATA_FIELD_REF,
    fieldId: dataFieldS111F2.id,
    colStart: { sm: 2 },
    colSpan: { sm: 1 },
    rowStart: { sm: 1 },
  };

  const section111: SectionDto = {
    id: section111Id,
    type: SectionType.GROUP,
    parentId: section11.id,
    name: "Single Dimension",
    dataFields: [dataFieldS111F1, dataFieldS111F2],
    subSections: [],
  };

  const sectionGrid111: SectionGridDto = {
    id: sectionGridId111,
    type: NodeType.SECTION_GRID,
    cols: { sm: 8 },
    colStart: { sm: 1 },
    colSpan: { sm: 1 },
    sectionId: section111.id,
    parentId: sectionGrid11.id,
    children: [dataFieldRefS111F1.id, dataFieldRefS111F2.id],
  };

  const productDataModel: ProductDataModelDto = {
    data: {
      id: "pid",
      name: "Handy",
      version: "1.0.0",
      visibility: VisibilityLevel.PUBLIC,
      ownedByOrganizationId: "oId",
      createdByUserId: "uId",
      sections: [section1, section11, section111],
    },
    view: {
      id: "viewId",
      version: "1.0.0",
      targetGroup: TargetGroup.ALL,
      dataModelId: "pid",
      nodes: [
        sectionGrid1,
        dataFieldRefS1F1,
        sectionGrid11,
        sectionGrid111,
        dataFieldRefS111F1,
        dataFieldRefS111F2,
      ],
    },
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

    const actual = modelFormStore.getFormSchema(sectionGrid1, section1);

    const grid1Exp = {
      $el: "div",
      attrs: {
        class: "grid sm:col-span-1 sm:col-start-1 sm:grid-cols-3",
      },
    };

    const grid11Exp = {
      $el: "div",
      attrs: {
        class: "grid sm:col-span-1 sm:col-start-1 sm:grid-cols-5",
      },
    };

    const grid111Exp = {
      $el: "div",
      attrs: {
        class: "grid sm:col-span-1 sm:col-start-1 sm:grid-cols-8",
      },
    };

    const fieldS111F1Exp = {
      $cmp: "TextField",
      props: {
        id: "dvS111F1_row0",
        name: "dvS111F1_row0",
        label: dataFieldS111F1.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-1 sm:row-start-1",
      },
    };
    const fieldS111F2Exp = {
      $cmp: "TextField",
      props: {
        id: "dvS111F2_row0",
        name: "dvS111F2_row0",
        label: dataFieldS111F2.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-2 sm:row-start-1",
      },
    };

    const fieldS1F1Exp = {
      $cmp: "TextField",
      props: {
        id: "dvS1F1_row0",
        name: "dvS1F1_row0",
        label: dataFieldS1F1.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-1 sm:row-start-1",
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
