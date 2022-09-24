<template>
  <v-main>
    <!-- logo -->
    <SiteLogo class="mt-3"></SiteLogo>

    <v-btn @click="oAuthLogin.handler('google')">Google</v-btn>
    <v-btn @click="oAuthLogin.handler('github')">GitHub</v-btn>

    <!-- email field -->
    <div class="mx-9 mt-13">
      <h3 class="text-h5 font-weight-bold">
        {{ t("shared.auth.login") }}
      </h3>
      <v-form
        class="mt-8 mb-5"
        :model-value="hasEmail"
        @submit.prevent="onSubmit.handler"
      >
        <!-- TODO: This causes the [intlify] Not found parent scope. use the global scope. warning-->
        <v-text-field
          filled
          type="email"
          v-model="email"
          name="Email"
          label="Email"
          placeholder="geniusPinapple@mail.com"
          variant="outlined"
          :rules="[(value) => !!value || t('shared.forms.required')]"
        ></v-text-field>
        <v-text-field
          filled
          type="password"
          v-model="password"
          name="password"
          label="Password"
          variant="outlined"
          :rules="[(value) => !!value || t('shared.forms.required')]"
        ></v-text-field>

        <div class="text-right">
          <v-btn variant="text" class="text-blue" to="/signup">{{
            t("pages.login.not-signed-up")
          }}</v-btn>
        </div>
        <span v-if="error" class="text-red text-center d-block my-2">{{
          error
        }}</span>
        <div class="d-flex">
          <v-btn
            class="mx-auto"
            size="x-large"
            color="primary"
            variant="tonal"
            rounded="pill"
            type="submit"
            minWidth="20rem"
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
        </div>
      </v-form>
    </div>
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

const { t } = useI18n();

const authStore = useAuthStore();
const router = useRouter();
const { redirect: redirectRaw } = useRoute().query;
const redirect = Array.isArray(redirectRaw) ? redirectRaw[0] : redirectRaw;

// leave page if already logged in
if (authStore.isLoggedIn) {
  router.push("/");
}

const email = ref("");
const password = ref("");
const error = ref("");

watch([email, password], () => (error.value = ""));

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push(redirect ?? "/");
  } catch (e: any) {
    console.log(e);

    if (e.status === 400) {
      error.value = "Your email or password are incorrect";
    }
  }
  return "ok";
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
