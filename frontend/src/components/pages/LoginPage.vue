<template>
  <v-main>
    <v-container class="h-100">
      <!-- logo -->
      <SiteLogo class="my-12"></SiteLogo>
      <!-- email field -->
      <div class="mx-5 mt-16">
        <v-form
          class="mt-8 mb-5"
          :model-value="hasEmail"
          @submit.prevent="onSubmit.handler"
        >
          <!-- TODO: This causes the [intlify] Not found parent scope. use the global scope. warning-->
          <v-text-field
            variant="filled"
            type="email"
            v-model="email"
            name="Email"
            label="Email"
            placeholder="geniusPinapple@mail.com"
            :rules="[(value) => !!value || t('shared.forms.required')]"
          ></v-text-field>
          <v-text-field
            variant="filled"
            :type="showPW ? 'text' : 'password'"
            v-model="password"
            name="password"
            :label="t('shared.auth.password')"
            :append-inner-icon="showPW ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPW = !showPW"
            :rules="[(value) => !!value || t('shared.forms.required')]"
          ></v-text-field>
          <!-- <div class="text-right">
            <v-btn variant="text" class="text-blue" to="/signup">{{
              t("pages.login.not-signed-up")
            }}</v-btn>
          </div> -->
          <span v-if="error" class="text-red text-center d-block my-2">{{
            error
          }}</span>
          <v-btn
            class="d-block mx-auto"
            size="x-large"
            color="primary"
            variant="tonal"
            type="submit"
            width="66%"
            :disabled="onSubmit.loading || !hasEmail"
            :loading="onSubmit.loading"
          >
            <template v-slot:loader>
              <v-progress-circular indeterminate />
            </template>
            <span class="text-h6">
              {{ t("shared.auth.login") }}
            </span>
          </v-btn>
          <div class="text-center">
            <span
              class="d-inline-block text-small text-grey font-weight-bold"
              >{{ t("pages.login.oauth-login-prompt") }}</span
            >
            <div class="d-inline-block">
              <v-btn
                class="ref"
                size="small"
                variant="text"
                icon="mdi-google"
                @click="oAuthLogin.handler('google')"
              />
              <v-btn
                size="small"
                variant="text"
                icon="mdi-github"
                @click="oAuthLogin.handler('github')"
              />
            </div>
          </div>
        </v-form>
      </div>
      <div
        class="d-flex align-center justify-center text-small text-grey font-weight-bold mt-12"
      >
        <span>{{ t("pages.login.no-account") }}</span>
        <v-btn to="/signup" size="x-small" variant="text" color="primary">{{
          t("shared.auth.signup")
        }}</v-btn>
      </div>
      <div
        class="d-flex align-center justify-center text-small text-grey font-weight-bold"
      >
        <v-btn
          :to="{
            path: '/forgot-password',
            query: { redirect: redirect },
          }"
          size="x-small"
          variant="text"
          color="primary"
          >{{ t("pages.login.forgot-password") }}</v-btn
        >
      </div>
    </v-container>
  </v-main>

  <v-footer class="d-flex justify-center pb-4" absolute app>
    <!-- other links -->
    <router-link to="/about" class="mx-4 text-grey">
      {{ t("pages.login.footer-about-us") }}
    </router-link>
    <router-link to="/legal" class="mx-4 text-grey">
      {{ t("pages.login.footer-legal-notice") }}
    </router-link>
  </v-footer>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { Provider } from "@supabase/gotrue-js";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { redirect: redirectRaw } = route.query;
const redirect = Array.isArray(redirectRaw) ? redirectRaw[0] : redirectRaw;

// leave page if already logged in
if (authStore.isLoggedIn) {
  router.push("/");
}

const email = ref("");
const password = ref("");
const error = ref("");

const showPW = ref(false);

watch([email, password], () => (error.value = ""));

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push(redirect ?? "/");
  } catch (e: any) {
    console.log(e);

    if (e.status === 400) {
      error.value = t("pages.login.wrong-credentials-error");
    }
  }
};

const onSubmit = asyncLoading(() => login());

const oAuthLogin = asyncLoading(async (provider: Provider) => {
  try {
    await authStore.oAuthLogin(provider, redirect ?? "/");
  } catch (e) {
    errorToast(e);
  }
});
</script>

<style scoped>
/* Rainbow colors for google icon */
.ref:deep(.mdi-google) {
  background: conic-gradient(
      from -45deg,
      #ea4335 110deg,
      #4285f4 90deg 180deg,
      #34a853 180deg 270deg,
      #fbbc05 270deg
    )
    73% 55%/150% 150% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.text-small {
  font-size: 12px;
}
</style>
