<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <header v-if="!isSubtitle" class="flex align-center mb-6">
    <img class="mr-2" src="@/assets/matchyLogo.svg" height="19" />
    <h2 class="leading-tight break-all">
      <slot></slot>
    </h2>
  </header>
  <header v-else class="d-flex align-center mb-4">
    <img class="mr-2" src="@/assets/matchyLogo.svg" height="17" />
    <h2 class="leading-tight break-all text-h6 font-weight-bold">
      <slot></slot>
    </h2>
  </header>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ isSubtitle?: boolean }>();
</script>
