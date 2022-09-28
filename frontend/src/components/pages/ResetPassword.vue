<template>
  <v-main>
    <v-container>
      <div class="pt-4 mb-8">
        <div class="d-flex align-center mb-6">
          <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
          <span class="d-block text-h6 font-weight-bold">
            {{ t("pages.reset-password.heading-p1") }}
          </span>
        </div>
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
          :loading="submit.loading"
          :disabled="
            submit.loading || repeatPassword !== password || password.length < 6
          "
          color="primary"
          class="d-block mx-auto"
          width="67%"
          type="submit"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          {{ t("shared.forms.confirm") }}</v-btn
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
const route = useRoute();

const password = ref("");
const repeatPassword = ref("");

const { redirect: redirectRaw } = route.query;
const redirect = Array.isArray(redirectRaw) ? redirectRaw[0] : redirectRaw;

const submit = asyncLoading(async () => {
  await authStore.setNewPassword(password.value);
  authStore.redirect = redirect ?? "/";
  successToast(t("pages.reset-password.new-pw-success"));
});

const showPW = ref(false);
const showRepeatPW = ref(false);
</script>
