<script lang="ts" setup>
import { ref } from 'vue'

const msg = ref('骤雨重山，将甘苦注入他')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" />
</template>

<style scoped>
h1 {
  color: red;
}
</style>
