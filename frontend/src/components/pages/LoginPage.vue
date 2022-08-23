<!-- The user is stuck on this page until there is a change in the "user store" -->
<template>
  <van-form class="stacked-container page" @submit="onSubmit.handler">
    <main>
      <h3>🐱 matchy: paperless speed dating</h3>

      <p>Are you ready?</p>
      <p>
        You don't need a password to register or log in. <br />
        Just enter your email address below:
      </p>

      <div class="whitespace-tiny" />

      <!-- Email field -->
      <van-cell-group inset>
        <van-field
          v-model="email"
          name="Email"
          label="Email"
          placeholder="geniusPinapple@mail.com"
          :rules="[{ required: true, message: 'Email is required' }]"
        />
      </van-cell-group>
    </main>

    <footer>
      <!-- Email send button -->
      <div class="button-container">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="onSubmit.loading"
          :loading="onSubmit.loading"
          loading-text="Logging in..."
        >
          {{ !mailSent ? "send me an email" : "resend the email" }}
        </van-button>
      </div>

      <div class="whitespace-tiny" />
    </footer>
  </van-form>
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
.mailSent {
  color: var(--light-text);
}
</style>
