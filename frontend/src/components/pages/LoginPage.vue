<template>
  <div class="main-footer-split-container">
    <main>
      <!-- logo -->
      <Logo class="mt-3"></Logo>

      <!-- email field -->
      <div class="mx-9 mt-13">
        <p>No need for passwords.</p>
        <p class="mb-8">Just enter your email below to register or log in:</p>
        <v-form>
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
    </main>

    <footer>
      <!-- button -->
      <div class="d-flex">
        <v-btn
          class="mb-15 mx-auto"
          size="x-large"
          color="primary"
          variant="tonal"
          append-icon="mdi-email"
          rounded="pill"
          type="submit"
          :style="{ width: '65%' }"
          :disabled="onSubmit.loading"
          :loading="onSubmit.loading"
          @click="onSubmit.handler"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          <span class="button-content">
            {{ !mailSent ? "send" : "resend" }}
          </span>
        </v-btn>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { asyncLoading } from "@/utils/loading";
const authStore = useAuthStore();

const email = ref("");
const mailSent = ref(false);

// send magic link to user
const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  await authStore.login(email.value);
  showToast("Check your email for the login link!");
});
</script>

<style scoped>
.button-content {
  font-size: 1.1rem;
}
</style>
