<template>
  <div class="h-75 d-flex flex-column justify-center align-center">
    <span class="d-block text-h5 font-weight-bold mb-10">{{
      t("pages.participant-event.ongoing-title")
    }}</span>
    <time-display
      v-if="roundDuration && roundTime"
      :max="roundDuration"
      :model-value="roundTime"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{ roundTime?: number; roundDuration?: number }>();
</script>
