<template>
  <FormKit
    type="select"
    label="Feldauswahl Asset Administration Shell"
    :options="groupedProperties"
  ></FormKit>
</template>

<script setup lang="ts">
import { z } from "zod";
import { flatMap, get, groupBy } from "lodash";
import { semitrailer } from "./semitrailer.js";

const AASPropertySchema = z.object({
  idShort: z.string(),
  value: z.ostring(),
  valueType: z.string().default("xs:string"),
  modelType: z.literal("Property"),
});

type AasProperty = z.infer<typeof AASPropertySchema>;

const AASPropertyWithParentSchema = z.object({
  parentIdShort: z.string(),
  property: AASPropertySchema,
});

const collectPropertiesWithParent = (
  elements: any[],
  parentIdShort: string | null = null,
): { parentIdShort: string | null; property: AasProperty }[] => {
  return flatMap(elements, (el) => {
    const isProperty = get(el, "modelType") === "Property";
    const nested = el.value
      ? collectPropertiesWithParent(el.value, el.idShort || null)
      : [];

    return isProperty ? [{ parentIdShort, property: el }, ...nested] : nested;
  });
};

const allProperties = AASPropertyWithParentSchema.array().parse(
  flatMap(semitrailer.submodels, (submodel) =>
    collectPropertiesWithParent(
      submodel.submodelElements || [],
      submodel.idShort,
    ),
  ),
);

const groupedProperties = Object.entries(
  groupBy(allProperties, "parentIdShort"),
).map(([parentIdShort, props]) => ({
  group: parentIdShort,
  options: props.map((prop) => ({
    label: prop.property.idShort,
    value: prop.property.idShort,
    property: prop.property,
  })),
}));
</script>
