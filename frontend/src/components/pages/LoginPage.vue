<template>
  <v-main>
    <v-container>
      <!-- LOGO -->
      <section class="mt-5 flex flex-col content-center items-center">
        <img src="@/assets/matchyLogoGreen.svg" height="40" />
        <p
          class="text-grey-darken-3"
          style="
            font-size: 0.85rem;
            margin-top: -0.1rem;
            letter-spacing: 0.05rem;
          "
        >
          paperless speed dating
        </p>
      </section>

      <!-- MAIN LOGIN SECTION-->
      <v-form
        class="mx-5 mt-16 mb-5"
        :model-value="hasEmail"
        @submit.prevent="onSubmit.handler"
      >
        <v-text-field
          class="mb-1"
          variant="filled"
          type="email"
          v-model="email"
          name="Email"
          label="Email"
          placeholder="geniusPinapple@mail.com"
          :rules="[(value) => !!value || t('shared.forms.required')]"
        ></v-text-field>
        <v-text-field
          class="mb-1"
          variant="filled"
          :type="showPW ? 'text' : 'password'"
          v-model="password"
          name="password"
          :label="t('shared.auth.password')"
          :append-inner-icon="showPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPW = !showPW"
          :rules="[(value) => !!value || t('shared.forms.required')]"
        ></v-text-field>

        <span v-if="error" class="inline-block text-red text-center my-2">
          {{ error }}
        </span>

        <v-btn
          class="d-block mx-auto mt-2"
          size="x-large"
          color="primary"
          variant="tonal"
          type="submit"
          width="73%"
          :disabled="onSubmit.loading || !hasEmail || !hasPassword"
          :loading="onSubmit.loading"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          <span class="text-h7">
            {{ t("shared.auth.login") }}
          </span>
        </v-btn>

        <!-- ALTERNATIVE LOGIN SECTION-->
        <section class="text-center mt-6">
          <p class="text-grey ml-4 mr-2 inline-block">
            {{ t("pages.login.oauth-login-prompt") }}
          </p>
          <div class="inline-block">
            <v-btn
              size="small"
              variant="text"
              @click="oAuthLogin.handler('google')"
            >
              <img src="@/assets/googleLogo.svg" width="24" height="24" />
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              @click="oAuthLogin.handler('github')"
            >
              <img
                style="margin-top: 0.07rem"
                src="@/assets/githubLogo.svg"
                width="28"
                height="28"
              />
            </v-btn>
          </div>
        </section>
      </v-form>

      <!-- FORGOT PASSWORD -->
      <section class="flex align-center justify-center">
        <v-btn
          :to="{
            path: '/forgot-password',
            query: { redirect: redirect },
          }"
          size="x-small"
          variant="text"
          color="primary"
        >
          {{ t("pages.login.forgot-password") }}
        </v-btn>
      </section>

      <!-- SIGN UP -->
      <section
        class="text-grey flex align-center justify-center mt-12 border-1 rounded-md border-t-teal-600"
      >
        <p class="inline-block text-xl mb-0.5 ml-5">
          {{ t("pages.login.no-account") }}
        </p>
        <v-btn
          class="-ml-2"
          to="/signup"
          size="x-large"
          variant="text"
          color="primary"
        >
          <span class="text-h7">
            {{ t("shared.auth.signup") }}
          </span>
        </v-btn>
      </section>
    </v-container>
  </v-main>

  <v-footer class="flex justify-center pb-8">
    <a
      href="https://github.com/matchyOrg/.github/blob/main/profile/README.md"
      class="mx-2 text-grey"
    >
      {{ t("pages.login.footer-about-us") }}
    </a>
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSfadw82Hn0h0E6R8vLdCsXYoEZX5-ys59SOSx1UMEuhp6K-Tg/viewform?usp=sf_link"
      class="mx-2 text-grey"
    >
      {{ t("pages.login.footer-feedback") }}
    </a>
    <a
      href="https://github.com/matchyOrg/matchy/blob/main/TERMS.md"
      class="mx-2 text-grey"
    >
      {{ t("pages.login.footer-legal-notice") }}
    </a>
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
const redirect = routeParam(route, "redirect");

// leave page if already logged in
watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      router.push(redirect || "/");
    }
  }
);

const email = ref("");
const password = ref("");
const error = ref("");

const showPW = ref(false);

watch([email, password], () => (error.value = ""));

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));
const hasPassword = computed(() => password.value.length > 0);

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push(redirect ?? "/");
  } catch (e: any) {
    console.error(e);

    if ("status" in e && e.status === 400) {
      if ("message" in e && e.message === "Email not confirmed") {
        error.value = t("pages.login.not-confirmed-error");
      } else {
        error.value = t("pages.login.wrong-credentials-error");
      }
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
