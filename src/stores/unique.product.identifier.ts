import { defineStore } from "pinia";
import apiClient from "../lib/api-client";
import { GranularityLevel } from "@open-dpp/api-client";

export const useUniqueProductIdentifierStore = defineStore(
  "uniqueProductIdentifier",
  () => {
    const buildLinkToReferencedProduct = async (id: string) => {
      const response =
        await apiClient.uniqueProductIdentifiers.getUniqueProductIdentifierReference(
          id,
        );
      const reference = response.data;
      if (reference.granularityLevel === GranularityLevel.ITEM) {
        return `/organizations/${reference.organizationId}/models/${reference.modelId}/items/${reference.id}`;
      } else {
        return `/organizations/${reference.organizationId}/models/${reference.id}`;
      }
    };

    return { buildLinkToReferencedProduct };
  },
);
