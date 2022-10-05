<template>
  <v-main>
    <v-container>
      <page-title>
        {{ t("pages.forgot-password.title") }}
      </page-title>
      <div class="mb-12">
        <span class="d-block">{{ t("pages.forgot-password.heading-p1") }}</span
        ><span class="d-block">{{
          t("pages.forgot-password.heading-p2")
        }}</span>
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          v-model="email"
          label="Email"
          name="email"
          placeholder="aphrodite@mail.com"
          :rules="[() => hasEmail || t('shared.auth.enter-valid-mail')]"
        />
        <v-btn
          class="mx-auto d-block"
          type="submit"
          color="primary"
          width="50%"
          :disabled="submit.loading || !hasEmail"
          :loading="submit.loading"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          {{ t("pages.forgot-password.reset") }}</v-btn
        >
      </v-form>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();
const email = ref("");

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));

const submit = asyncLoading(async () => {
  await authStore.resetPassword(email.value);
  successToast(t("pages.forgot-password.reset-success-message"));
});
</script>
