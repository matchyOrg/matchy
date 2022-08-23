<!-- The user is stuck on this page until there is a change in the "user store" -->
<template>
  <v-container class="full-height" :style="{ position: 'relative' }">
    <h3>🐱 matchy: paperless speed dating</h3>

    <p>Are you ready?</p>
    <p>
      You don't need a password to register or log in. <br />
      Just enter your email address below:
    </p>

    <!-- Email field -->
    <v-form>
      <v-text-field
        filled
        v-model="email"
        name="Email"
        label="Email"
        placeholder="geniusPinapple@mail.com"
        :rules="[(value) => !!value || 'required']"
      ></v-text-field>
      <div class="mailSent" v-if="mailSent">
        <p>A mail was sent to you.</p>
      </div>
    </v-form>
    <div
      class="d-flex"
      :style="{
        position: 'absolute',
        bottom: '1rem',
        width: '100%',
      }"
    >
      <v-btn
        class="mb-4 mx-auto"
        rounded
        size="x-large"
        type="submit"
        color="blue"
        :disabled="onSubmit.loading"
        :loading="onSubmit.loading"
        @click="onSubmit.handler"
      >
        <template v-slot:loader>
          <span>Logging in...</span>
          <v-progress-circular indeterminate />
        </template>
        {{ !mailSent ? "send me an email" : "resend the email" }}
      </v-btn>
    </div>
  </v-container>
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
.full-height {
  min-height: 100vh;
}
.mailSent {
  color: var(--light-text);
}
</style>
