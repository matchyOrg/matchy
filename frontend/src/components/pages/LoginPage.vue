<template>
  <div class="h-100 d-flex flex-column justify-space-between">
    <main>
      <!-- logo -->
      <Logo class="mt-3"></Logo>

      <!-- email field -->
      <div class="mx-9 mt-13">
        <p>No need for passwords.</p>
        <p class="mb-8">Just enter your email below to register or log in.</p>
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

    <footer class="mb-12">
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
          :style="{ width: '65%' }"
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
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { asyncLoading } from "@/services/utils/loading";
import { successToast } from "@/services/utils/toastNotification";
const authStore = useAuthStore();

const email = ref("");
const mailSent = ref(false);

successToast("yo");

const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  await authStore.login(email.value);
  showToast("Check your email for the login link!");
});
</script>
