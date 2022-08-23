<template>
  <van-form class="stacked-container nav-page" @submit="onSubmit.handler">
    <main>
      <div class="text-container">
        <h3>
          {{ authStore.isRegistered ? "Edit Profile" : "Welcome to Matchy!" }}
        </h3>
        <p style="color: var(--light-text)" v-if="!authStore.isRegistered">
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
        {{ authStore.isRegistered ? "submit" : "register" }}
      </van-button>

      <div class="whitespace-xtiny"></div>

      <!-- sign out button -->
      <van-button
        v-if="!authStore.isRegistered"
        round
        block
        plain
        type="primary"
        @click="authService.logout()"
        >sign out</van-button
      >
      <div class="whitespace-tiny" />
    </footer>
  </van-form>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { asyncLoading } from "@/utils/loading";
import { showFailToast, showSuccessToast } from "vant";
import { useProfileService, type Profile } from "@/services/profileService";
import { useAuthService } from "@/services/supabase";
const authStore = useAuthStore();
const profileService = useProfileService();
const authService = useAuthService();

const formData = ref<Profile>({});

// immediately call loadingProfile, update loading state
const loadingProfile = asyncLoading(() =>
  profileService
    .readProfile()
    .then((profile) => {
      console.log("Called readProfile(), got:", profile);
      formData.value.email = profile.email;
      formData.value.fullName = profile.fullName;
      formData.value.description = profile.description;
    })
    .catch((e) => {
      console.log(e);
    })
);
loadingProfile.handler().catch((e) => console.log(e));

const onSubmit = asyncLoading(async () => {
  try {
    await profileService.updateProfile(formData.value);
    showSuccessToast("Updated");
  } catch (error: any) {
    showFailToast("Error");
    console.error(error);
    alert(error.error_description || error.message);
  }
});
</script>
