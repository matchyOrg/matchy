<template>
  <div class="h-100 d-flex flex-column justify-space-between">
    <v-main>
      <!-- logo -->
      <SiteLogo class="mt-3"></SiteLogo>

      <!-- email field -->
      <div class="mx-9 mt-13">
        <p>No need for passwords.</p>
        <p>Just enter your email below to register or log in.</p>
        <v-form class="mt-8 mb-5">
          <v-text-field
            filled
            v-model="email"
            name="Email"
            label="Email"
            placeholder="geniusPinapple@mail.com"
            :rules="[(value) => !!value || 'Required']"
          ></v-text-field>
        </v-form>
      </div>

      <!-- button -->
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
          :disabled="onSubmit.loading"
          :loading="onSubmit.loading"
          @click="onSubmit.handler"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          <span class="text-h6">
            {{ !mailSent ? "send" : "resend" }}
          </span>
        </v-btn>
      </div>
    </v-main>

    <v-footer class="d-flex justify-center pb-4" app>
      <!-- other links -->
      <router-link to="/about" class="mx-4 text-grey"> about us </router-link>
      <router-link to="/legal" class="mx-4 text-grey">
        legal notice
      </router-link>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();

// TODO: If we're signed in, we should get yeeted away from the login page or at least see a message.

const email = ref("");
const mailSent = ref(false);

const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  // TODO: This doesn't work yet, especially the hash in the URL is troublesome
  const redirectTo =
    new URL(
      router.resolve("/callback").href,
      new URL(import.meta.env.BASE_URL, window.location.origin)
    ) + "?";
  console.log("Will redirect to", redirectTo);
  try {
    await authStore.login(email.value, redirectTo);
    successToast("Check your email for the login link!");
  } catch (e) {
    errorToast(e);
  }
});
</script>
