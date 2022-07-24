<template>
  <main>
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
      <!--<iframe
            src="https://www.youtube-nocookie.com/embed/PKwAa3xsEe8?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0"
            frameborder="0"
            allowfullscreen
          >
          </iframe>-->
    </div>
  </main>
  <footer>
    <div class="button-container">
      <van-button round block type="primary" native-type="submit" @click="toLogin" loading-text="Logging in...">
        Continue
      </van-button>
    </div>

    <div class="whitespace-tiny" />
  </footer>
</template>

<script setup lang="ts">
const router = useRouter();
function toLogin() {
  router.push("/login");
}
</script>

<style scoped>
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
</style>
