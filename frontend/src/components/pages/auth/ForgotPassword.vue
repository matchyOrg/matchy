<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <v-main>
    <v-container>
      <page-title>
        {{ t("pages.forgot-password.title") }}
      </page-title>
      <div class="mb-6">
        <p>{{ t("pages.forgot-password.heading-p1") }}</p>
        <p>{{ t("pages.forgot-password.heading-p2") }}</p>
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          class="mb-2"
          v-model="email"
          label="Email"
          name="email"
          placeholder="aphrodite@mail.com"
          :rules="[() => hasEmail || t('shared.auth.enter-valid-mail')]"
        />

        <v-btn
          class="d-block mx-auto mt-3"
          size="x-large"
          color="primary"
          variant="tonal"
          block
          elevation="5"
          width="80%"
          :loading="submit.loading"
          :disabled="submit.loading || !hasEmail"
          type="submit"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          {{ t("pages.forgot-password.reset") }}
        </v-btn>
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
