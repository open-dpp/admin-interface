import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { useAasConnectionFormStore } from "./aas.connection.form";
import {
  AasConnectionDto,
  AasPropertyWithParentDto,
  AssetAdministrationShellType,
} from "../../../open-dpp-api-client";

const mocks = vi.hoisted(() => {
  return {
    getProductDataModelById: vi.fn(),
    getConnection: vi.fn(),
    getPropertiesOfAas: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    aasIntegration: {
      getConnection: mocks.getConnection,
      getPropertiesOfAas: mocks.getPropertiesOfAas,
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

  it("should getFormSchema", async () => {
    const integrationFormStore = useAasConnectionFormStore();
    const mappingId = "aasMappingId";
    const aasConnection: AasConnectionDto = {
      id: mappingId,
      name: "Connection 1",
      modelId: "modelId",
      aasType: AssetAdministrationShellType.Truck,
      dataModelId: "dataModelId",
      fieldAssignments: [
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
    const mockedProperties: AasPropertyWithParentDto[] = [
      {
        parentIdShort: "p1",
        property: {
          idShort: "i1",
          valueType: "xs:string",
          modelType: "Property",
        },
      },
      {
        parentIdShort: "p2",
        property: {
          idShort: "i2",
          valueType: "xs:string",
          modelType: "Property",
        },
      },
    ];
    mocks.getConnection.mockResolvedValue({ data: aasConnection });
    mocks.getPropertiesOfAas.mockResolvedValue({ data: mockedProperties });
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
