<template>
  <van-form class="stacked-container page">
    <main>
      <h1>Edit profile</h1>
      {{ store.profile }}
    </main>

    <footer>
      <!-- logout button -->
      <div class="button-container">
        <van-button round block type="primary" @click="signOut">sign out</van-button>
      </div>

      <div class="whitespace-tiny" />
    </footer>
  </van-form>

  <!-- <van-form @submit="onSubmit.handler" v-if="store.isRegistered">
    <van-cell-group inset>
      <van-field v-model="store.user.email" label="Email" placeholder="Login with email" :disabled="true" />
    </van-cell-group>
  </van-form> -->

  <div class="whitespace-xlarge" />
  <!-- <van-form @submit="onSubmit.handler" v-if="store.isRegistered">
    <h2>User Data</h2>
    <van-cell-group inset>
      <van-field v-model="formData.username" label="Name" placeholder="Your name" :disabled="loadingProfile.loading" />
    </van-cell-group>

    <van-cell-group inset>
      <van-field v-model="store.user.email" label="Email" placeholder="Login with email" :disabled="true" />
    </van-cell-group>

    <van-button round block type="primary" native-type="submit" :disabled="onSubmit.loading" :loading="onSubmit.loading">
      Submit
    </van-button>
  </van-form> -->
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { asyncLoading } from "../utils/loading";
import { supabase } from "@/services/supabase";
import router from "@/router";
const store = useUserStore();

console.log("LOGGED IN: ", store.isLoggedIn);
console.log("REGISTERED: ", store.isRegistered);

const signOut = () => {
  supabase.auth.signOut();
  router.push("/");
};

// const formData = ref(store.emptyProfile());

// const loadingProfile = asyncLoading(() =>
//   store.fetchProfile().then(() => {
//     formData.value = store.profile;
//   })
// );
// loadingProfile.handler();

// const onSubmit = asyncLoading(async () => {
//   try {
//     await store.updateProfile(formData.value);
//   } catch (error: any) {
//     console.error(error);
//     alert(error.error_description || error.message);
//   }
// });
</script>
