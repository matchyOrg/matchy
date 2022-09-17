<template>
  <v-main>
    <!-- logo -->
    <SiteLogo class="mt-3"></SiteLogo>

    <!-- email field -->
    <div class="mx-9 mt-13">
      <p>{{ t("pages.login.password-text") }}</p>
      <p>{{ t("pages.login.enter-email-text") }}</p>
      <v-form
        class="mt-8 mb-5"
        :model-value="hasEmail"
        @submit.prevent="onSubmit.handler"
      >
        <v-text-field
          filled
          type="email"
          v-model="email"
          name="Email"
          label="Email"
          placeholder="geniusPinapple@mail.com"
          :rules="[(value) => !!value || 'Required']"
        ></v-text-field>

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
              {{
                !mailSent
                  ? t("pages.login.send-button-text")
                  : t("pages.login.resend-button-text")
              }}
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
const mailSent = ref(false);

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));

watch(
  () => authStore.user,
  () => router.push(redirect ?? "/")
);

const onSubmit = asyncLoading(async () => {
  // TODO: This is still flawed, especially the hash in the URL is troublesome
  const redirectTo =
    new URL(
      router.resolve("/callback").href,
      new URL(import.meta.env.BASE_URL, window.location.origin)
    ) + "#";
  console.log("Will redirect to", redirectTo);
  try {
    await authStore.login(email.value, redirectTo);
    mailSent.value = true;

    successToast(t("pages.login.check-mail"));
  } catch (e) {
    errorToast(e);
  }
});
</script>
