<script lang="ts" setup>
import { ref } from 'vue';

const msg = ref('Hello Vue 3 + TypeScript + Vite')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<style scoped>
h1 {
  color: red;
}
</style>
