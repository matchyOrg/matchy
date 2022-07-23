<template>
  <div class="page">
    <div class="page-top">
      <div class="logo">
        <img src="../assets/logo.png" />
        <span class="logo-topText">matchy</span>
        <span class="logo-superText"> alpha</span>
        <p class="logo-bottomText">paperless speed dating</p>
      </div>

      <div class="whitespace-xtiny" />
      <p class="question">Tired of meaningless paperwork?</p>
      <p class="answer">Well, so are we. That's why we made matchy!</p>

      <p class="content">
        Matchy automatizes the old school speed dating paperwork process and lets you focus on what matters most: making fun
        experiences and lasting relationships.
      </p>
      <p>Check this demo out to figure out how it works:</p>

      <div class="whitespace-small" />

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

    <div class="page-bottom">
      <router-link to="/login">
        <van-button round type="primary" size="large">Login / Signup</van-button>
      </router-link>
      <div class="whitespace-tiny" />
    </div>
  </div>
</template>

<style>
/* logo styling */
.logo {
  text-align: center;
}
.logo img {
  height: 2.5rem;
  transform: translate(-0.7rem, 1.6rem);
}
.logo-topText {
  vertical-align: middle;
  font-size: 2rem;
  font-weight: 500;
}
.logo-superText {
  vertical-align: super;
  font-weight: 0;
  color: var(--light-text);
}
.logo-bottomText {
  margin-top: 0.1rem;
  font-size: 0.64rem;
}

/* Content styling */
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
/* place button at viewport bottom (unless there is text to scroll) */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
