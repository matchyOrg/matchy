<!-- The user is stuck on this page until there is a change in the "user store" -->
<template>
  <van-form class="stacked-container page" @submit="onSubmit.handler">
    <main>
      <h3>🐱 matchy: paperless speed dating</h3>

      <!-- Introduction popup -->
      <van-button block @click="showPopup">Woah, so how does it work?</van-button>
      <van-popup v-model:show="show" closeable round position="bottom" :style="{ height: '80vh' }">
        <LoginModal />
      </van-popup>

      <div class="whitespace-tiny" />

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
      <div v-if="mailSent">
        <p>A mail has been sent to you!</p>
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
import { useUserStore } from "@/stores/user";
import { supabase } from "../services/supabase";
import { asyncLoading } from "../utils/loading";
import LoginModal from "../components/LoginModal.vue";
const router = useRouter();
const userStore = useUserStore();

// popup
const show = ref(false);
const showPopup = () => {
  show.value = true;
};

const email = ref("");
const mailSent = ref(false);

// send magic link to user
const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  try {
    const { error } = await supabase.auth.signIn({ email: email.value });
    if (error) throw error;
    showToast("Check your email for the login link!");
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});

watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      console.log("A login link was clicked in another window. Redirecting to '/'");
      router.push("/");
    }
  },
  { immediate: true }
);
</script>
