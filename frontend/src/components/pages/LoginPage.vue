<template>
  <v-main>
    <!-- logo -->
    <SiteLogo class="mt-3"></SiteLogo>

    <v-btn @click="oAuthLogin.handler('google')">Google</v-btn>
    <v-btn @click="oAuthLogin.handler('github')">GitHub</v-btn>

    <!-- email field -->
    <div class="mx-9 mt-13">
      <h3 class="text-h5 font-weight-bold">
        {{ authType === "LOGIN" ? "Login" : "Sign Up" }}
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
          :rules="[(value) => !!value || 'Required']"
        ></v-text-field>
        <v-text-field
          filled
          type="password"
          v-model="password"
          name="password"
          label="Password"
          variant="outlined"
          :rules="[(value) => !!value || 'Required']"
        ></v-text-field>
        <div class="text-right">
          <span
            class="text-blue"
            @click="authType = authType === 'LOGIN' ? 'SIGNUP' : 'LOGIN'"
            >{{
              authType === "LOGIN"
                ? "Not signed up yet?"
                : "Already registered?"
            }}</span
          >
        </div>

        <div class="d-flex">
          <v-btn
            class="mx-auto"
            size="x-large"
            color="primary"
            variant="tonal"
            append-icon="mdi-email"
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
              {{ authType === "LOGIN" ? "Login" : "Sign Up" }}
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
import type { Ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const authStore = useAuthStore();
const router = useRouter();
const { redirect: redirectRaw } = useRoute().query;
const redirect = Array.isArray(redirectRaw) ? redirectRaw[0] : redirectRaw;

const authType: Ref<"LOGIN" | "SIGNUP"> = ref("LOGIN");

// leave page if already logged in
if (authStore.isLoggedIn) {
  router.push("/");
}

const email = ref("");
const password = ref("");

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));

const onSubmit = asyncLoading(async () => {
  // TODO: This is still flawed, especially the hash in the URL is troublesome
  console.log("Will redirect to", redirect);
  if (authType.value === "LOGIN") {
    await authStore.login(email.value, password.value);
  } else {
    await authStore.signUp(email.value, password.value);
  }
  router.push(redirect ?? "/");
});

const login = async () => {
  await authStore.login(email.value, password.value);
  router.push(redirect ?? "/");
};

const signUp = async () => {
  await authStore.signUp(email.value, password.value);
  successToast("You were successfully signed up! Check your email to confirm.");
};

watch(
  () => authType.value,
  (newValue) => (onSubmit.handler = newValue === "LOGIN" ? login : signUp),
  { immediate: true }
);

const oAuthLogin = asyncLoading(async (provider: Provider) => {
  try {
    await authStore.oAuthLogin(provider, redirect ?? "/");
  } catch (e) {
    errorToast(e);
  }
});
</script>
