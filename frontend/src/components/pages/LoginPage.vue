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
      <div class="mailSent" v-if="mailSent">
        <p>A mail was sent to you.</p>
      </div>

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
import { useSupabaseWrapper } from "@/services/supabase";
const router = useRouter();
const authStore = useAuthStore();
const supabaseWrapper = useSupabaseWrapper();

const email = ref("");
const mailSent = ref(false);

// send magic link to user
const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  try {
    const { error } = await supabaseWrapper.login(email.value);
    if (error) {
      throw error;
    }
    showToast("Check your email for the login link!");
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});

// magic link clicked in another window
watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      console.log(
        "A login link was clicked (possibly in another window). Redirecting to '/'"
      );
      router.push("/");
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.explaination-button {
  width: 100%;
  border-style: none !important;
  border-radius: 25px !important;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: 8px 8px 16px #bfbfbf, -8px -8px 16px #ffffff;
}

.mailSent {
  color: var(--light-text);
}
</style>
