<template>
  <van-form class="stacked-container page" @submit="onSubmit.handler">
    <main>
      <Logo />

      <div class="whitespace-tiny" />
      <p>
        With matchy you don't even need a password. This means you can log right in or register just by clicking a link in your
        inbox and don't have to remember anything.
      </p>
      <p>Enter your mail to continue.</p>

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
          Send me a link
        </van-button>
      </div>

      <div class="whitespace-tiny" />
    </footer>
  </van-form>
</template>

<script setup lang="ts">
import { supabase } from "../services/supabase";
import { asyncLoading } from "../utils/loading";

const email = ref("");

const onSubmit = asyncLoading(async () => {
  try {
    // Use magic links instead of passwords
    const { error } = await supabase.auth.signIn({ email: email.value });
    if (error) throw error;
    showToast("Check your email for the login link!");

    // TODO: redirect to the home page after having logged in or something
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
