<template>
  <v-progress-circular
    :size="size"
    :width="width"
    :color="color"
    :model-value="(modelValue / max) * 100"
  >
    <div class="d-flex flex-column align-center pt-4">
      <span :class="'text-black d-block ' + textClass">{{ displayTime }}</span>
      <span class="text-grey d-block">min. left</span>
    </div>
  </v-progress-circular>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: number;
    max: number;
    size?: string;
    width?: string;
    color?: string;
    textClass?: string;
  }>(),
  { size: "180", width: "12", color: "primary", textClass: "text-h4" }
);

const displayTime = computed(() => {
  const minutes = Math.floor(props.modelValue / (60 * 1000));
  const seconds = Math.ceil((props.modelValue % (60 * 1000)) / 1000);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
});
</script>
