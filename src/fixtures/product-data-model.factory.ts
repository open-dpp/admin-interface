import { ProductDataModelDto, VisibilityLevel } from "@open-dpp/api-client";
import { Factory } from "fishery";
import { sectionFactory } from "./section.factory";

export const productDataModelFactory = Factory.define<ProductDataModelDto>(
  ({ sequence }) => ({
    id: `product-data-model-${sequence}`,
    name: "Test Product Data Model",
    version: "1.0.0",
    visibility: VisibilityLevel.PRIVATE,
    createdByUserId: "userId",
    ownedByOrganizationId: "orgaId",
    sections: sectionFactory.buildList(2),
  }),
);
