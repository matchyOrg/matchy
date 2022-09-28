<template>
  <div class="h-50 d-flex flex-column align center justify-center pl-2">
    <span class="d-flex font-weight-medium text-h6">{{
      t("pages.participant-event.not-started-title")
    }}</span>
    <span class="d-block text-subtitle-2">{{
      t("pages.participant-event.not-started-subtitle")
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
