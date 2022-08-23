<!-- The user is stuck on this page until there is a change in the "user store" -->
<template>
  <v-container class="full-height" :style="{ position: 'relative' }">
    <h3>🐱 matchy: paperless speed dating</h3>

    <p>Are you ready?</p>
    <p>
      You don't need a password to register or log in. <br />
      Just enter your email address below:
    </p>

    <!-- Email field -->
    <v-form>
      <v-text-field
        filled
        v-model="email"
        name="Email"
        label="Email"
        placeholder="geniusPinapple@mail.com"
        :rules="[(value) => !!value || 'required']"
      ></v-text-field>
      <div class="mailSent" v-if="mailSent">
        <p>A mail was sent to you.</p>
      </div>
    </v-form>
    <div
      class="d-flex"
      :style="{
        position: 'absolute',
        bottom: '1rem',
        width: '100%',
      }"
    >
      <v-btn
        class="mb-4 mx-auto"
        rounded
        size="x-large"
        type="submit"
        color="blue"
        :disabled="onSubmit.loading"
        :loading="onSubmit.loading"
        @click="onSubmit.handler"
      >
        <template v-slot:loader>
          <span>Logging in...</span>
        </template>
        {{ !mailSent ? "send me an email" : "resend the email" }}
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { asyncLoading } from "@/utils/loading";
import { useSupabaseWrapper } from "@/services/supabase";
const router = useRouter();
const authStore = useAuthStore();
const supabaseWrapper = useSupabaseWrapper();

const email = ref("");
const mailSent = ref(false);

// send magic link to user
const onSubmit = asyncLoading(async () => {
  mailSent.value = true;
  try {
    const { error } = await supabaseWrapper.login(email.value);
    if (error) {
      throw error;
    }
    showToast("Check your email for the login link!");
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});

// magic link clicked in another window
watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      console.log(
        "A login link was clicked (possibly in another window). Redirecting to '/'"
      );
      router.push("/");
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.full-height {
  min-height: 100vh;
}
.explaination-button {
  width: 100%;
  border-style: none !important;
  border-radius: 25px !important;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: 8px 8px 16px #bfbfbf, -8px -8px 16px #ffffff;
}

.mailSent {
  color: var(--light-text);
}

.spin {
  animation: loader 1s infinite;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
