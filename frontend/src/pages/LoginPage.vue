<template>
  <van-form class="stacked-container page" @submit="onSubmit.handler">
    <main>
      <Logo />

      <!-- First page -->
      <div v-if="firstPage">
        <div class="whitespace-xtiny" />
        <p class="question">Tired of paperwork?</p>
        <p class="answer">Well, so are we. That's why we made matchy!</p>

        <p class="content">
          Matchy automatizes the old school speed dating paperwork process and lets you focus on what matters most: making fun
          experiences and lasting relationships.
        </p>
        <p class="content">
          It provides a truly unique and seamless experience from your registration to finding out who you matched with.
        </p>

        <div class="whitespace-xxtiny" />
        <p>Check this sweet demo out to figure out how it works:</p>

        <div class="centered-container">
          <!-- Add "?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0" to youtube's links -->
          <iframe
            src="https://www.youtube-nocookie.com/embed/PKwAa3xsEe8?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>

      <!-- Second page -->
      <div v-else>
        <div class="whitespace-tiny" />
        <p>
          With matchy you don't even need a password. This means you can log right in or register just by clicking a link in
          your inbox and don't have to remember anything.
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
      </div>
    </main>

    <!-- Button (on every page) -->
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
          {{ firstPage ? "continue" : "send me a link" }}
        </van-button>
      </div>

      <div class="whitespace-tiny" />
    </footer>
  </van-form>
</template>

<script setup lang="ts">
import { supabase } from "../services/supabase";
import { asyncLoading } from "../utils/loading";

const firstPage = ref(true);
const email = ref("");

const onSubmit = asyncLoading(async () => {
  // change content
  if (firstPage) {
    firstPage.value = false;
    return;
  }

  // TODO: use toast notifications from vant

  try {
    // Use magic links instead of passwords
    const { error } = await supabase.auth.signIn({ email: email.value });
    if (error) throw error;
    alert("Check your email for the login link!");
  } catch (error: any) {
    console.error(error);
    alert(error.error_description || error.message);
  }
});
</script>

<style>
/* Splits page into 'main'-part and 'footer'-part */
/* place footer at viewport bottom (unless there is text to scroll) */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* content */
.question {
  margin-bottom: -0.7rem;
}
.answer {
  color: var(--light-text);
}
.content {
  margin-left: 1rem;
}
iframe {
  width: 100%;
}

/* footer */
footer {
  width: 100%;
}
</style>
