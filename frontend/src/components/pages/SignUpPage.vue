<template>
  <v-main>
    <v-container v-if="!registered">
      <div class="pt-4 mb-8">
        <div class="d-flex align-center mb-6">
          <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
          <span class="d-block text-h6 font-weight-bold">
            {{ t("pages.signup.title") }}
          </span>
        </div>
        <span class="d-block">{{ t("pages.signup.heading-p1") }}</span
        ><span class="d-block">{{ t("pages.signup.heading-p2") }}</span
        ><span class="d-block">{{ t("pages.signup.heading-p3") }}</span>
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="aphrodite@mail.com"
          name="email"
          :rules="[(val) => hasEmail || t('shared.auth.enter-valid-mail')]"
        />
        <v-text-field
          v-model="password"
          :type="showPW ? 'text' : 'password'"
          :label="t('shared.auth.password')"
          :placeholder="t('shared.auth.password-placeholder')"
          :append-icon="showPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPW = !showPW"
          :rules="[
            (value) =>
              value.length >= 6 || 'Password must be at least 6 characters',
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
            submit.loading ||
            !hasEmail ||
            repeatPassword !== password ||
            password.length < 6
          "
          color="primary"
          class="d-block mx-auto"
          width="67%"
          type="submit"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          {{ t("shared.auth.register") }}</v-btn
        >
      </v-form>
    </v-container>
    <v-container v-else class="h-75">
      <div class="d-flex align-center mt-6">
        <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
        <span class="d-block text-h6 font-weight-bold">
          {{ t("pages.signup.registered-title") }}
        </span>
      </div>
      <div class="h-100 d-flex flex-column justify-center pt-4">
        <span class="d-block text-h5 font-weight-bold mb-1">
          {{ t("pages.signup.registered-subheader1") }}
        </span>
        <span class="d-block">
          {{ t("pages.signup.registered-subheader2") }}
        </span>
        <v-btn class="mt-4" to="/login" variant="text" color="primary">{{
          t("shared.auth.login")
        }}</v-btn>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();

const registered = ref(false);

const email = ref("");
const password = ref("");
const repeatPassword = ref("");

const submit = asyncLoading(async () => {
  await authStore.signUp(email.value, password.value);
  registered.value = true;
  successToast(t("pages.login.successful-signup"));
});

const showPW = ref(false);
const showRepeatPW = ref(false);

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));
</script>
