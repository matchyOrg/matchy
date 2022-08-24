<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="stacked-container">
    <div class="logo-wrapper">
      <span class="logo">🐱</span>
      <span class="mainText mx-1">matchy</span>
      <span class="superText font-thin">pre-alpha</span>
    </div>

    <div class="subText">paperless speed dating</div>
  </div>
</template>

<style scoped>
.logo-wrapper {
  text-align: center;
}
.logo {
  font-size: 1.5rem;
  display: inline-block;
  transform: translateY(0.3rem);
}
.mainText {
  vertical-align: middle;
  font-size: 2rem;
}
.superText {
  vertical-align: super;
  color: #777;
}

.subText {
  font-size: 0.85rem;
  margin-top: -0.4rem;
  color: #777;
  letter-spacing: 0.034rem;
}
</style>
