<script setup lang="ts">
interface Props {
  checked: boolean;
}
const { checked = false } = defineProps<Props>();
</script>

<template>
  <div class="toggle flex w-2.5em h-1.625em ml-auto rounded-full relative">
    <input type="checkbox" class="checkbox opacity-0 w-full h-full absolute z-2" :checked="checked" />
    <div class="knobs" />
    <div class="layer" />
  </div>
</template>

<style scoped>
.toggle .knobs {
  @apply rounded-full h-full w-1.125em relative;
}

.toggle .knobs::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 2px;
  background-color: #ff6666;
  z-index: 1;
  transition: 0.8s ease all, left 0.3s cubic-bezier(0.2, 1.35, 0.2, 1.35);
  height: 1.375em;
  width: 1.375em;
  opacity: 0.7;
  @apply rounded-full;
}

.toggle .checkbox:active ~ .knobs::before {
  transform: scaleX(0.5);
  /*transform: scaleX(0.2);*/
}

.toggle .checkbox:checked ~ .knobs::before {
  /*right: 2px;*/
  opacity: 1;
  left: calc(100% - 2px);
}

.toggle .layer {
  @apply absolute w-full h-full rounded-full;
}

.toggle .layer::before {
  content: "";
  position: absolute;
  z-index: 0;
  @apply absolute w-full h-full rounded-full;
  background: white;
  transition: all ease 0.3s;
}

/*.toggle .checkbox:checked ~ .layer::before {
  background: white;
}*/
</style>
