<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <v-main>
    <v-container>
      <page-title>{{ t("pages.reset-password.heading-p1") }}</page-title>
      <div class="mb-8">
        <span class="d-block">{{ t("pages.reset-password.heading-p2") }}</span>
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          v-model="password"
          :type="showPW ? 'text' : 'password'"
          :label="t('shared.auth.password')"
          :placeholder="t('shared.auth.password-placeholder')"
          :append-icon="showPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPW = !showPW"
          :rules="[
            (value) =>
              value.length >= 6 || t('shared.auth.password-min-len-rule'),
          ]"
        />
        <v-text-field
          v-model="repeatPassword"
          :type="showRepeatPW ? 'text' : 'password'"
          :label="t('shared.auth.repeat-password')"
          :placeholder="t('shared.auth.repeat-password-placeholder')"
          :append-icon="showRepeatPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showRepeatPW = !showRepeatPW"
          :rules="[
            (val) => val === password || t('shared.auth.password-mismatch'),
          ]"
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
          :disabled="
            submit.loading || repeatPassword !== password || password.length < 6
          "
          type="submit"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          {{ t("shared.forms.confirm") }}
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
const route = useRoute();

const password = ref("");
const repeatPassword = ref("");
const redirect = routeParam(route, "redirect");

const submit = asyncLoading(async () => {
  await authStore.setNewPassword(password.value);
  authStore.redirect = redirect ?? "/";
  successToast(t("pages.reset-password.new-pw-success"));
});

const showPW = ref(false);
const showRepeatPW = ref(false);
</script>
