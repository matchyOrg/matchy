<template>
  <div class="h-100 d-flex flex-column justify-space-between">
    <v-main class="mx-9 mt-8">
      <h6 class="text-h4 font-weight-bold">
        {{ authStore.isRegistered ? "Edit Profile" : "Welcome to Matchy!" }}
      </h6>
      <p class="text-grey" v-if="!authStore.isRegistered">
        Enter your full name and a description below to continue.
      </p>
      <v-form class="mt-8" v-model="valid">
        <v-text-field
          v-model="formData.email"
          label="Email"
          placeholder="Login with email"
          :disabled="true"
          variant="outlined"
          prepend-icon="mdi-mail"
        />
        <v-text-field
          v-model="formData.fullName"
          label="Full Name"
          placeholder="Your full name"
          :disabled="loadingProfile.loading"
          :rules="[(v) => !!v || 'Your full name is required']"
          variant="outlined"
          prepend-icon="mdi-account"
        />
        <v-textarea
          v-model="formData.description"
          label="Description"
          placeholder="Tell us about yourself"
          :disabled="loadingProfile.loading"
          variant="outlined"
        />
      </v-form>
    </v-main>

    <div class="mt-auto mb-8 d-flex flex-column align-center">
      <!-- update button -->
      <v-btn
        class="mb-4"
        size="x-large"
        color="primary"
        variant="tonal"
        append-icon="mdi-email"
        rounded="pill"
        type="submit"
        minWidth="20rem"
        @click="onSubmit.handler"
        :disabled="onSubmit.loading || !valid"
        :loading="onSubmit.loading"
      >
        {{ authStore.isRegistered ? "submit" : "register" }}
      </v-btn>

      <!-- sign out button -->
      <!-- FLIP LOGIC AROUND! SHOW ONLY WHEN NOT REGISTERED -->
      <v-btn
        v-if="authStore.isRegistered"
        size="x-large"
        color="secondary"
        variant="tonal"
        append-icon="mdi-email"
        rounded="pill"
        type="submit"
        minWidth="20rem"
        @click="logout"
        >sign out</v-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useProfileService, type Profile } from "@/services/profileService";

const authStore = useAuthStore();
const router = useRouter();
const profileService = useProfileService();

const formData = ref<Profile>({});
const valid = ref(false);

// immediately call loadingProfile, update loading state
const loadingProfile = asyncLoading(() =>
  profileService
    .readProfile()
    .then((profile) => {
      formData.value.email = profile.email;
      formData.value.fullName = profile.fullName;
      formData.value.description = profile.description;
    })
    .catch((e) => {
      errorToast(e);
    })
);
loadingProfile.handler();

const onSubmit = asyncLoading(async () => {
  try {
    await profileService.updateProfile(formData.value);
  } catch (error: any) {
    errorToast(error);
  }
});

function logout() {
  authStore.logout();
  router.push("/login");
}
</script>
