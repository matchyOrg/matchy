<template>
  <van-form class="stacked-container page" @submit="onSubmit.handler">
    <main>
      <h3>🐱 matchy: paperless speed dating</h3>

      <!-- Introduction popup -->
      <van-button block @click="showPopup">Woah, how does it work?</van-button>
      <van-popup v-model:show="show" closeable round position="bottom" :style="{ height: '80vh' }">
        <LoginIntroduction />
      </van-popup>

      <div class="whitespace-tiny" />

      <p>Are you ready?</p>
      <p>
        You don't need a password to register or log in. <br />
        Just enter your email address below:
      </p>

      <div class="whitespace-medium" />

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
import { supabase } from "../services/supabase";
import { asyncLoading } from "../utils/loading";

// introduction popup
const show = ref(false);
const showPopup = () => {
  show.value = true;
};

// mail field
const email = ref("");

// whether button was clicked
const mailSent = ref(false);

const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  try {
    // Use magic links instead of passwords
    const { error } = await supabase.auth.signIn({ email: email.value });
    if (error) throw error;
    showToast("Check your email for the login link!");

    // TODO: redirect to the home page after having logged in or something
    // ^ redirecting the user to the page they already are on? how do we know they clicked the link? 
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});
</script>

<style scoped>
/* Splits page into 'main'-part and 'footer'-part */
/* place footer at viewport bottom (unless there is text to scroll) */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* footer */
footer {
  width: 100%;
}
</style>
