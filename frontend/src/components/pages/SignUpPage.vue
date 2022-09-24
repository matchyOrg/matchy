<template>
  <v-main>
    <v-container v-if="!registered">
      <div class="pt-4 mb-8">
        <div class="d-flex align-center mb-6">
          <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
          <span class="d-block text-h6 font-weight-bold">
            Welcome to Matchy.
          </span>
        </div>
        <span class="d-block">Thanks for joining us.</span
        ><span class="d-block">We're just as excited as you are!</span
        ><span class="d-block">First let's set your account up</span>
      </div>
      <v-form @submit.prevent="submit.handler">
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="aphrodite@mail.com"
          name="email"
          :rules="[(val) => hasEmail || 'Please enter a valid email']"
        />
        <v-text-field
          v-model="password"
          :type="showPW ? 'text' : 'password'"
          label="Password"
          placeholder="secret password"
          :append-icon="showPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPW = !showPW"
        />
        <v-text-field
          v-model="repeatPassword"
          :type="showRepeatPW ? 'text' : 'password'"
          label="Repeat password"
          placeholder="repeat secret password"
          :append-icon="showRepeatPW ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showRepeatPW = !showRepeatPW"
          :rules="[(val) => val === password || 'Passwords must match']"
        />
        <v-btn
          :loading="submit.loading"
          :disabled="submit.loading || !hasEmail || repeatPassword !== password"
          color="primary"
          class="d-block mx-auto"
          width="67%"
          type="submit"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate />
          </template>
          Register</v-btn
        >
      </v-form>
    </v-container>
    <v-container v-else class="h-75">
      <div class="d-flex align-center mt-6">
        <img class="mr-2" src="@/assets/matchyLogo.svg" height="24" />
        <span class="d-block text-h6 font-weight-bold">
          Welcome to Matchy.
        </span>
      </div>
      <div class="h-100 d-flex flex-column justify-center pt-4">
        <span class="d-block text-h6 font-weight-bold">
          Thanks for joining Matchy!
        </span>
        <span class="d-block">
          We've sent you an email with your confirmation link!
        </span>
        <v-btn class="mt-4" to="/login" variant="text" color="primary"
          >Log in</v-btn
        >
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const authStore = useAuthStore();
const { t } = useI18n();

const registered = ref(false);

const email = ref("");
const password = ref("");
const repeatPassword = ref("");

const submit = asyncLoading(async () => {
  console.log("signup");
  await authStore.signUp(email.value, password.value);
  registered.value = true;
  successToast(t("pages.login.successful-signup"));
});

const showPW = ref(false);
const showRepeatPW = ref(false);

const hasEmail = computed(() => /^[^]+@[^]+$/.test(email.value));
</script>
