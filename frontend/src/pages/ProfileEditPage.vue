<template>
  <div>
    {{ store.user }}
    <h1>Your Profile</h1>
    <van-form @submit="onSubmit.handler" v-if="store.user">
      <h2>User Data</h2>
      <van-cell-group inset>
        <van-field v-model="username" label="Name" placeholder="Your name" :disabled="loadingProfile.loading" />
      </van-cell-group>

      <h2>Login Information</h2>
      <van-cell-group inset>
        <van-field v-model="store.user.email" label="Email" placeholder="Login with email" :disabled="true" />
      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" :disabled="onSubmit.loading" :loading="onSubmit.loading">
          Submit
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { useUserStore } from "../stores/user";
import { asyncLoading } from "../utils/loading";

const store = useUserStore();
const username = ref("");

const loadingProfile = asyncLoading(() =>
  store.loadProfile().then(() => {
    username.value = store.profile.username;
  })
);
loadingProfile.handler();

const onSubmit = asyncLoading(async () => {
  try {
    await store.updateProfile({ username: username.value });
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});
</script>
