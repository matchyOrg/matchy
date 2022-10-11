<template>
  <div class="h-75 d-flex flex-column justify-center align-center">
    <span class="d-block text-h5 font-weight-bold mb-4">{{
      t("pages.participant-event.waiting-title")
    }}</span>
    <v-progress-circular class="text-h3" indeterminate size="100">
      🌱
    </v-progress-circular>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
