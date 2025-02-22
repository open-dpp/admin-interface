import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";
import ModelForm from "../models/ModelForm.vue";
import {
  ModelDto,
  ProductDataModelDto,
  SectionType,
} from "@open-dpp/api-client";
import { defaultConfig, plugin as FormKit } from "@formkit/vue";
import { rootClasses } from "../../../formkit.theme";
import { genesisIcons } from "@formkit/icons";
import { de } from "@formkit/i18n";
import {
  createAutoAnimatePlugin,
  createMultiStepPlugin,
} from "@formkit/addons";

describe("ModelForm.vue", () => {
  test("should render form with data", async () => {
    const productDataModel: ProductDataModelDto = {
      id: "pdm1",
      name: "Laptop neu",
      version: "1.0",
      sections: [
        {
          id: "s1",
          name: "s1",
          type: SectionType.GROUP,
          dataFields: [
            {
              id: "f1",
              type: "TextField",
              name: "Prozessor",
              options: {
                min: 24,
              },
            },
            {
              id: "f1",
              type: "TextField",
              name: "Neuer Title 2",
              options: {
                min: 2,
              },
            },
          ],
        },
      ],
    };
    const model: ModelDto = {
      id: "i1",
      description: "hello",
      name: "My model",
      dataValues: [
        { id: "d1", value: "val1", dataFieldId: "f1", dataSectionId: "s1" },
        { id: "d2", value: "val2", dataFieldId: "f2", dataSectionId: "s1" },
      ],
      owner: "ow1",
      uniqueProductIdentifiers: [],
      productDataModelId: productDataModel.id,
    };
    render(ModelForm, {
      props: {
        model,
        productDataModel,
      },
      global: {
        plugins: [
          [
            FormKit,
            defaultConfig({
              config: {
                rootClasses,
              },
              icons: {
                ...genesisIcons,
              },
              locales: { de },
              locale: "de",
              plugins: [createMultiStepPlugin(), createAutoAnimatePlugin()],
            }),
          ],
        ],
      },
    });
    expect(await screen.findByText("Prozessor")).toBeTruthy();
  });
});
