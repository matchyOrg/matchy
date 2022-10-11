<template>
  <div class="h-75 d-flex justify-center align-center">
    <div class="pt-6">
      <span class="d-block text-h4 pl-4">{{
        t("pages.participant-event.vote-title")
      }}</span>
      <span class="d-block pl-4 mb-12 text-grey-darken-1">{{
        t("pages.participant-event.vote-subtitle")
      }}</span>
      <div class="d-flex justify-space-between px-6 bg-grey-lighten-3">
        <v-btn
          size="x-large"
          variant="text"
          icon="mdi-thumb-down"
          @click="emits('vote', false)"
        ></v-btn>
        <v-btn
          size="x-large"
          variant="text"
          icon="mdi-thumb-up"
          color="primary"
          @click="emits('vote', true)"
        ></v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emits = defineEmits<{ (e: "vote", choice: boolean): void }>();
</script>
