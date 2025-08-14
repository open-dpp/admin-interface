<template>
  <div>
    <DraftDataFieldText
      v-if="props.dataField.type === DataFieldType.TEXT_FIELD"
      :data-field="props.dataField"
      @clicked="onClicked"
    />
    <DraftDataFieldProductPassportLink
      v-else-if="props.dataField.type === DataFieldType.PRODUCT_PASSPORT_LINK"
      :data-field="props.dataField"
      @clicked="onClicked"
    />
    <DraftDataFieldNumeric
      v-else-if="props.dataField.type === DataFieldType.NUMERIC_FIELD"
      :data-field="props.dataField"
      @clicked="onClicked"
    />
    <DraftDataFieldFile
      v-else-if="props.dataField.type === DataFieldType.FILE_FIELD"
      :data-field="props.dataField"
      @clicked="onClicked"
    />
    <DraftDataFieldUnsupported v-else :data-field="props.dataField" />
  </div>
</template>

<script lang="ts" setup>
import { DataFieldDto, DataFieldType } from "@open-dpp/api-client";
import {
  SidebarContentType,
  useDraftSidebarStore,
} from "../../stores/draftSidebar";
import DraftDataFieldNumeric from "./draft-data-field-types/DraftDataFieldNumeric.vue";
import DraftDataFieldText from "./draft-data-field-types/DraftDataFieldText.vue";
import DraftDataFieldProductPassportLink from "./draft-data-field-types/DraftDataFieldProductPassportLink.vue";
import DraftDataFieldUnsupported from "./draft-data-field-types/DraftDataFieldUnsupported.vue";
import DraftDataFieldFile from "./draft-data-field-types/DraftDataFieldFile.vue";

const props = defineProps<{ dataField: DataFieldDto }>();

const draftSidebarStore = useDraftSidebarStore();

const onClicked = () => {
  draftSidebarStore.open(SidebarContentType.DATA_FIELD_FORM, {
    type: props.dataField.type,
    id: props.dataField.id,
  });
};
</script>
