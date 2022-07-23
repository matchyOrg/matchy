<template>
  <h1>Login - Organizer</h1>
  <h3>If you're a user, just click on a matchy-link</h3>

  <van-form @submit="onSubmit.handler">
    <van-cell-group inset>
      <van-field
        v-model="email"
        name="Email"
        label="Email"
        placeholder="Email"
        :rules="[{ required: true, message: 'Email is required' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        :disabled="onSubmit.loading"
        :loading="onSubmit.loading"
        loading-text="Logging in..."
      >
        Login
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { supabase } from "../services/supabase";
import { asyncLoading } from "../composables/loading";

const email = ref("");
const onSubmit = asyncLoading(async () => {
  try {
    // Magic links!
    const { error } = await supabase.auth.signIn({ email: email.value });
    if (error) throw error;
    alert("Check your email for the login link!");
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});
</script>
