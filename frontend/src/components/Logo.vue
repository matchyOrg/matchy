<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="logo">
    <img src="../assets/logo.png" />
    <span class="logo-topText">matchy</span>
    <span class="logo-superText"> alpha</span>
    <p class="logo-bottomText">paperless speed dating</p>
  </div>
</template>

<style scoped>
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
</style>
