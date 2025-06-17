import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { usePassportFormStore } from "./passport.form";
import {
  AasMappingDto,
  AasMappingNamespace,
  DataFieldDto,
  DataFieldType,
  DataValueDto,
  GranularityLevel,
  ItemDto,
  ModelDto,
  ProductDataModelDto,
  SectionDto,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";
import { useIntegrationFormStore } from "./integration.form";

const mocks = vi.hoisted(() => {
  return {
    getProductDataModelById: vi.fn(),
    getMapping: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    aasMappings: {
      getMapping: mocks.getMapping,
    },
    productDataModels: {
      getProductDataModelById: mocks.getProductDataModelById,
    },
  },
}));

describe("IntegrationFormStore", () => {
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
      productDataModelId: "pid",
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

    passportFormStore.productDataModel = {
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
              granularityLevel: GranularityLevel.MODEL,
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
              granularityLevel: GranularityLevel.MODEL,
            },
          ],
          subSections: ["s1-1"],
        },
        {
          id: "s1-1",
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
              granularityLevel: GranularityLevel.MODEL,
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

  it("should getFormSchema", async () => {
    const integrationFormStore = useIntegrationFormStore();
    const mappingId = "aasMappingId";
    const aasMapping: AasMappingDto = {
      id: mappingId,
      dataModelId: "dataModelId",
      fieldMappings: [
        {
          dataFieldId: "f1",
          sectionId: "s1",
          idShortParent: "p1",
          idShort: "i1",
        },
        {
          dataFieldId: "f2",
          sectionId: "s2",
          idShortParent: "p2",
          idShort: "i2",
        },
      ],
    };
    mocks.getMapping.mockResolvedValue({ data: aasMapping });
    await integrationFormStore.fetchMapping(mappingId);

    const actual = integrationFormStore.getFormSchema();

    expect(actual).toEqual([
      {
        $formkit: "select",
        label: "1. Feld aus der Asset Administration Shell",
        name: `aas ${0}`,
        options: expect.any(Array),
      },
      {
        $formkit: "select",
        label: "2. Feld aus der Asset Administration Shell",
        name: `aas ${1}`,
        options: expect.any(Array),
      },
    ]);
  });
});
