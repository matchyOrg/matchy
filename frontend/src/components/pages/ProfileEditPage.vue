<template>
  <v-container class="ma-0 px-4 mt-8">
    <h3 class="text-h4 font-weight-bold">
      {{ authStore.isRegistered ? "Edit Profile" : "Welcome to Matchy!" }}
    </h3>
    <p style="color: var(--light-text)" v-if="!authStore.isRegistered">
      Enter your full name and a description below to continue.
    </p>
    <v-form class="mt-12" v-model="valid">
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
  </v-container>

  <div class="d-flex flex-column align-center">
    <v-btn
      class="mb-4 d-block"
      min-width="200"
      variant="outlined"
      color="primary"
      type="submit"
      @click="onSubmit.handler"
      :disabled="onSubmit.loading || !valid"
      :loading="onSubmit.loading"
    >
      {{ authStore.isRegistered ? "submit" : "register" }}
    </v-btn>

    <!-- sign out button -->
    <v-btn
      class="d-block"
      min-width="200"
      variant="outlined"
      color="secondary"
      @click="logout"
      >sign out</v-btn
    >
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { asyncLoading } from "@/utils/loading";
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
      console.log(e);
    })
);
loadingProfile.handler();

const onSubmit = asyncLoading(async () => {
  try {
    await profileService.updateProfile(formData.value);
  } catch (error: any) {
    console.error(error);
  }
});

function logout() {
  authStore.logout();
  router.push("/login");
}
</script>
