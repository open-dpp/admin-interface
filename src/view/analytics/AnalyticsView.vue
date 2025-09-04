<template>
  <div>
    <div
      v-for="(
        passportMeasurement, index
      ) of analyticsStore.passportMeasurements"
      :key="index"
    >
      <div>{{ passportMeasurement.datetime }}</div>
      <div>{{ passportMeasurement.sum }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAnalyticsStore } from "../../stores/analytics";
import { onMounted } from "vue";
import { MeasurementType, TimePeriod } from "@open-dpp/api-client";

const analyticsStore = useAnalyticsStore();
onMounted(async () => {
  await analyticsStore.queryMetric({
    startDate: new Date("2025-01-01T00:00:00Z"),
    endDate: new Date("2025-12-01T00:00:00Z"),
    templateId: "3a92ffdf-b0b4-494c-84c8-f92c17437f93",
    modelId: "3a92ffdf-b0b4-494c-84c8-f92c17437f93",
    measurementKey: "^http://localhost:5174/.+",
    measurementType: MeasurementType.PAGE_VIEWS,
    period: TimePeriod.DAY,
  });
});
</script>
