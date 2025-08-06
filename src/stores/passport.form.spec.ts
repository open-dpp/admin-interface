import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { usePassportFormStore } from "./passport.form";
import {
  DataFieldDto,
  DataFieldType,
  DataValueDto,
  GranularityLevel,
  ItemDto,
  ModelDto,
  SectionDto,
  SectionType,
  TemplateDto,
} from "@open-dpp/api-client";

const mocks = vi.hoisted(() => {
  return {
    addData: vi.fn(),
    getModelById: vi.fn(),
    getItemById: vi.fn(),
    getTemplateById: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    dpp: {
      models: {
        addData: mocks.addData,
        getById: mocks.getModelById,
      },
      items: {
        getById: mocks.getItemById,
      },
      templates: {
        getById: mocks.getTemplateById,
      },
    },
  },
}));

describe("PassportFormStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia());
  });

  it("should merge data values with form data", async () => {
    const passportFormStore = usePassportFormStore();
    passportFormStore.passport = {
      id: "id1",
      name: "my model",
      uniqueProductIdentifiers: [],
      templateId: "pid",
      dataValues: [
        { value: 2, dataSectionId: "s1", dataFieldId: "field1", row: 0 },
        {
          value: undefined,
          dataSectionId: "s1",
          dataFieldId: "field2",
          row: 0,
        },
        { value: 7, dataSectionId: "s1-1", dataFieldId: "field3", row: 0 },
        { value: 9, dataSectionId: "s1-1", dataFieldId: "field4", row: 0 },
      ],
    };

    passportFormStore.template = {
      id: "pid",
      name: "Handy",
      version: "1.0.0",
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
              granularityLevel: GranularityLevel.MODEL,
            },
            {
              id: "field2",
              type: DataFieldType.TEXT_FIELD,
              name: "RAM",
              options: {},
              granularityLevel: GranularityLevel.MODEL,
            },
          ],
          subSections: ["s1-1"],
        },
        {
          id: "s1-1",
          name: "Sub Tech Specs",
          type: SectionType.GROUP,
          dataFields: [
            {
              id: "field3",
              type: DataFieldType.TEXT_FIELD,
              name: "Processor",
              options: {},
              granularityLevel: GranularityLevel.MODEL,
            },
            {
              id: "field4",
              type: DataFieldType.TEXT_FIELD,
              name: "RAM",
              options: {},
              granularityLevel: GranularityLevel.MODEL,
            },
          ],
          subSections: [],
        },
      ],
    };

    let result = passportFormStore.getFormData("s1", { "s1.field1.0": 8 });
    expect(result).toEqual({
      "s1.field1.0": 8,
      "s1.field2.0": undefined,
      "s1-1.field3.0": 7,
      "s1-1.field4.0": 9,
    });

    result = passportFormStore.getFormData("s1", { "s1-1.field3.0": 9 });
    expect(result).toEqual({
      "s1.field1.0": 2,
      "s1.field2.0": undefined,
      "s1-1.field3.0": 9,
      "s1-1.field4.0": 9,
    });
  });

  const dataFieldS1F1: DataFieldDto = {
    id: "s1-f1",
    type: DataFieldType.TEXT_FIELD,
    name: "Processor",
    options: {},
    granularityLevel: GranularityLevel.MODEL,
  };

  const section11Id = "s1-1";
  const section111Id = "s1-1-1";

  const section1: SectionDto = {
    id: "s1",
    type: SectionType.REPEATABLE,
    parentId: undefined,
    name: "Tech Specs",
    dataFields: [dataFieldS1F1],
    subSections: [section11Id],
  };

  const section11: SectionDto = {
    id: section11Id,
    type: SectionType.GROUP,
    parentId: section1.id,
    name: "Dimensions",
    dataFields: [],
    subSections: ["s1-1-1"],
  };

  const dataFieldS111F1: DataFieldDto = {
    id: "s1-1-1-f1",
    type: DataFieldType.TEXT_FIELD,
    name: "Amount",
    options: {},
    granularityLevel: GranularityLevel.MODEL,
  };

  const dataFieldS111F2: DataFieldDto = {
    id: "s1-1-1-f2",
    type: DataFieldType.TEXT_FIELD,
    name: "Unit",
    options: {},
    granularityLevel: GranularityLevel.MODEL,
  };

  const section111: SectionDto = {
    id: section111Id,
    type: SectionType.GROUP,
    parentId: section11.id,
    name: "Single Dimension",
    dataFields: [dataFieldS111F1, dataFieldS111F2],
    subSections: [],
  };

  const templateDto: TemplateDto = {
    id: "pid",
    name: "Handy",
    version: "1.0.0",
    ownedByOrganizationId: "oId",
    createdByUserId: "uId",
    sections: [section1, section11, section111],
  };

  const model: ModelDto = {
    id: "id1",
    description: "desc",
    uniqueProductIdentifiers: [],
    templateId: "pid",
    owner: "oId",
    name: "my model",
    dataValues: [
      {
        value: 2,
        dataSectionId: section1.id,
        dataFieldId: dataFieldS1F1.id,
        row: 0,
      },
      {
        value: 7,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F1.id,
        row: 0,
      },
      {
        value: 9,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F2.id,
        row: 0,
      },
      {
        value: 2,
        dataSectionId: section1.id,
        dataFieldId: dataFieldS1F1.id,
        row: 1,
      },
      {
        value: 7,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F1.id,
        row: 1,
      },
      {
        value: 9,
        dataSectionId: section111.id,
        dataFieldId: dataFieldS111F2.id,
        row: 1,
      },
    ],
  };

  it("should getFormSchemaRepeatable", async () => {
    const passportFormStore = usePassportFormStore();

    mocks.getTemplateById.mockResolvedValue({ data: templateDto });
    mocks.getModelById.mockResolvedValue({ data: model });
    await passportFormStore.fetchModel(model.id);

    const actual = passportFormStore.getFormSchemaRepeatable(section1);

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
        id: "s1-1-1.s1-1-1-f1.0",
        name: "s1-1-1.s1-1-1-f1.0",
        label: dataFieldS111F1.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1",
        options: {},
      },
    };
    const fieldS111F2Exp = {
      $cmp: "TextField",
      props: {
        id: "s1-1-1.s1-1-1-f2.0",
        name: "s1-1-1.s1-1-1-f2.0",
        label: dataFieldS111F2.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-2 sm:row-span-1 sm:row-start-1",
        options: {},
      },
    };

    const fieldS1F1Exp = {
      $cmp: "TextField",
      props: {
        id: "s1.s1-f1.0",
        name: "s1.s1-f1.0",
        label: dataFieldS1F1.name,
        validation: "required",
        className: "sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1",
        options: {},
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
                      id: "s1-1-1.s1-1-1-f1.1",
                      name: "s1-1-1.s1-1-1-f1.1",
                    },
                  },
                  {
                    ...fieldS111F2Exp,
                    props: {
                      ...fieldS111F2Exp.props,
                      id: "s1-1-1.s1-1-1-f2.1",
                      name: "s1-1-1.s1-1-1-f2.1",
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
              id: "s1.s1-f1.1",
              name: "s1.s1-f1.1",
            },
          },
        ],
      },
    ];
    expect(actual).toEqual(expected);
    expect(passportFormStore.passport?.name).toEqual(model.name);
  });

  it("should getFormSchema", async () => {
    const dataFieldS1Model: DataFieldDto = {
      id: "f1",
      type: DataFieldType.TEXT_FIELD,
      name: "Amount",
      options: {},
      granularityLevel: GranularityLevel.MODEL,
    };
    const dataFieldS1Item: DataFieldDto = {
      id: "f2",
      type: DataFieldType.TEXT_FIELD,
      name: "PCF",
      options: {},
      granularityLevel: GranularityLevel.ITEM,
    };
    const section1Group: SectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      parentId: undefined,
      name: "Tech Specs",
      dataFields: [dataFieldS1Model, dataFieldS1Item],
      subSections: [],
    };
    const templateDto: TemplateDto = {
      id: "pid",
      name: "Handy",
      version: "1.0.0",
      ownedByOrganizationId: "oId",
      createdByUserId: "uId",
      sections: [section1Group],
    };

    const model = {
      id: "id1",
      description: "desc",
      uniqueProductIdentifiers: [],
      templateId: "pid",
      owner: "oId",
      name: "my model",
      dataValues: [
        {
          dataSectionId: section1Group.id,
          dataFieldId: dataFieldS1Model.id,
          row: 0,
        },
      ],
    };

    const passportFormStore = usePassportFormStore();
    mocks.getTemplateById.mockResolvedValue({ data: templateDto });
    mocks.getModelById.mockResolvedValue({ data: model });
    await passportFormStore.fetchModel(model.id);

    const result = passportFormStore.getFormSchema(section1Group);
    expect(result).toEqual([
      {
        $el: "div",
        attrs: {
          class:
            "grid gap-1 items-center sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 sm:grid-cols-3",
        },
        children: [
          {
            $cmp: "TextField",
            props: {
              className:
                "sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1",
              id: "s1.f1.0",
              label: "Amount",
              name: "s1.f1.0",
              options: {},
              validation: "required",
            },
          },
          {
            $cmp: "FakeField",
            props: {
              className:
                "sm:col-span-1 sm:col-start-2 sm:row-span-1 sm:row-start-1",
              dataCy: "s1.f2.0",
              label: "PCF",
              options: {},
              placeholder: "Wird auf Artikelebene gesetzt",
            },
          },
        ],
      },
    ]);
  });

  it("should getFormSchema at item level", async () => {
    const dataFieldS1Model: DataFieldDto = {
      id: "f1",
      type: DataFieldType.TEXT_FIELD,
      name: "Amount",
      options: {},
      granularityLevel: GranularityLevel.MODEL,
    };
    const dataFieldS1Item: DataFieldDto = {
      id: "f2",
      type: DataFieldType.TEXT_FIELD,
      name: "PCF",
      options: {},
      granularityLevel: GranularityLevel.ITEM,
    };
    const section1Group: SectionDto = {
      id: "s1",
      type: SectionType.GROUP,
      parentId: undefined,
      name: "Tech Specs",
      dataFields: [dataFieldS1Model, dataFieldS1Item],
      subSections: [],
    };
    const templateDto: TemplateDto = {
      id: "pid",
      name: "Handy",
      version: "1.0.0",
      ownedByOrganizationId: "oId",
      createdByUserId: "uId",
      sections: [section1Group],
    };

    const modelId = "mid";
    const item: ItemDto = {
      id: "id1",
      uniqueProductIdentifiers: [],
      templateId: "pid",
      dataValues: [
        {
          value: undefined,
          dataSectionId: section1Group.id,
          dataFieldId: dataFieldS1Item.id,
          row: 0,
        },
      ],
    };

    const passportFormStore = usePassportFormStore();
    mocks.getTemplateById.mockResolvedValue({ data: templateDto });
    mocks.getItemById.mockResolvedValue({ data: item });
    await passportFormStore.fetchItem(modelId, item.id);

    const result = passportFormStore.getFormSchema(section1Group);
    expect(result).toEqual([
      {
        $el: "div",
        attrs: {
          class:
            "grid gap-1 items-center sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 sm:grid-cols-3",
        },
        children: [
          {
            $cmp: "FakeField",
            props: {
              className:
                "sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1",
              dataCy: "s1.f1.0",
              label: "Amount",
              options: {},
              placeholder: "Wird auf Modelebene gesetzt",
            },
          },
          {
            $cmp: "TextField",
            props: {
              className:
                "sm:col-span-1 sm:col-start-2 sm:row-span-1 sm:row-start-1",
              id: "s1.f2.0",
              label: "PCF",
              name: "s1.f2.0",
              options: {},
              validation: "required",
            },
          },
        ],
      },
    ]);
  });

  it("should add row to section", async () => {
    const passportFormStore = usePassportFormStore();
    mocks.getTemplateById.mockResolvedValue({ data: templateDto });
    mocks.getModelById.mockResolvedValue({ data: model });
    await passportFormStore.fetchModel(model.id);

    const expected: DataValueDto[] = [
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
    mocks.addData.mockResolvedValue({
      data: { ...model, dataValues: [...model.dataValues, expected] },
    });
    await passportFormStore.addRowToSection(section1.id);

    expect(mocks.addData).toHaveBeenCalledWith(model.id, expected);
  });
});
