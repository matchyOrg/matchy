<template>
  <v-main>
    <v-container>
      <div class="pt-4 mb-8">
        <div class="d-flex align-center mb-6">
          <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
          <span class="d-block text-h6 font-weight-bold">
            Choose a new password
          </span>
        </div>
        <span class="d-block"
          >Keep in mind: Using a password manager will help you set up a super
          secure password that you won't even need to remember. Pretty
          convenient stuff.</span
        >
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          v-model="password"
          :type="showPW ? 'text' : 'password'"
          label="Password"
          placeholder="secret password"
          :append-icon="showPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPW = !showPW"
        />
        <v-text-field
          v-model="repeatPassword"
          :type="showRepeatPW ? 'text' : 'password'"
          label="Repeat password"
          placeholder="repeat secret password"
          :append-icon="showRepeatPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showRepeatPW = !showRepeatPW"
          :rules="[(val) => val === password || 'Passwords must match']"
        />
        <v-btn
          :loading="submit.loading"
          :disabled="
            submit.loading ||
            repeatPassword !== password ||
            repeatPassword !== password
          "
          color="primary"
          class="d-block mx-auto"
          width="67%"
          type="submit"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          Confirm</v-btn
        >
      </v-form>
    </v-container>
  </v-main>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const password = ref("");
const repeatPassword = ref("");

const submit = asyncLoading(async () => {
  await authStore.setNewPassword(password.value);
  successToast("New password was set");
});

const showPW = ref(false);
const showRepeatPW = ref(false);
</script>
