<template>
  <v-main>
    <v-container>
      <div class="pt-4 mb-12">
        <div class="d-flex align-center mb-8">
          <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
          <span class="d-block text-h6 font-weight-bold">
            Forgot Your Password?
          </span>
        </div>
        <span class="d-block">No problem. We've got you covered.</span
        ><span class="d-block"
          >Just enter your email below to reset your password.</span
        >
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          v-model="email"
          label="Email"
          name="email"
          placeholder="aphrodite@mail.com"
          :rules="[() => hasEmail || 'Enter a valid email']"
        />
        <v-btn
          class="mx-auto d-block"
          type="submit"
          color="primary"
          width="50%"
          :disabled="submit.loading || !hasEmail"
          :loading="submit.loading"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          Reset</v-btn
        >
      </v-form>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const email = ref("");

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));

const submit = asyncLoading(async () => {
  await authStore.resetPassword(email.value);
  successToast("We reset your password. Check your email to choose a new one.");
});
</script>
