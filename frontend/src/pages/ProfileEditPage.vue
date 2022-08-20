<template>
  <van-form class="stacked-container nav-page" @submit="onSubmit.handler">
    <main>
      <div class="text-container">
        <h3>
          {{ store.isRegistered ? "Edit Profile" : "Welcome to Matchy!" }}
        </h3>
        <p style="color: var(--light-text)" v-if="!store.isRegistered">
          Enter your full name and a description below to continue.
        </p>
      </div>

      <van-cell-group inset>
        <van-field
          v-model="formData.email"
          label="Email"
          placeholder="Login with email"
          :disabled="true"
        />

        <van-field
          v-model="formData.fullName"
          label="Full Name"
          placeholder="Your full name"
          :disabled="loadingProfile.loading"
          :rules="[{ required: true, message: 'Your full name is required' }]"
        />

        <van-field
          v-model="formData.description"
          label="Description"
          placeholder="Optionally: Everything you want others to know, like your instagram handle, your favorite food, etc."
          type="textarea"
          rows="3"
          autosize
          :disabled="loadingProfile.loading"
        />
      </van-cell-group>
    </main>

    <footer>
      <!-- submit button -->
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        :disabled="onSubmit.loading"
        :loading="onSubmit.loading"
      >
        {{ store.isRegistered ? "submit" : "register" }}
      </van-button>

      <div class="whitespace-xtiny"></div>

      <!-- sign out button -->
      <van-button
        v-if="!store.isRegistered"
        round
        block
        plain
        type="primary"
        @click="signOut"
        >sign out</van-button
      >
      <div class="whitespace-tiny" />
    </footer>
  </van-form>
</template>

<script setup lang="ts">
import { useUserStore, type Profile } from "../stores/user";
import { asyncLoading } from "../utils/loading";
import { supabase } from "@/services/supabase";
import router from "@/router";
import { showFailToast, showSuccessToast } from "vant";
const store = useUserStore();

const signOut = () => {
  supabase.auth.signOut();
  router.push("/");
};

const formData = ref<Profile>({});

const loadingProfile = asyncLoading(() =>
  store
    .fetchProfile()
    .then(() => {
      formData.value.email = store.profile.email;
      formData.value.fullName = store.profile.fullName;
      formData.value.description = store.profile.description;
    })
    .catch((e) => {
      console.log(e);
    })
);
console.log("ProfileEditPage.vue: Calling fetchProfile()");
loadingProfile.handler().catch((e) => console.log(e));

const onSubmit = asyncLoading(async () => {
  try {
    await store.updateProfile(formData.value);
    showSuccessToast("Updated");
    location.reload();
  } catch (error: any) {
    showFailToast("Error");
    console.error(error);
    alert(error.error_description || error.message);
  }
});
</script>
