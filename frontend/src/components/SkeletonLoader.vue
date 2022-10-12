<!-- MVP APPROVED BY @SUESZLI -->
<template>
  <div
    v-for="i in numRows"
    :key="i"
    class="skeleton-loader mb-2"
    :style="style"
  />
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    width: string | number;
    height?: string | number;
    numRows?: number;
  }>(),
  { height: "16px", numRows: 1 }
);

const toCSS = (value: string | number): string => {
  return typeof value === "string" ? value : value + "px";
};

const style = reactive({
  width: computed(() => toCSS(props.width)),
  height: computed(() => toCSS(props.height)),
});
</script>

<style scoped>
.skeleton-loader {
  width: 200px;
  height: 16px;
  border-radius: 5px;
  background-color: lightgrey;
}
</style>
