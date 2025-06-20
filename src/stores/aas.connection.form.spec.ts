import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { useAasConnectionFormStore } from "./aas.connection.form";
import {
  AasConnectionDto,
  AasFieldAssignmentDto,
  AasPropertyWithParentDto,
  AssetAdministrationShellType,
  DataFieldType,
  GranularityLevel,
  ProductDataModelDto,
  SectionType,
  VisibilityLevel,
} from "@open-dpp/api-client";
import apiClient from "../lib/api-client";
import { waitFor } from "@testing-library/vue";

const mocks = vi.hoisted(() => {
  return {
    getProductDataModelById: vi.fn(),
    getConnection: vi.fn(),
    getPropertiesOfAas: vi.fn(),
    modifyConnection: vi.fn(),
  };
});

vi.mock("../lib/api-client", () => ({
  default: {
    setActiveOrganizationId: vi.fn(),
    aasIntegration: {
      getConnection: mocks.getConnection,
      getPropertiesOfAas: mocks.getPropertiesOfAas,
      modifyConnection: mocks.modifyConnection,
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

  const connectionId = "aasMappingId";

  const aasConnection: AasConnectionDto = {
    id: connectionId,
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

  const selectOptionsAas = [
    {
      group: "p1",
      options: [
        {
          label: "i1",
          property: {
            idShort: "i1",
            modelType: "Property",
            valueType: "xs:string",
          },
          value: "p1/i1",
        },
      ],
    },
    {
      group: "p2",
      options: [
        {
          label: "i2",
          property: {
            idShort: "i2",
            modelType: "Property",
            valueType: "xs:string",
          },
          value: "p2/i2",
        },
      ],
    },
  ];

  const productDataModel: ProductDataModelDto = {
    id: "dataModelId",
    name: "Test Product Data Model",
    version: "1.0.0",
    visibility: VisibilityLevel.PRIVATE,
    createdByUserId: "userId",
    ownedByOrganizationId: "orgaId",
    sections: [
      {
        id: "s0",
        name: "Section 0",
        type: SectionType.GROUP,
        subSections: ["s2"],
        layout: {
          colStart: { sm: 1 },
          rowStart: { sm: 1 },
          colSpan: { sm: 1 },
          rowSpan: { sm: 1 },
          cols: { sm: 3 },
        },
        dataFields: [
          {
            id: "f0",
            name: "Field 0",
            type: DataFieldType.TEXT_FIELD,
            layout: {
              colStart: { sm: 1 },
              rowStart: { sm: 1 },
              colSpan: { sm: 1 },
              rowSpan: { sm: 1 },
            },
            granularityLevel: GranularityLevel.ITEM,
          },
        ],
      },
      {
        id: "s1",
        name: "Section 1",
        type: SectionType.GROUP,
        subSections: [],
        layout: {
          colStart: { sm: 1 },
          rowStart: { sm: 1 },
          colSpan: { sm: 1 },
          rowSpan: { sm: 1 },
          cols: { sm: 3 },
        },
        dataFields: [
          {
            id: "f1",
            name: "Field 1",
            type: DataFieldType.TEXT_FIELD,
            layout: {
              colStart: { sm: 1 },
              rowStart: { sm: 1 },
              colSpan: { sm: 1 },
              rowSpan: { sm: 1 },
            },
            granularityLevel: GranularityLevel.ITEM,
          },
        ],
      },
      {
        id: "s2",
        parentId: "s0",
        name: "Section 2",
        type: SectionType.GROUP,
        subSections: [],
        layout: {
          colStart: { sm: 1 },
          rowStart: { sm: 1 },
          colSpan: { sm: 1 },
          rowSpan: { sm: 1 },
          cols: { sm: 3 },
        },
        dataFields: [
          {
            id: "f2",
            name: "Field 2",
            type: DataFieldType.TEXT_FIELD,
            layout: {
              colStart: { sm: 1 },
              rowStart: { sm: 1 },
              colSpan: { sm: 1 },
              rowSpan: { sm: 1 },
            },
            granularityLevel: GranularityLevel.ITEM,
          },
          {
            id: "f3",
            name: "Field 3",
            type: DataFieldType.TEXT_FIELD,
            layout: {
              colStart: { sm: 2 },
              rowStart: { sm: 1 },
              colSpan: { sm: 1 },
              rowSpan: { sm: 1 },
            },
            granularityLevel: GranularityLevel.ITEM,
          },
          {
            id: "f4",
            name: "Field 4",
            type: DataFieldType.TEXT_FIELD,
            layout: {
              colStart: { sm: 3 },
              rowStart: { sm: 1 },
              colSpan: { sm: 1 },
              rowSpan: { sm: 1 },
            },
            granularityLevel: GranularityLevel.MODEL,
          },
        ],
      },
    ],
  };

  const selectOptionsDpp = [
    {
      group: "Section 0",
      options: [
        {
          label: "Field 0",
          value: "s0/f0",
        },
      ],
    },
    {
      group: "Section 1",
      options: [
        {
          label: "Field 1",
          value: "s1/f1",
        },
      ],
    },
    {
      group: "Section 2",
      options: [
        {
          label: "Field 2",
          value: "s2/f2",
        },
        {
          label: "Field 3",
          value: "s2/f3",
        },
      ],
    },
  ];

  const expectedFormSchema = [
    {
      $formkit: "select",
      label: "Feld aus der Asset Administration Shell",
      placeholder: "Wählen Sie ein Feld aus der Asset Administration Shell",
      name: `aas-${0}`,
      options: selectOptionsAas,
      "data-cy": "aas-select-0",
    },
    {
      $formkit: "select",
      label: "Feld aus dem Produktdatenmodell",
      placeholder: "Wählen Sie ein Feld aus dem Produktdatenmodell",
      name: `dpp-${0}`,
      options: selectOptionsDpp,
      "data-cy": "dpp-select-0",
    },
    {
      $el: "div",
      attrs: {
        class: "w-full border-t border-gray-300 m-2",
      },
    },
    {
      $formkit: "select",
      label: "Feld aus der Asset Administration Shell",
      placeholder: "Wählen Sie ein Feld aus der Asset Administration Shell",
      name: `aas-${1}`,
      options: selectOptionsAas,
      "data-cy": "aas-select-1",
    },
    {
      $formkit: "select",
      label: "Feld aus dem Produktdatenmodell",
      placeholder: "Wählen Sie ein Feld aus dem Produktdatenmodell",
      name: `dpp-${1}`,
      options: selectOptionsDpp,
      "data-cy": "dpp-select-1",
    },
  ];

  it("should getFormSchema and getFormData", async () => {
    const integrationFormStore = useAasConnectionFormStore();

    mocks.getProductDataModelById.mockResolvedValue({ data: productDataModel });
    mocks.getConnection.mockResolvedValue({ data: aasConnection });
    mocks.getPropertiesOfAas.mockResolvedValue({ data: mockedProperties });
    await integrationFormStore.fetchConnection(connectionId);

    expect(integrationFormStore.formSchema).toEqual(expectedFormSchema);

    expect(integrationFormStore.formData).toEqual({
      "aas-0": "p1/i1",
      "aas-1": "p2/i2",
      "dpp-0": "s1/f1",
      "dpp-1": "s2/f2",
    });
  });

  it("should update connection", async () => {
    const integrationFormStore = useAasConnectionFormStore();
    const formUpdate = {
      name: "Connection 1",
      modelId: "modelId",
      fieldAssignments: {
        "aas-0": "p1-update/i1-update",
        "aas-1": "p2-update/i2-update",
        "dpp-0": "s0/f0",
        "dpp-1": "s2/f3",
      },
    };
    const newFieldAssignments: AasFieldAssignmentDto[] = [
      {
        idShortParent: "p1-update",
        idShort: "i1-update",
        dataFieldId: "f0",
        sectionId: "s0",
      },
      {
        idShortParent: "p2-update",
        idShort: "i2-update",
        dataFieldId: "f3",
        sectionId: "s2",
      },
    ];
    const mockedAasConnectionUpdate: AasConnectionDto = {
      ...aasConnection,
      fieldAssignments: newFieldAssignments,
    };
    mocks.getConnection.mockResolvedValue({
      data: aasConnection,
    });
    mocks.getProductDataModelById.mockResolvedValue({ data: productDataModel });
    mocks.getPropertiesOfAas.mockResolvedValue({ data: mockedProperties });
    mocks.modifyConnection.mockResolvedValue({
      data: mockedAasConnectionUpdate,
    });

    await integrationFormStore.fetchConnection(connectionId);
    integrationFormStore.formData = formUpdate.fieldAssignments;
    await integrationFormStore.submitModifications();

    await waitFor(() =>
      expect(apiClient.aasIntegration.modifyConnection).toHaveBeenCalledWith(
        connectionId,
        {
          fieldAssignments: mockedAasConnectionUpdate.fieldAssignments,
          modelId: mockedAasConnectionUpdate.modelId,
          name: mockedAasConnectionUpdate.name,
        },
      ),
    );

    expect(integrationFormStore.formSchema).toEqual(expectedFormSchema);
    expect(integrationFormStore.formData).toEqual({
      "aas-0": "p1-update/i1-update",
      "aas-1": "p2-update/i2-update",
      "dpp-0": "s0/f0",
      "dpp-1": "s2/f3",
    });
  });

  it("should add field assignment", async () => {
    const integrationFormStore = useAasConnectionFormStore();

    mocks.getProductDataModelById.mockResolvedValue({ data: productDataModel });
    mocks.getConnection.mockResolvedValue({ data: aasConnection });
    mocks.getPropertiesOfAas.mockResolvedValue({ data: mockedProperties });
    await integrationFormStore.fetchConnection(connectionId);

    integrationFormStore.addFieldAssignmentRow();

    expect(integrationFormStore.formSchema).toEqual([
      ...expectedFormSchema,
      {
        $el: "div",
        attrs: {
          class: "w-full border-t border-gray-300 m-2",
        },
      },
      {
        $formkit: "select",
        label: "Feld aus der Asset Administration Shell",
        name: `aas-${2}`,
        placeholder: "Wählen Sie ein Feld aus der Asset Administration Shell", // Add this line
        options: selectOptionsAas,
        "data-cy": "aas-select-2",
      },
      {
        $formkit: "select",
        label: "Feld aus dem Produktdatenmodell",
        name: `dpp-${2}`,
        placeholder: "Wählen Sie ein Feld aus dem Produktdatenmodell", // Add this line
        options: selectOptionsDpp,
        "data-cy": "dpp-select-2",
      },
    ]);

    expect(integrationFormStore.formData).toEqual({
      "aas-0": "p1/i1",
      "aas-1": "p2/i2",
      "dpp-0": "s1/f1",
      "dpp-1": "s2/f2",
    });
  });
});
