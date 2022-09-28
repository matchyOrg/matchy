<template>
  <div class="h-75 d-flex flex-column justify-center align-center">
    <span class="d-block text-h4 font-weight-bold">{{
      t("pages.participant-event.ended-title")
    }}</span>
    <span class="d-block">{{
      t("pages.participant-event.ended-subtitle")
    }}</span>
    <v-btn class="mt-16" color="primary" to="/" variant="text">{{
      t("pages.participant-event.ended-button-link")
    }}</v-btn>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
