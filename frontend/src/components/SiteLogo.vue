<script setup lang="ts">
import { version } from "@/../package.json";
</script>
<template>
  <div class="stacked-container">
    <div class="logo-wrapper">
      <img src="@/assets/matchyLogoGreen.svg" height="40" />
    </div>
    <div class="subText text-grey-darken-3">paperless speed dating</div>
  </div>
</template>

<style scoped>
.stacked-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

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
  color: var(--light-text);
}

.subText {
  font-size: 0.85rem;
  margin-top: -0.4rem;
  letter-spacing: 0.034rem;
}
</style>
