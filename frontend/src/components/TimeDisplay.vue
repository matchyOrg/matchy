<template>
  <v-progress-circular
    :size="size"
    :width="width"
    :color="color"
    :model-value="(modelValue / max) * 100"
  >
    <div class="d-flex flex-column align-center pt-4">
      <v-progress-circular v-if="loading" indeterminate class="d-block" />
      <span v-else :class="'text-black d-block ' + textClass">{{
        displayTime
      }}</span>
      <span class="text-grey d-block">min. left</span>
    </div>
  </v-progress-circular>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /**
     * The time to show in milliseconds.
     * @model
     */
    modelValue: number;
    /**
     * The maximum time that may be displayed in milliseconds.
     * Used as a reference for progress.
     */
    max: number;
    /**
     * Controls whether a loading state should be display.
     * @defaultValue false
     */
    loading?: boolean;
    /**
     * The size in pixels.
     * @defaultValue "180"
     */
    size?: string;
    /**
     * The width of the progress bar in pixels.
     * @defaultValue "12"
     */
    width?: string;
    /**
     * The color of the progress bar.
     * @defaultValue "primary"
     */
    color?: string;
    /**
     * Class string to use for the main text element.
     * @defaultValue "text-h4"
     */
    textClass?: string;
  }>(),
  {
    loading: false,
    size: "180",
    width: "12",
    color: "primary",
    textClass: "text-h4",
  }
);

const displayTime = computed(() => {
  const minutes = Math.floor(props.modelValue / (60 * 1000));
  const seconds = Math.floor((props.modelValue % (60 * 1000)) / 1000);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
});
</script>
